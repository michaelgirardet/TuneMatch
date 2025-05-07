import { fetchWithAuth } from './fetchWithAuth';
import { useAuthStore } from '../store/authStore';

export async function fetchAndUpdateUser() {
  const response = await fetchWithAuth('http://localhost:5001/api/users/profile', {
    method: 'GET',
  });
  const json = await response.json();
  if (response.ok && json.user) {
    useAuthStore.getState().updateUser(json.user);
  }
}
