'use client';

import { useState } from 'react';

export default function SearchPage() {
  const [streetName, setStreetName] = useState('');
  const [houseNumber, setHouseNumber] = useState('');

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Search</h1>
      <div className="space-y-4">
        <label htmlFor="street-name" className="block text-sm font-medium">
          Street Name
        </label>
        <input
          id="street-name"
          type="text"
          value={streetName}
          onChange={(e) => setStreetName(e.target.value)}
          placeholder="Enter street name"
          className="w-full px-3 py-2 border rounded"
        />

        <label htmlFor="house-number" className="block text-sm font-medium">
          House Number
        </label>
        <input
          id="house-number"
          type="text"
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
          placeholder="Enter house number"
          className="w-full px-3 py-2 border rounded"
        />

        <button
          onClick={() => {
            console.log({ streetName, houseNumber });
          }}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Search
        </button>
      </div>
    </div>
  );
}
