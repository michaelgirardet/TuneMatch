'use client';
import { useAuthStore } from '@/store/authStore';
import UserSwiper from '@/components/UserSwiper';
import MyMatches from '@/components/MyMatches';

export default function DiscoverPage() {
  const token = useAuthStore((state) => state.token); // token à mettre sur toutes les pages pour ne pas perdre l'auth
  console.log('Token dans DiscoverPage:', token);

  return (
    <main className="min-h-screen w-full bg-space p-6 font-quicksand flex flex-col items-center justify-center">
      <h1 className="text-white text-4xl font-bold mb-8 text-center absolute top-28">
        Découvrir des musiciens
      </h1>
      <UserSwiper />
    </main>
  );
}
