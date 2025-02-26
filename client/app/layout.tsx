import './globals.css';
import { Montserrat, Quicksand, Sulphur_Point } from 'next/font/google';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

const sulphurPoint = Sulphur_Point({
  subsets: ['latin'],
  variable: '--font-sulphur',
  weight: ['300', '400', '700'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${montserrat.variable} ${quicksand.variable} ${sulphurPoint.variable}`}
    >
      <body>
        <AuthProvider>{children}</AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}

export const metadata = {
  title: 'TuneMatch - Connecte tes talents musicaux',
  description: 'Plateforme de mise en relation entre artistes et producteurs musicaux',
  keywords: 'musique, collaboration, artistes, producteurs',
};
