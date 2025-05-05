import { useAuthStore } from '@/store/authStore';

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const token = useAuthStore.getState().token;
  let response = await fetch(input, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  // Si le token est expiré, tente de le refresh
  if (response.status === 401) {
    // Appel au backend pour refresh le token (le refresh token est en cookie httpOnly)
    const refreshRes = await fetch('http://localhost:5001/api/refresh-token', {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      useAuthStore.getState().setToken(accessToken); // Mets à jour le token Zustand

      // Réessaie la requête initiale avec le nouveau token
      response = await fetch(input, {
        ...init,
        headers: {
          ...init.headers,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    }
  }

  return response;
}
