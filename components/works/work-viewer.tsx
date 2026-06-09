"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfViewer } from "@/components/works/pdf-viewer";
import { WorkImageFullscreen } from "@/components/works/work-image-fullscreen";
import { WorkMediaThumb } from "@/components/works/work-media-thumb";
import type { WorkMediaItem } from "@/lib/work-files";
import { cn } from "@/lib/utils";

interface WorkViewerProps {
  items: WorkMediaItem[];
  className?: string;
}

export function WorkViewer({ items, className }: WorkViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-muted-foreground">
        Нет загруженных страниц
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () =>
    setCurrentIndex((i) => Math.min(items.length - 1, i + 1));

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
          {currentItem.type === "pdf" ? (
            <div className="flex h-full w-full max-w-3xl items-stretch">
              <PdfViewer
                url={currentItem.url}
                title={currentItem.name ?? `PDF ${currentIndex + 1}`}
                className="min-h-[400px] flex-1"
              />
            </div>
          ) : (
            <button
              type="button"
              className="flex max-h-full max-w-full cursor-zoom-in items-center justify-center"
              onClick={() => setFullscreenOpen(true)}
              aria-label="Открыть фото на весь экран"
            >
              <img
                src={currentItem.url}
                alt={currentItem.name ?? `Страница ${currentIndex + 1}`}
                className="max-h-full max-w-full rounded-[20px] object-contain"
              />
            </button>
          )}
          {currentIndex < items.length - 1 && (
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
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Файл ${index + 1}`}
            >
              <WorkMediaThumb
                item={item}
                index={index}
                active={index === currentIndex}
              />
            </button>
          ))}
        </div>
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
