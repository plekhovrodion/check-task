"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RecheckWorkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  variant?: "afterEdit" | "regenerate";
}

export function RecheckWorkDialog({
  open,
  onOpenChange,
  onConfirm,
  variant = "afterEdit",
}: RecheckWorkDialogProps) {
  const description =
    variant === "afterEdit"
      ? "Вы изменили текст ученика. Теперь можно сгенерировать новую проверку на основе правок"
      : "Будет сгенерирована новая проверка работы на основе текущего текста";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <DialogHeader className="gap-2 pb-0">
          <DialogTitle>Проверить заново работу?</DialogTitle>
          <p className="text-base leading-6 text-foreground">{description}</p>
        </DialogHeader>

        <div className="flex items-start gap-1.5 px-6">
          <Info className="mt-0.5 size-5 shrink-0 text-foreground" />
          <p className="text-base font-medium leading-6">
            Спишем 5 ИИ-генераций
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Отменить
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Проверить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
