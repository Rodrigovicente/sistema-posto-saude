'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const USERS = [
  { username: 'superuser', password: 'superadmin' },
  { username: 'postoabc', password: 'senha123' },
  { username: 'postoxyz', password: '123senha' },
];

export async function authenticateUser(username: string, password: string) {
  const user = USERS.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set('auth_session', 'authenticated', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_session');
  redirect('/admin/login');
}

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('auth_session');
  return session?.value === 'authenticated';
}
