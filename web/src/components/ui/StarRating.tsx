import React from 'react';
import { Star } from 'lucide-react';

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  interactive = false,
  onChange,
  size = 18,
}) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= rating;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform focus:outline-none`}
          >
            <Star
              size={size}
              className={isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
            />
          </button>
        );
      })}
    </div>
  );
};
