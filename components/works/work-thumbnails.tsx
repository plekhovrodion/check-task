"use client";

import { useState } from "react";
import { WorkImageFullscreen } from "@/components/works/work-image-fullscreen";
import { cn } from "@/lib/utils";

interface WorkThumbnailsProps {
  images: string[];
  className?: string;
  compact?: boolean;
}

export function WorkThumbnails({
  images,
  className,
  compact = false,
}: WorkThumbnailsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  if (images.length === 0) return null;

  const displayImages = compact ? images.slice(0, 3) : images;
  const remainingCount = compact ? images.length - displayImages.length : 0;

  return (
    <>
      <div
        className={cn("flex flex-wrap gap-2", className)}
        onClick={compact ? (event) => event.stopPropagation() : undefined}
      >
        {displayImages.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              setCurrentIndex(index);
              setFullscreenOpen(true);
            }}
            className={cn(
              "relative shrink-0 overflow-hidden rounded-lg border border-[#e4e6f7]",
              compact ? "size-10" : "size-24"
            )}
            aria-label={`Страница ${index + 1}`}
          >
            <img
              src={image}
              alt={`Страница ${index + 1}`}
              className="size-full object-cover"
            />
            {!compact && (
              <span className="absolute bottom-[3px] left-[3px] flex min-w-5 items-center justify-center rounded-full bg-[rgba(22,26,51,0.6)] px-1 text-sm font-medium text-white backdrop-blur-[2px]">
                {index + 1}
              </span>
            )}
          </button>
        ))}
        {remainingCount > 0 && (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-medium text-muted-foreground">
            +{remainingCount}
          </span>
        )}
      </div>

      <WorkImageFullscreen
        open={fullscreenOpen}
        onOpenChange={setFullscreenOpen}
        images={images}
        initialIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />
    </>
  );
}
