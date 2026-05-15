'use client';

import { useState, useEffect } from 'react';
import { getGroups, createGroup } from './actions';
import { ptBrDictionary } from '@/lib/dictionary';

export default function GroupsPage() {
  const [groupName, setGroupName] = useState('');
  const [groupsList, setGroupsList] = useState<
    Array<{ id: number; name: string }>
  >([]);

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    const loaded = await getGroups();
    setGroupsList(loaded);
  }

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!groupName.trim()) return;

    await createGroup(groupName);
    setGroupName('');
    loadGroups();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">{ptBrDictionary["Manage Groups"]}</h1>
      {/* Create Group Form */}
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

      {/* Existing Groups List */}
          <h3 className="font-semibold mb-4">{ptBrDictionary["Existing Groups"]}</h3>
          {groupsList.length === 0 ? (
            <p className="text-gray-500">{ptBrDictionary["No groups created yet"]}</p>
          ) : (
            <ul className="space-y-2">
              {groupsList.map((group) => (
                <li key={group.id} className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded">
                  <span>{group.name}</span>
              <a
                href={`/groups/${group.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {ptBrDictionary["Edit"]}
              </a>
                </li>
              ))}
            </ul>
          )}
        </div>
  );
}

