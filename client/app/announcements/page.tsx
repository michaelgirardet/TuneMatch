'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementList from '@/components/AnnouncementList';

export default function AnnouncementsPage() {
  return (
    <main className="min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-quicksand font-bold mb-8 text-center">Annonces</h1>
          <AnnouncementList />
        </div>
      </div>
      <Footer />
    </main>
  );
}
