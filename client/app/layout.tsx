import Navbar from '@/components/Navbar';
import './globals.css';
import Footer from '@/components/Footer';
import { ToastContainer } from 'react-toastify';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col bg-oxford">
          {children}
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </main>
        <Footer />
      </body>
    </html>
  );
}

export const metadata = {
  title: 'TuneMatch - Connecte tes talents musicaux',
  description: 'Plateforme de mise en relation entre artistes et producteurs musicaux',
  keywords: 'musique, collaboration, artistes, producteurs',
};
