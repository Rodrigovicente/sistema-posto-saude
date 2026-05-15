'use client';

import { logout } from "./actions";


export function LogoutButton() {
  async function handleLogout() {
    await logout();
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
