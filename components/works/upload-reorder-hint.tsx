"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadReorderHintProps {
  open: boolean;
  onClose: () => void;
}

export function UploadReorderHint({ open, onClose }: UploadReorderHintProps) {
  if (!open) return null;

  return (
    <div className="absolute top-full left-0 z-20 mt-2 w-[360px] rounded-2xl bg-[#30365c] p-4 text-white shadow-lg">
      <div
        className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-[#30365c]"
        aria-hidden
      />
      <div className="relative flex flex-col gap-1 pr-6">
        <p className="text-base font-medium leading-6">
          Перетащите страницы в нужную последовательность
        </p>
        <p className="text-sm leading-5 text-white/90">
          Если страницы загружены не по порядку, ИИ может перепутать начало и
          конец работы
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0 size-4 text-white hover:bg-white/10 hover:text-white"
          onClick={onClose}
          aria-label="Закрыть подсказку"
        >
          <X className="size-4 text-white" />
        </Button>
      </div>
    </div>
  );
}
