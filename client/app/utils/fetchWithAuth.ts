import { useAuthStore } from '@/store/authStore';

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const token = useAuthStore.getState().token;
  const headers = { ...init.headers } as Record<string, string>;

  // Ajouter Authorization si un token est disponible
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Ajouter Content-Type uniquement si ce n'est pas du FormData
  if (!(init.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let response = await fetch(input, {
    ...init,
    headers,
    credentials: 'include',
  });

  // Si la réponse est une erreur 401 (Unauthorized), tenter de rafraîchir le token
  if (response.status === 401) {
    try {
      const refreshRes = await fetch('http://localhost:5001/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include', // Assure que les cookies sont envoyés
      });

      if (refreshRes.ok) {
        const { accessToken } = await refreshRes.json();
        useAuthStore.getState().setToken(accessToken); // Mettre à jour le store avec le nouveau token

        // Refaites la requête avec le nouveau token
        const newHeaders: Record<string, string> = {
          ...(init.headers as Record<string, string>),
          Authorization: `Bearer ${accessToken}`,
        };

        if (!(init.body instanceof FormData) && !newHeaders['Content-Type']) {
          newHeaders['Content-Type'] = 'application/json';
        }

        response = await fetch(input, {
          ...init,
          headers: newHeaders,
          credentials: 'include', // Assure que les cookies sont envoyés
        });
      } else {
        // Si la réponse du refresh token échoue (par exemple, token expiré), on peut rediriger vers la page de login
        throw new Error('Unable to refresh token. Please log in again.');
      }
    } catch (error) {
      console.error(error);
      // Tu peux ici rediriger l'utilisateur vers la page de connexion ou afficher un message d'erreur
      useAuthStore.getState().logout();
      throw new Error('Session expired. Please log in again.');
    }
  }
  return response;
}
