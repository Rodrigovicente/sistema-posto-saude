'use client';

import { ptBrDictionary } from '@/lib/dictionary';
import { useState, useEffect } from 'react';
import { searchAddress } from '../admin/groups/actions';
import { Response, SearchResult } from '../types/action-response';

export default function SearchPage() {
  const [streetName, setStreetName] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<null | Response<SearchResult>>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    
    if (!streetName.trim() || !houseNumber) return;
    
    setLoading(true);
    setSearchResult(null);
    
    const houseNum = parseInt(houseNumber);
    if (isNaN(houseNum)) {
      setLoading(false);
      return;
    }

    const result = await searchAddress(streetName.trim(), houseNum);
    setSearchResult(result);
    setLoading(false);
  }

  useEffect(() => {
    if (searchResult?.success === true) {
      console.log('Found:', searchResult.payload);
    } else if (searchResult?.success === false) {
      console.log('Error:', searchResult.error);
    }
  }, [searchResult]);

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 p-6 bg-gray-50 rounded-4xl border border-gray-200">
      <h1 className="text-center text-xl font-bold mb-8">Busca por endereço</h1>
      <form onSubmit={handleSearch} className="flex flex-row items-end mx-auto">
        <div className='grow'>
          <label htmlFor="street-name" className="block text-sm ml-5 font-medium text-gray-500">
            {ptBrDictionary["Street Name"]}
          </label>
          <input
            id="street-name"
            type="text"
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)}
            placeholder="Av. President"
            className="w-full px-3 py-2 border rounded-l-full bg-white"
          />
        </div>
        <div>
          <label htmlFor="house-number" className="block text-sm font-medium text-gray-500">
            {ptBrDictionary["House Number"]}
          </label>
          <input
            id="house-number"
            type="number"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            placeholder="9999"
            className="w-35 px-3 py-2 border border-l-0 rounded-r-full bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="min-w-28 h-10 px-4 py-2 ml-3 bg-black text-white border border-black rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          { loading ? 'Loading...' : ptBrDictionary["Search"] } 
        </button>
      </form>

      {/* search result bellow */}
      {searchResult && (
        <div className="mt-6">
          {searchResult.success === true && searchResult.payload ? (
            <div className="border border-green-500 bg-green-100 p-4 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2">Endereço encontrado!</h3>
              <p><strong>Rua:</strong> {searchResult.payload.street.name}</p>
              <p><strong>Número:</strong> {houseNumber}</p>
              <p><strong>Grupo:</strong> {searchResult.payload.group.name}</p>
              <p><strong>Intervalo:</strong> {searchResult.payload.interval.startNumber} – {searchResult.payload.interval.endNumber}</p>
              <p><strong>Paridade:</strong> {ptBrDictionary[searchResult.payload.interval.parity]}</p>
            </div>
          ) : (
            <div className="border border-red-500 bg-red-100 p-4 rounded-lg">
              <h3 className="font-bold text-red-800 mb-2">Endereço não encontrado</h3>
              { searchResult.error ? <p className="text-gray-800">{searchResult.error}</p> : null }
            </div>
          )}
        </div>
      )}
    </div>
  );
}
