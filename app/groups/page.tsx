'use client';

import { useState, useEffect } from 'react';
import { getGroups, getStreets, createGroup, getIntervals, addInterval, deleteInterval } from './actions';
import { ptBrDictionary } from '@/lib/dictionary';
import { Interval } from '../types/interval';

export default function GroupsPage() {
  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [groupsList, setGroupsList] = useState<
    Array<{ id: number; name: string }>
  >([]);

  // Interval state
  const [selectedStreetId, setSelectedStreetId] = useState<number | null>(null);
  const [startNumber, setStartNumber] = useState<string>('');
  const [endNumber, setEndNumber] = useState<string>('');
  const [parity, setParity] = useState<'odd' | 'even' | 'both'>('both');

  // Interval list for selected group
  const [intervalsList, setIntervalList] = useState<
    Array<Interval>
  >([]);

  const [streetsList, setStreetsList] = useState<
    Array<{ id: number; name: string }>
  >([]);

  useEffect(() => {
    loadGroups();
    loadStreets();
  }, []);

  async function loadGroups() {
    const loaded = await getGroups();
    setGroupsList(loaded);
  }

  async function loadStreets() {
    const loaded = await getStreets();
    setStreetsList(loaded);
  }

  async function loadIntervals(groupId: number) {
    const res = await getIntervals(groupId);
    setIntervalList(res);
  }

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!groupName.trim()) return;

    await createGroup(groupName);
    setGroupName('');
    loadGroups();
  }

  async function handleAddInterval(e: React.FormEvent) {
    e.preventDefault();
    if (selectedGroupId === null || selectedStreetId === null) return;

    const start = parseInt(startNumber);
    const end = parseInt(endNumber);

    if (isNaN(start) || isNaN(end)) return;
    if (start > end) {
      alert('Start number must be less than or equal to end number.');
      return;
    }

    await addInterval(selectedGroupId, selectedStreetId, start, end, parity);

    setStartNumber('');
    setEndNumber('');
    setSelectedStreetId(null);
    loadIntervals(selectedGroupId);
  }

  async function handleDeleteInterval(id: number) {
    await deleteInterval(id);
    if (selectedGroupId !== null) loadIntervals(selectedGroupId);
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}
        >
          1
        </div>
        <span className="text-lg font-semibold">{ptBrDictionary["Create Group"]}</span>
        <div className="flex-1 h-px bg-gray-300" />
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}
        >
          2
        </div>
        <span className="text-lg font-semibold">{ptBrDictionary["Add Address Intervals"]}</span>
      </div>

      {/* Step 1: Create Group */}
      {step === 1 && (
        <div>
          <form onSubmit={handleCreateGroup} className="flex gap-4 mb-6">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={ptBrDictionary["Group Name"]}
              className="border px-4 py-2 flex-1"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {ptBrDictionary["Create Group"]}
            </button>
          </form>

          {/* Existing groups */}
          <h3 className="font-semibold mb-4">{ptBrDictionary["Existing Groups"]}</h3>
          {groupsList.length === 0 ? (
            <p className="text-gray-500">{ptBrDictionary["No groups created yet"]}</p>
          ) : (
            <ul className="space-y-2">
              {groupsList.map((group) => (
                <li key={group.id} className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded">
                  <span>{group.name}</span>
                  <button
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      loadIntervals(group.id);
                      setStep(2);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {ptBrDictionary["Add Addresses to this group"]}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Back button */}
          {selectedGroupId && (
            <button
              onClick={() => setStep(1)}
              className="mt-4 text-blue-600 hover:underline"
            >
              ← {ptBrDictionary["Back to Step"]} 1
            </button>
          )}
        </div>
      )}

      {/* Step 2: Add Address Intervals */}
      {step === 2 && (
        <div>
          <h3 className="font-semibold mb-4">
            {ptBrDictionary["Adding intervals to group"]}: {groupsList.find(g => g.id === selectedGroupId)?.name}
          </h3>

          <form onSubmit={handleAddInterval} className="space-y-4 mb-8">
            {/* Street select */}
            <label className="block font-medium">{ptBrDictionary["Street"]}</label>
            <select
              value={selectedStreetId ?? ''}
              onChange={(e) => setSelectedStreetId(Number(e.target.value))}
              className="border px-4 py-2 w-full"
            >
              <option value="">Select a street...</option>
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
                  value={startNumber}
                  onChange={(e) => setStartNumber(e.target.value)}
                  placeholder="0"
                  className="border px-4 py-2 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">{ptBrDictionary["End Number"]}</label>
                <input
                  type="number"
                  value={endNumber}
                  onChange={(e) => setEndNumber(e.target.value)}
                  placeholder="0"
                  className="border px-4 py-2 w-full"
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

            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              {ptBrDictionary["Add Interval"]}
            </button>
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

          {/* Back button */}
          <button
            onClick={() => setStep(1)}
            className="mt-4 text-blue-600 hover:underline"
          >
            ← {ptBrDictionary["Back to Step"]} 1
          </button>
        </div>
      )}
    </div>
  );
}
