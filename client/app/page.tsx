'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/test`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Erreur:', error));
  }, []);

  return (
    <main className="min-h-screen w-full">
      <nav className="navbar">
        <Link href="/contact" className="button">
          Contact
        </Link>
      </nav>
      <div className="home-sct flex flex-col items-center justify-center w-3xs">
        <h1>Mon Template de Projet Fullstack</h1>
        <h2>Avec Next.js Express & MySQL</h2>
        <p>
          Message du serveur : <span className="api-message">{message}</span>
        </p>
      </div>
    </main>
  );
}
