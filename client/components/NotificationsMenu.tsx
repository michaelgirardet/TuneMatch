import { fetchWithAuth } from '@/app/utils/fetchWithAuth';
import { useAuthStore } from '@/store/authStore';
import { BellIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Notification {
  id: number;
  content: string;
  type: 'application_status' | 'message' | 'match';
  is_read: boolean;
  created_at: string;
  related_id: number;
}

export default function NotificationsMenu() {
  const { token } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetchWithAuth(
        'http://localhost:5001/api/applications/notifications',
        {}
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des notifications');
      }

      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((notif: Notification) => !notif.is_read).length);
    } catch (error) {
      console.error('Erreur:', error);
      setError("🔔 Les notifications ne s'affichent pas. Un petit bug ?");
    }
  }, []);

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:5001/api/applications/notifications/${notificationId}/read`,
        {
          method: 'PUT',
        }
      );

      if (!response.ok) {
        throw new Error('🔄 Mise à jour impossible. Essaie encore une fois.');
      }

      setNotifications(
        notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error('Erreur:', error);
      setError('🔄 Mise à jour impossible. Essaie encore une fois.');
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token, fetchNotifications]);

  return (
    <>
      {error &&
        toast.error("Quelque chose s'est mal passé, veuillez réessayer plus tard !", {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        })}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-400 hover:text-white focus:outline-none flex items-center gap-2"
        >
          <>
            <BellIcon className="h-6 w-6 stroke-gray-400 cursor-pointer" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-charcoal rounded-full">
                {unreadCount}
              </span>
            )}
          </>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-6 w-80 bg-space border border-gray-700 rounded-lg shadow-lg z-50">
            <div className="p-4">
              <h3 className="text-lg font-quicksand text-white mb-4">Notifications</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-gray-400 text-center">Aucune notification</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${
                        notification.is_read
                          ? 'bg-oxford shadow-lg'
                          : 'bg-oxford border-l-4 border-[#51537B shadow-lg'
                      }`}
                      onClick={() => !notification.is_read && markAsRead(notification.id)}
                      onKeyDown={() => !notification.is_read && markAsRead(notification.id)}
                    >
                      <p className="text-sm text-white mb-2">{notification.content}</p>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
