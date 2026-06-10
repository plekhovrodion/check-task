"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CancelProcessingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function CancelProcessingDialog({
  open,
  onOpenChange,
  onConfirm,
}: CancelProcessingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <DialogHeader className="gap-2 pb-0">
          <DialogTitle className="text-2xl leading-7 tracking-[-0.2px]">
            Отменить проверку?
          </DialogTitle>
          <DialogDescription className="text-base leading-6 text-[#656c94]">
            ИИ-генерации не вернутся
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Не отменять
          </Button>
          <Button
            className="flex-1 bg-[#fcebed] text-[#fa3448] hover:bg-[#fcebed]/80"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Отменить проверку
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
