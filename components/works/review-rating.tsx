"use client";

import { useState } from "react";
import { StarSolidIcon } from "@/components/ui/star-solid-icon";
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
            className="transition-opacity hover:opacity-80"
            aria-label={`Оценить ${star} из 5`}
          >
            <StarSolidIcon
              filled={star <= rating}
              className={star <= rating ? "text-warning" : "text-[#9399BD]"}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
