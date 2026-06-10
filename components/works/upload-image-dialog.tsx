"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import {
  ReactCropKit,
  centerCrop,
  type Crop as CropArea,
  type PixelCrop,
} from "react-crop-kit";
import "react-crop-kit/style.css";
import { NavIcon } from "@/components/layout/nav-icon";
import { Button } from "@/components/ui/button";

interface UploadImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  fileName: string;
  onSave: (url: string) => void;
}

function initCrop(image: HTMLImageElement): CropArea {
  return centerCrop(
    { unit: "%", width: 80, height: 80 },
    image.width,
    image.height,
  );
}

function cropImage(image: HTMLImageElement, pixelCrop: PixelCrop): string {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = pixelCrop.width * scaleX;
  canvas.height = pixelCrop.height * scaleY;

  const ctx = canvas.getContext("2d");
  if (!ctx) return image.src;

  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas.toDataURL("image/jpeg", 0.92);
}

interface UploadImageCropContentProps {
  imageUrl: string;
  fileName: string;
  onOpenChange: (open: boolean) => void;
  onSave: (url: string) => void;
}

function UploadImageCropContent({
  imageUrl,
  fileName,
  onOpenChange,
  onSave,
}: UploadImageCropContentProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const pixelCropRef = useRef<PixelCrop | null>(null);
  const [crop, setCrop] = useState<CropArea>();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const nextCrop = initCrop(e.currentTarget);
    setCrop(nextCrop);
  };

  const handleSave = () => {
    const image = imageRef.current;
    const pixelCrop = pixelCropRef.current;

    if (!image || !pixelCrop || pixelCrop.width < 2 || pixelCrop.height < 2) {
      handleClose();
      return;
    }

    onSave(cropImage(image, pixelCrop));
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[rgba(22,26,51,0.6)] px-4 py-8 backdrop-blur-[16px]"
      role="dialog"
      aria-modal="true"
      aria-label={`Кадрирование: ${fileName}`}
    >
      <button
        type="button"
        className="absolute top-4 right-4 rounded-[10px] bg-[rgba(16,24,40,0.5)] p-2.5 backdrop-blur-[16px] transition-colors hover:bg-[rgba(16,24,40,0.65)]"
        onClick={handleClose}
        aria-label="Закрыть"
      >
        <NavIcon name="cross" className="brightness-0 invert" />
      </button>

      <div className="flex w-full max-w-[600px] flex-col items-center gap-6">
        <div className="upload-image-crop w-full">
          <ReactCropKit
            crop={crop}
            keepSelection
            ruleOfThirds
            renderSelectionAddon={() => (
              <>
                <span className="crop-frame-corner crop-frame-corner--nw" aria-hidden />
                <span className="crop-frame-corner crop-frame-corner--ne" aria-hidden />
                <span className="crop-frame-corner crop-frame-corner--sw" aria-hidden />
                <span className="crop-frame-corner crop-frame-corner--se" aria-hidden />
              </>
            )}
            onChange={(pixelCrop, percentCrop) => {
              setCrop(percentCrop);
              pixelCropRef.current = pixelCrop;
            }}
            ariaLabels={{
              cropArea: "Область обрезки",
              nwDragHandle: "Изменить размер северо-запад",
              nDragHandle: "Изменить размер сверху",
              neDragHandle: "Изменить размер северо-восток",
              eDragHandle: "Изменить размер справа",
              seDragHandle: "Изменить размер юго-восток",
              sDragHandle: "Изменить размер снизу",
              swDragHandle: "Изменить размер юго-запад",
              wDragHandle: "Изменить размер слева",
            }}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt={fileName}
              className="max-h-[calc(100vh-280px)] w-full rounded-2xl object-contain"
              onLoad={handleImageLoad}
              draggable={false}
            />
          </ReactCropKit>
        </div>

        <p className="text-center text-xl font-medium tracking-[-0.2px] text-white">
          Двигайте границы, чтобы кадрировать
        </p>

        <Button
          type="button"
          className="h-12 w-[240px] shrink-0"
          onClick={handleSave}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
}

export function UploadImageDialog({
  open,
  onOpenChange,
  imageUrl,
  fileName,
  onSave,
}: UploadImageDialogProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted || !open) return null;

  return createPortal(
    <UploadImageCropContent
      key={imageUrl}
      imageUrl={imageUrl}
      fileName={fileName}
      onOpenChange={onOpenChange}
      onSave={onSave}
    />,
    document.body,
  );
}
