import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  count?: number;
  showText?: boolean;
  size?: number;
  className?: string;
}

export default function RatingStars({
  rating,
  count,
  showText = true,
  size = 16,
  className = "",
}: RatingStarsProps) {
  const roundedRating = Math.round(rating * 2) / 2; // round to nearest 0.5
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= roundedRating;
          const isHalf = !isFilled && starValue - 0.5 <= roundedRating;

          return (
            <div key={index} className="relative">
              <Star
                size={size}
                className={`${
                  isFilled
                    ? "fill-star-gold text-star-gold"
                    : isHalf
                    ? "text-star-gold"
                    : "text-surface-highest fill-surface-highest"
                }`}
              />
              {isHalf && (
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: "50%" }}
                >
                  <Star
                    size={size}
                    className="fill-star-gold text-star-gold"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showText && (
        <span className="font-semibold text-on-surface text-label-sm ml-1">
          {rating.toFixed(1)}
          {count !== undefined && (
            <span className="text-on-surface-variant font-normal">
              {" "}
              ({count})
            </span>
          )}
        </span>
      )}
    </div>
  );
}
