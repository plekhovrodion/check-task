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

interface DeleteAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteAssignmentDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteAssignmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Удалить задание?</DialogTitle>
          <DialogDescription>
            Его нельзя будет восстановить, а все работы учеников пропадут
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Отменить
          </Button>
          <Button
            className="flex-1 bg-[#fcebed] text-[#fa3448] hover:bg-[#fcebed]/80"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
