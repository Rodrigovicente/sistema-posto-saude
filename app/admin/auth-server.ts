'use server';

import { cookies } from 'next/headers';

export async function getAuthStatus() {
  const cookieStore = await cookies();
  const session = cookieStore.get('auth_session');
  return session?.value === 'authenticated';
}
