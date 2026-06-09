"use client";

import { useRef, useState } from "react";
import { Crop, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface UploadImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  fileName: string;
  onSave: (url: string) => void;
}

type CropRect = { x: number; y: number; width: number; height: number };

export function UploadImageDialog({
  open,
  onOpenChange,
  imageUrl,
  fileName,
  onSave,
}: UploadImageDialogProps) {
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState(1);
  const [cropMode, setCropMode] = useState(false);
  const [cropRect, setCropRect] = useState<CropRect | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setZoom(1);
      setCropMode(false);
      setCropRect(null);
    }
    onOpenChange(nextOpen);
  };

  const getRelativePoint = (clientX: number, clientY: number) => {
    const wrap = imageWrapRef.current;
    if (!wrap) return null;
    const rect = wrap.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!cropMode) return;
    const point = getRelativePoint(e.clientX, e.clientY);
    if (!point) return;
    dragStart.current = point;
    setCropRect({ x: point.x, y: point.y, width: 0, height: 0 });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!cropMode || !dragStart.current) return;
    const point = getRelativePoint(e.clientX, e.clientY);
    if (!point) return;

    const x = Math.min(dragStart.current.x, point.x);
    const y = Math.min(dragStart.current.y, point.y);
    const width = Math.abs(point.x - dragStart.current.x);
    const height = Math.abs(point.y - dragStart.current.y);

    setCropRect({ x, y, width, height });
  };

  const handlePointerUp = () => {
    dragStart.current = null;
  };

  const applyCrop = () => {
    const image = imageRef.current;
    if (!image || !cropRect || cropRect.width < 2 || cropRect.height < 2) {
      handleOpenChange(false);
      return;
    }

    const canvas = document.createElement("canvas");
    const sx = (cropRect.x / 100) * image.naturalWidth;
    const sy = (cropRect.y / 100) * image.naturalHeight;
    const sw = (cropRect.width / 100) * image.naturalWidth;
    const sh = (cropRect.height / 100) * image.naturalHeight;

    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
    onSave(canvas.toDataURL("image/jpeg", 0.92));
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl gap-0 p-0" showCloseButton>
        <DialogHeader className="border-b border-[#e4e6f7] p-6 pb-4">
          <DialogTitle className="text-xl">{fileName}</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[60vh] min-h-[320px] items-center justify-center overflow-auto bg-[#f0f2ff] p-6">
          <div
            ref={imageWrapRef}
            className={cn("relative inline-block", cropMode && "cursor-crosshair")}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt={fileName}
              className="max-h-[50vh] max-w-full object-contain transition-transform duration-150"
              style={{ transform: cropMode ? undefined : `scale(${zoom})` }}
              draggable={false}
            />
            {cropMode && cropRect && cropRect.width > 0 && cropRect.height > 0 && (
              <div
                className="pointer-events-none absolute border-2 border-primary bg-primary/10"
                style={{
                  left: `${cropRect.x}%`,
                  top: `${cropRect.y}%`,
                  width: `${cropRect.width}%`,
                  height: `${cropRect.height}%`,
                }}
              />
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between border-t border-[#e4e6f7] p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              disabled={cropMode}
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              aria-label="Уменьшить"
            >
              <Minus />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              disabled={cropMode}
              onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
              aria-label="Увеличить"
            >
              <Plus />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              disabled={cropMode}
              onClick={() => setZoom(1)}
              aria-label="Сбросить масштаб"
            >
              <RotateCcw />
            </Button>
            <Button
              variant={cropMode ? "default" : "secondary"}
              onClick={() => {
                setCropMode((v) => !v);
                setCropRect(null);
              }}
            >
              <Crop />
              {cropMode ? "Режим обрезки" : "Обрезать"}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => handleOpenChange(false)}>
              Отменить
            </Button>
            {cropMode ? (
              <Button onClick={applyCrop}>Применить обрезку</Button>
            ) : (
              <Button onClick={() => handleOpenChange(false)}>Готово</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
