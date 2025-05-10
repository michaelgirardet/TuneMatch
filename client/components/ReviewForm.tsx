import { useState } from 'react';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';

export function ReviewForm({
  reviewedId,
  onReviewSubmitted,
}: { reviewedId: number; onReviewSubmitted: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      toast.error('Veuillez sélectionner une note');
      return;
    }
    setLoading(true);
    try {
      const res = await fetchWithAuth('http://localhost:5001/api/reviews', {
        method: 'POST',
        body: JSON.stringify({ reviewedId, rating, comment }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi de l'avis");
      toast.success('Merci pour votre avis !');
      setRating(0);
      setComment('');
      onReviewSubmitted();
    } catch (err) {
      toast.error("Erreur lors de l'envoi de l'avis");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 p-4 bg-space rounded-lg">
      <h3 className="text-white font-semibold mb-2">Laisser un avis</h3>
      {/* Ici, tu peux mettre un composant étoiles interactif */}
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full p-2 mb-2 rounded bg-charcoal text-white"
        required
      >
        <option value={0}>Sélectionnez une note</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} étoile{n > 1 ? 's' : ''}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Votre commentaire (optionnel)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-2 rounded bg-charcoal text-white"
        rows={4}
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-3 bg-electric hover:bg-electrichover text-white px-4 py-2 rounded"
      >
        {loading ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
}
