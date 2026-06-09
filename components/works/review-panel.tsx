"use client";

import { NavIcon } from "@/components/layout/nav-icon";
import { Progress } from "@/components/ui/progress";
import { getCriteria } from "@/lib/criteria";
import type { Assignment, ReviewResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ReviewPanelProps {
  assignment: Assignment;
  review: ReviewResult;
  className?: string;
}

function getScoreVariant(score: number, maxScore: number) {
  if (maxScore === 0) return "success";
  if (score === 0) return "destructive";
  if (score >= maxScore) return "success";
  return "warning";
}

function ScoreBadge({
  score,
  maxScore,
}: {
  score: number;
  maxScore: number;
}) {
  const variant = getScoreVariant(score, maxScore);

  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-base font-medium",
        variant === "success" && "bg-success/15 text-success",
        variant === "warning" && "bg-[rgba(250,133,30,0.15)] text-[#fa851e]",
        variant === "destructive" && "bg-[rgba(250,52,72,0.15)] text-[#fa3448]"
      )}
    >
      {maxScore === 0 ? score : `${score}/${maxScore}`}
    </span>
  );
}

export function ReviewPanel({ assignment, review, className }: ReviewPanelProps) {
  const criteria = getCriteria(assignment.subject, assignment.workType);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium tracking-tight">Обратная связь</h2>
          <NavIcon name="pen" />
        </div>
        <p className="text-base leading-6">{review.feedback}</p>
      </div>

      <div className="h-px bg-[#e4e6f7]" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h2 className="text-xl font-medium tracking-tight">
              Критерии оценивания
            </h2>
            <NavIcon name="pen" />
          </div>
          <button
            type="button"
            className="shrink-0 text-base font-medium text-muted-foreground"
          >
            Показать критерии
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[32px] font-medium leading-9 tracking-[-0.6px]">
            {review.totalScore}/{review.maxScore}
          </p>
          <Progress
            value={(review.totalScore / review.maxScore) * 100}
            className="gap-0 [&_[data-slot=progress-indicator]]:bg-success [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-secondary"
          />
        </div>

        <div className="flex flex-col gap-2">
          {review.criteria.map((result) => {
            const criterion = criteria.find((c) => c.id === result.criterionId);

            return (
              <div
                key={result.criterionId}
                className="flex items-start gap-2 rounded-2xl border border-[#e4e6f7] p-4"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-lg font-medium tracking-tight">
                    {criterion
                      ? `${criterion.code}. ${criterion.title}`
                      : result.criterionId}
                  </p>
                  <p className="text-base leading-6">{result.description}</p>
                  {result.errors && result.errors.length > 0 && (
                    <ul className="list-disc pl-6 text-base leading-6">
                      {result.errors.map((err) => (
                        <li key={err}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <ScoreBadge score={result.score} maxScore={result.maxScore} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
