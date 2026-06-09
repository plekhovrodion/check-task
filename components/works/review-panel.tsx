"use client";

import { useState } from "react";
import { NavIcon } from "@/components/layout/nav-icon";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { getCriteria } from "@/lib/criteria";
import { calcScoredTotal } from "@/lib/review-utils";
import type { Assignment, CriterionResult, ReviewResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ReviewPanelProps {
  assignment: Assignment;
  review: ReviewResult;
  onReviewChange?: (review: ReviewResult) => void;
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

function EditButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md p-0.5 transition-colors hover:bg-secondary",
        active && "bg-secondary"
      )}
      aria-label={label}
      aria-pressed={active}
    >
      <NavIcon name="pen" />
    </button>
  );
}

export function ReviewPanel({
  assignment,
  review,
  onReviewChange,
  className,
}: ReviewPanelProps) {
  const criteria = getCriteria(assignment.subject, assignment.workType);
  const [editingFeedback, setEditingFeedback] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(false);

  const updateReview = (patch: Partial<ReviewResult>) => {
    if (!onReviewChange) return;

    const nextReview = { ...review, ...patch };
    if (patch.criteria) {
      nextReview.totalScore = calcScoredTotal(patch.criteria);
    }

    onReviewChange(nextReview);
  };

  const updateCriterion = (
    criterionId: string,
    patch: Partial<CriterionResult>
  ) => {
    const nextCriteria = review.criteria.map((result) => {
      if (result.criterionId !== criterionId) return result;

      const nextResult = { ...result, ...patch };
      if (patch.score !== undefined && result.maxScore > 0) {
        nextResult.score = Math.min(
          Math.max(0, patch.score),
          result.maxScore
        );
      }

      return nextResult;
    });

    updateReview({ criteria: nextCriteria });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium tracking-tight">Обратная связь</h2>
          {onReviewChange && (
            <EditButton
              active={editingFeedback}
              label="Редактировать обратную связь"
              onClick={() => setEditingFeedback((value) => !value)}
            />
          )}
        </div>
        {editingFeedback ? (
          <textarea
            value={review.feedback}
            onChange={(event) =>
              updateReview({ feedback: event.target.value })
            }
            rows={5}
            className="w-full resize-y rounded-2xl border border-[#e4e6f7] bg-transparent px-4 py-3 text-base leading-6 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        ) : (
          <p className="text-base leading-6">{review.feedback}</p>
        )}
      </div>

      <div className="h-px bg-[#e4e6f7]" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h2 className="text-xl font-medium tracking-tight">
              Критерии оценивания
            </h2>
            {onReviewChange && (
              <EditButton
                active={editingCriteria}
                label="Редактировать критерии"
                onClick={() => setEditingCriteria((value) => !value)}
              />
            )}
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
                  {editingCriteria ? (
                    <textarea
                      value={result.description}
                      onChange={(event) =>
                        updateCriterion(result.criterionId, {
                          description: event.target.value,
                        })
                      }
                      rows={3}
                      className="w-full resize-y rounded-xl border border-[#e4e6f7] bg-transparent px-3 py-2 text-base leading-6 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  ) : (
                    <p className="text-base leading-6">{result.description}</p>
                  )}
                  {result.errors && result.errors.length > 0 && (
                    <ul className="list-disc pl-6 text-base leading-6">
                      {result.errors.map((err) => (
                        <li key={err}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {editingCriteria && result.maxScore > 0 ? (
                  <div className="flex shrink-0 items-center gap-1">
                    <Input
                      type="number"
                      min={0}
                      max={result.maxScore}
                      value={result.score}
                      onChange={(event) =>
                        updateCriterion(result.criterionId, {
                          score: Number(event.target.value),
                        })
                      }
                      className="h-9 w-14 px-2 text-center"
                    />
                    <span className="text-base text-muted-foreground">
                      /{result.maxScore}
                    </span>
                  </div>
                ) : (
                  <ScoreBadge score={result.score} maxScore={result.maxScore} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
