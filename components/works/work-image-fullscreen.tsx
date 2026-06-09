"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { NavIcon } from "@/components/layout/nav-icon";
import { PdfViewer } from "@/components/works/pdf-viewer";
import { WorkMediaThumb } from "@/components/works/work-media-thumb";
import type { WorkMediaItem } from "@/lib/work-files";
import { cn } from "@/lib/utils";

interface WorkImageFullscreenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: WorkMediaItem[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
}

interface WorkImageFullscreenContentProps {
  items: WorkMediaItem[];
  initialIndex: number;
  onOpenChange: (open: boolean) => void;
  onIndexChange?: (index: number) => void;
}

function WorkImageFullscreenContent({
  items,
  initialIndex,
  onOpenChange,
  onIndexChange,
}: WorkImageFullscreenContentProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        setCurrentIndex((index) => Math.max(0, index - 1));
      }
      if (event.key === "ArrowRight") {
        setCurrentIndex((index) => Math.min(items.length - 1, index + 1));
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [items.length, handleClose]);

  const currentItem = items[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[rgba(22,26,51,0.6)] py-8 backdrop-blur-[16px]"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр файлов на весь экран"
    >
      <button
        type="button"
        className="absolute top-4 right-4 rounded-[10px] bg-[rgba(16,24,40,0.5)] p-2.5 backdrop-blur-[16px] transition-colors hover:bg-[rgba(16,24,40,0.65)]"
        onClick={(event) => {
          event.stopPropagation();
          handleClose();
        }}
        aria-label="Закрыть"
      >
        <NavIcon name="cross" className="brightness-0 invert" />
      </button>

      <div
        className={cn(
          "flex items-center justify-center px-4",
          currentItem.type === "pdf"
            ? "h-[calc(100vh-160px)] w-[min(90vw,900px)]"
            : "max-h-[calc(100vh-160px)] max-w-[min(90vw,744px)]"
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {currentItem.type === "pdf" ? (
          <PdfViewer
            url={currentItem.url}
            title={currentItem.name ?? `PDF ${currentIndex + 1}`}
            className="h-full w-full rounded-2xl"
          />
        ) : (
          <img
            src={currentItem.url}
            alt={currentItem.name ?? `Страница ${currentIndex + 1}`}
            className="max-h-[calc(100vh-160px)] max-w-full rounded-2xl object-contain"
          />
        )}
      </div>

      {items.length > 1 && (
        <div
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2"
          onClick={(event) => event.stopPropagation()}
        >
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "relative transition-opacity",
                index !== currentIndex && "opacity-80"
              )}
              aria-label={`Файл ${index + 1}`}
              aria-current={index === currentIndex}
            >
              <WorkMediaThumb
                item={item}
                index={index}
                size="sm"
                active={index === currentIndex}
                className="size-12 rounded-[10px]"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function WorkImageFullscreen({
  open,
  onOpenChange,
  items,
  initialIndex = 0,
  onIndexChange,
}: WorkImageFullscreenProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted || !open || items.length === 0) return null;

  return createPortal(
    <WorkImageFullscreenContent
      key={initialIndex}
      items={items}
      initialIndex={initialIndex}
      onOpenChange={onOpenChange}
      onIndexChange={onIndexChange}
    />,
    document.body
  );
}
