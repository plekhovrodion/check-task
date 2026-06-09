"use client";

import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROCESSING_STEPS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProcessingStepperProps {
  progress: number;
  currentStep: number;
  onCancel?: () => void;
}

export function ProcessingStepper({
  progress,
  currentStep,
  onCancel,
}: ProcessingStepperProps) {
  const remainingMinutes = Math.max(1, Math.round(((100 - progress) / 100) * 3));
  const returnTime = new Date(
    Date.now() + remainingMinutes * 60000
  ).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex h-full w-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[20px] font-medium tracking-[-0.2px]">
          Проверка работы {progress}%
        </h2>
        <p className="text-base text-muted-foreground">
          Ещё {remainingMinutes} мин. Приходите в {returnTime}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {PROCESSING_STEPS.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div key={step} className="flex items-center gap-2">
              {isDone && (
                <CheckCircle2 className="size-5 shrink-0 text-success" />
              )}
              {isActive && (
                <Loader2 className="size-5 shrink-0 animate-spin text-primary" />
              )}
              {isPending && (
                <Clock className="size-5 shrink-0 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-base",
                  (isDone || isActive) && "text-foreground",
                  isPending && "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {onCancel && (
        <Button
          variant="secondary"
          className="w-fit bg-primary/10 text-foreground hover:bg-primary/15"
          onClick={onCancel}
        >
          Отменить проверку
        </Button>
      )}
    </div>
  );
}
