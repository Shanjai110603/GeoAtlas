import * as SecureStore from 'expo-secure-store';
import { UserSession } from '@geoatlas/core';

const TOKEN_KEY = 'geoatlas_jwt_secure_token';

export async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (_) {
    return null;
  }
}

export async function setAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function loginMobile(email: string, password: string, baseUrl: string = 'http://10.0.2.2:3000'): Promise<UserSession> {
  const res = await fetch(`${baseUrl}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Login failed');
  }

  if (json.token) {
    await setAuthToken(json.token);
  }

  return json.user;
}
