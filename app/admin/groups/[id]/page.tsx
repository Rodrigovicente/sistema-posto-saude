'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getStreets, getIntervals, addInterval, deleteInterval } from '../actions';
import { ptBrDictionary } from '@/lib/dictionary';
import { Interval } from '../../../types/interval';
import { Response } from '@/app/types/action-response';

export default function GroupIntervalsPage() {
  const params = useParams();
  const groupId = Number(params.id);

  const [selectedStreetId, setSelectedStreetId] = useState<number | null>(null);
  const [startNumber, setStartNumber] = useState<string>('1');
  const [endNumber, setEndNumber] = useState<string>('1');
  const [parity, setParity] = useState<'odd' | 'even' | 'both'>('both');

  const [intervalsList, setIntervalList] = useState<
    Array<Interval>
  >([]);

  const [streetsList, setStreetsList] = useState<
    Array<{ id: number; name: string }>
  >([]);
  
  const [responseError, setResponseError] = useState<Response<string> | null>(null);

  useEffect(() => {
    loadStreets();
    loadIntervals(groupId);
  }, []);

  async function loadStreets() {
    const loaded = await getStreets();
    setStreetsList(loaded);
  }

  async function loadIntervals(id: number) {
    const res = await getIntervals(id);
    setIntervalList(res);
  }

  function isParityCompatible(parity: string, start: number | null, end: number | null): 'start' | 'end' | 'both' | null {
    if (start === null || end === null) return null;
    if (parity === 'both') return null;
    
    const startEven = start % 2 === 0;
    const endEven = end % 2 === 0;

    if (parity === 'even') {
      if (startEven && endEven) {
        return null
      }
      if (!startEven) {
        if (!endEven) {
          return "both"
        }
        return "start"
      }
      else {
        return "end"
      }
    }
    if (parity === 'odd') {
      if (!startEven && !endEven) {
        return null
      }
      if (startEven) {
        if (endEven) {
          return "both"
        }
        return "start"
      }
      else {
        return "end"
      }
    }
    
    return null;
  }

  const startNum = parseInt(startNumber) || null;
  const endNum = parseInt(endNumber) || null;
  const orderError = startNum && endNum ? startNum > endNum : false;
  const parityError = isParityCompatible(parity, startNum, endNum);

  async function handleAddInterval(e: React.FormEvent) {
    e.preventDefault();
    if (groupId === null || selectedStreetId === null) return;

    const start = parseInt(startNumber);
    const end = parseInt(endNumber);

    if (isNaN(start) || isNaN(end)) return;
    if (start > end) return;

    const response = await addInterval(groupId, selectedStreetId, start, end, parity);

    setResponseError(response)
    console.log(response)

    setStartNumber('');
    setEndNumber('');
    setSelectedStreetId(null);
    loadIntervals(groupId);
  }

  async function handleDeleteInterval(id: number) {
    await deleteInterval(id);
    loadIntervals(groupId);
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">{ptBrDictionary["Add Address Intervals"]}</h1>

      {/* Back button */}
      <a href="/groups" className="inline-block mb-4 text-blue-600 hover:underline">
        ← {ptBrDictionary["Back to Groups List"]}
      </a>

      {/* Add Interval Form */}
      <form onSubmit={handleAddInterval} className="space-y-4 mb-8">
        {/* Street select */}
        <label className="block font-medium">{ptBrDictionary["Street"]}</label>
        <select
          value={selectedStreetId ?? ''}
          onChange={(e) => setSelectedStreetId(Number(e.target.value))}
          className="border px-4 py-2 w-full"
        >
          <option value="">{ptBrDictionary["Select a street..."]}</option>
          {streetsList.map((street) => (
            <option key={street.id} value={street.id}>
              {street.name}
            </option>
          ))}
        </select>

        {/* Number interval */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">{ptBrDictionary["Start Number"]}</label>
            <input
              type="number"
              min={1}
              max={9999999}
              value={startNumber}
              onChange={(e) => setStartNumber(e.target.value)}
              placeholder="0"
              className={`border px-4 py-2 w-full${parityError === "start" || parityError === "both" ? " outline outline-red-500" : ""}`}
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">{ptBrDictionary["End Number"]}</label>
            <input
              type="number"
              min={1}
              max={9999999}
              value={endNumber}
              onChange={(e) => setEndNumber(e.target.value)}
              placeholder="0"
              className={`border px-4 py-2 w-full${parityError === "end" || parityError === "both" ? " outline outline-red-500" : ""}`}
            />
          </div>
        </div>

        {/* Parity */}
        <label className="block font-medium mb-1">{ptBrDictionary["Parity"]}</label>
        <div className="flex gap-4">
          {(['odd', 'even', 'both'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setParity(p)}
              className={`px-4 py-2 rounded border ${
                parity === p ? 'bg-blue-600 text-white' : ''
              }`}
            >
              {ptBrDictionary[p]}
            </button>
          ))}
        </div>

        {/* Parity error message */}
        {parityError !== null && (
          <p className="text-red-600 font-medium">
            {ptBrDictionary["Parity and numbers are incompatible"]}
          </p>
        )}
        
        {/* Parity error message */}
        {orderError && (
          <p className="text-red-600 font-medium">
            {ptBrDictionary["Numbers order aren't valid"]}
          </p>
        )}

        <button
          type="submit"
          disabled={(parityError !== null) || orderError || (!selectedStreetId || !startNumber) }
          className={`mt-4 px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed`}
        >
          {ptBrDictionary["Add Interval"]}
        </button>

        { responseError?.success === false ? (
          <div className='border border-red-500 bg-red-100 p-2 rounded-sm'>
            <h5 className='text-red-500'>{ptBrDictionary["A error occurred while registering interval"]}</h5>
            { responseError.error != null ? <p className='text-gray-800'>{responseError.error}</p> : null }
          </div>
        ) : null }
      </form>

      {/* Show existing intervals for selected group */}
      <h3 className="font-semibold mb-2">{ptBrDictionary["Intervals in this group"]}</h3>
      {intervalsList.length === 0 ? (
        <p className="text-gray-500">{ptBrDictionary["No intervals added yet"]}</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">{ptBrDictionary["Street"]}</th>
              <th className="border px-4 py-2 text-left">{ptBrDictionary["Interval"]}</th>
              <th className="border px-4 py-2 text-left">{ptBrDictionary["Parity"]}</th>
              <th className="border px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {intervalsList.map((interval) => (
              <tr key={interval.id}>
                <td className="border px-4 py-2">{interval.name}</td>
                <td className="border px-4 py-2">
                  {interval.startNumber}–{interval.endNumber}
                </td>
                <td className="border px-4 py-2 capitalize">{ptBrDictionary[interval.parity]}</td>
                <td className="border px-4 py-2 text-right">
                  <button
                    onClick={() => handleDeleteInterval(interval.id)}
                    className="text-red-600 hover:underline"
                  >
                    {ptBrDictionary["Delete"]}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
