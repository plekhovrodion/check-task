"use client";

import { useState } from "react";
import { NavIcon } from "@/components/layout/nav-icon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "upload-reorder-hint-dismissed";

interface UploadReorderHintProps {
  open: boolean;
  onClose: () => void;
}

export function isUploadReorderHintDismissed() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function UploadReorderHint({ open, onClose }: UploadReorderHintProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    onClose();
  };

  return (
    <div className="absolute top-full left-0 z-20 mt-2 w-[360px] rounded-2xl bg-[#30365c] p-4 text-white shadow-lg">
      <div
        className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-[#30365c]"
        aria-hidden
      />
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-col gap-1 pr-6">
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
            onClick={handleClose}
            aria-label="Закрыть подсказку"
          >
            <NavIcon name="cross" className="size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1.5">
          <Checkbox
            id="upload-hint-dismiss"
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(checked === true)}
            className="border-white/30 bg-white/10 data-checked:border-white data-checked:bg-white data-checked:text-[#30365c]"
          />
          <Label
            htmlFor="upload-hint-dismiss"
            className="cursor-pointer text-sm font-normal text-white"
          >
            Больше не показывать
          </Label>
        </div>
      </div>
    </div>
  );
}
