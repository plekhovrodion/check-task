"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkImageFullscreen } from "@/components/works/work-image-fullscreen";
import { cn } from "@/lib/utils";

interface WorkViewerProps {
  images: string[];
  className?: string;
}

export function WorkViewer({ images, className }: WorkViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-muted-foreground">
        Нет загруженных страниц
      </div>
    );
  }

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () =>
    setCurrentIndex((i) => Math.min(images.length - 1, i + 1));

  return (
    <>
      <div
        className={cn(
          "flex h-full flex-col items-center justify-center gap-6 p-6",
          className
        )}
      >
        <div className="relative flex w-full flex-1 items-center justify-center">
          {currentIndex > 0 && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 left-0 z-10 size-10 -translate-y-1/2 rounded-lg bg-white shadow-[0_2px_8px_rgba(122,130,161,0.2)]"
              onClick={goPrev}
            >
              <ChevronLeft />
            </Button>
          )}
          <button
            type="button"
            className="flex max-h-full max-w-full cursor-zoom-in items-center justify-center"
            onClick={() => setFullscreenOpen(true)}
            aria-label="Открыть фото на весь экран"
          >
            <img
              src={images[currentIndex]}
              alt={`Страница ${currentIndex + 1}`}
              className="max-h-full max-w-full rounded-[20px] object-contain"
            />
          </button>
          {currentIndex < images.length - 1 && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 right-0 z-10 size-10 -translate-y-1/2 rounded-lg bg-white shadow-[0_2px_8px_rgba(122,130,161,0.2)]"
              onClick={goNext}
            >
              <ChevronRight />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-center gap-2">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "size-16 overflow-hidden rounded-lg transition-colors",
                index === currentIndex
                  ? "border-2 border-primary"
                  : "border border-[#e4e6f7]"
              )}
            >
              <img
                src={img}
                alt={`Миниатюра ${index + 1}`}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
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
