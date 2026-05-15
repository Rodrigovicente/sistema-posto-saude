import { getAuthStatus } from './auth-server';
import { LogoutButton } from './logout-button-client';

export async function AuthBar() {
  const isLoggedIn = await getAuthStatus();
  
  if (!isLoggedIn) return null;
  
  return <LogoutButton />;
}
