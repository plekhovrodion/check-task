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
import { WORK_TYPE_LABELS, type Subject, type WorkType } from "@/lib/types";
import { SUBJECT_LABELS } from "@/lib/types";

interface ChangeCriteriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkedCount: number;
  fromSubject: Subject;
  fromWorkType: WorkType;
  toSubject: Subject;
  toWorkType: WorkType;
  onRecheck: () => void;
  onClearAndUpload: () => void;
}

export function ChangeCriteriaDialog({
  open,
  onOpenChange,
  checkedCount,
  fromSubject,
  fromWorkType,
  toSubject,
  toWorkType,
  onRecheck,
  onClearAndUpload,
}: ChangeCriteriaDialogProps) {
  const fromLabel = `${SUBJECT_LABELS[fromSubject]} · ${WORK_TYPE_LABELS[fromWorkType]}`;
  const toLabel = `${SUBJECT_LABELS[toSubject]} · ${WORK_TYPE_LABELS[toWorkType]}`;
  const generationCost = checkedCount * 5;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="max-w-lg">
        <DialogHeader className="gap-2 pb-0">
          <DialogTitle>Изменить критерии оценивания?</DialogTitle>
          <p className="text-base leading-6 text-foreground">
            Сейчас проверено {checkedCount}{" "}
            {checkedCount === 1 ? "работа" : checkedCount < 5 ? "работы" : "работ"}{" "}
            по критериям «{fromLabel}». После сохранения будут применяться
            критерии «{toLabel}».
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-3 px-6">
          <button
            type="button"
            className="rounded-xl border border-[#e4e6f7] p-4 text-left transition-colors hover:bg-secondary"
            onClick={() => {
              onRecheck();
              onOpenChange(false);
            }}
          >
            <p className="text-base font-medium">Перепроверить текущие работы</p>
            <p className="mt-1 text-base text-muted-foreground">
              Текст и файлы сохранятся, оценки пересчитаются по новым критериям
            </p>
          </button>

          <button
            type="button"
            className="rounded-xl border border-[#e4e6f7] p-4 text-left transition-colors hover:bg-secondary"
            onClick={() => {
              onClearAndUpload();
              onOpenChange(false);
            }}
          >
            <p className="text-base font-medium">Удалить работы и загрузить заново</p>
            <p className="mt-1 text-base text-muted-foreground">
              Текущие проверки будут удалены. Вы сможете загрузить работы и
              проверить их по новым критериям
            </p>
          </button>
        </div>

        <div className="flex items-start gap-1.5 px-6">
          <Info className="mt-0.5 size-5 shrink-0 text-foreground" />
          <p className="text-base font-medium leading-6">
            Перепроверка спишет {generationCost} ИИ-генераций ({checkedCount} × 5)
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
