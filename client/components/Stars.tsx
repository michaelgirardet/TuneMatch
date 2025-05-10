import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export function Stars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} color="#fbbf24" size={20} />
      ))}
      {halfStar && <FaStarHalfAlt color="#fbbf24" size={20} />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} color="#fbbf24" size={20} />
      ))}
      {/* <span className="ml-2 text-sm text-gray-300">{rating.toFixed(1)} / 5</span> */}
    </div>
  );
}
  