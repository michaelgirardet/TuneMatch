import { useAuthStore } from '@/store/authStore';

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const token = useAuthStore.getState().token;
  const headers = { ...init.headers } as Record<string, string>;

  // Ajoute Authorization seulement si token est défini
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Ajoute Content-Type uniquement si ce n'est pas du FormData
  if (!(init.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let response = await fetch(input, {
    ...init,
    headers,
    credentials: 'include',
  });

  // Si token expiré, tente de le refresh
  if (response.status === 401) {
    const refreshRes = await fetch('http://localhost:5001/api/auth/refresh-token', {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      useAuthStore.getState().setToken(accessToken);

      // Réessaie la requête initiale avec le nouveau token
      headers.Authorization = `Bearer ${accessToken}`;
      response = await fetch(input, {
        ...init,
        headers,
        credentials: 'include',
      });
    }
  }

  return response;
}
