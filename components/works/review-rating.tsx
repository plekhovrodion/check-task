"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewRatingProps {
  className?: string;
}

export function ReviewRating({ className }: ReviewRatingProps) {
  const [rating, setRating] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <p className="text-center text-lg font-medium tracking-tight">
        Как вам ИИ-проверка заданий?
      </p>
      <div className="flex items-center gap-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="transition-opacity"
            aria-label={`Оценить ${star} из 5`}
          >
            <Star
              className={cn(
                "size-6 fill-current",
                star <= rating ? "text-warning" : "text-foreground/30"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
