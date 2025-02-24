import Link from 'next/link';

export default function Contact() {
  return (
    <main className="min-h-screen w-full">
      <nav className="navbar">
        <Link href="/" className="button">
          Retour à l'accueil
        </Link>
      </nav>
      <div className="home-sct flex flex-col items-center justify-center">
        <h1>Contact</h1>
        <p>Ceci est la page de contact</p>
      </div>
    </main>
  );
}
