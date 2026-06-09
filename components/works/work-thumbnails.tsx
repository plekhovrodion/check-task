"use client";

import { useState } from "react";
import { WorkImageFullscreen } from "@/components/works/work-image-fullscreen";
import { WorkMediaThumb } from "@/components/works/work-media-thumb";
import type { WorkMediaItem } from "@/lib/work-files";
import { cn } from "@/lib/utils";

interface WorkThumbnailsProps {
  items: WorkMediaItem[];
  className?: string;
  compact?: boolean;
}

export function WorkThumbnails({
  items,
  className,
  compact = false,
}: WorkThumbnailsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  if (items.length === 0) return null;

  const displayItems = compact ? items.slice(0, 3) : items;
  const remainingCount = compact ? items.length - displayItems.length : 0;

  return (
    <>
      <div
        className={cn("flex flex-wrap gap-2", className)}
        onClick={compact ? (event) => event.stopPropagation() : undefined}
      >
        {displayItems.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              setCurrentIndex(index);
              setFullscreenOpen(true);
            }}
            aria-label={`Файл ${index + 1}`}
          >
            <WorkMediaThumb
              item={item}
              index={index}
              size={compact ? "sm" : "md"}
            />
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
        items={items}
        initialIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />
    </>
  );
}
