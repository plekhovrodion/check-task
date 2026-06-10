"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCriteria } from "@/lib/criteria";
import {
  MAX_CRITERION_COMMENT_LENGTH,
  MAX_REVIEW_FEEDBACK_LENGTH,
  calcScoredTotal,
  clampReviewText,
} from "@/lib/review-utils";
import type { Assignment, CriterionResult, ReviewResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ReviewPanelProps {
  assignment: Assignment;
  review: ReviewResult;
  onReviewChange?: (review: ReviewResult) => void;
  hoveredCriterionId?: string | null;
  onCriterionHover?: (criterionId: string | null) => void;
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

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 text-base font-medium text-[#656c94] transition-colors hover:text-foreground"
    >
      Редактировать
    </button>
  );
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="h-10 rounded-lg px-3.5 py-2.5 text-sm font-medium"
    >
      Сохранить
    </Button>
  );
}

function ScoreStepper({
  score,
  maxScore,
  onChange,
}: {
  score: number;
  maxScore: number;
  onChange: (score: number) => void;
}) {
  const decrement = () => onChange(Math.max(0, score - 1));
  const increment = () => {
    const max = maxScore > 0 ? maxScore : Number.MAX_SAFE_INTEGER;
    onChange(Math.min(max, score + 1));
  };

  return (
    <div className="flex shrink-0 items-center gap-2 rounded-lg bg-secondary">
      <button
        type="button"
        onClick={decrement}
        disabled={score <= 0}
        className="rounded-md p-2 transition-colors hover:bg-black/5 disabled:opacity-40"
        aria-label="Уменьшить"
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-[2ch] text-center text-base font-medium">
        {maxScore === 0 ? score : `${score}/${maxScore}`}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={maxScore > 0 && score >= maxScore}
        className="rounded-md p-2 transition-colors hover:bg-black/5 disabled:opacity-40"
        aria-label="Увеличить"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

function CharacterCounter({
  value,
  maxLength,
}: {
  value: string;
  maxLength: number;
}) {
  return (
    <p
      className={cn(
        "text-sm text-muted-foreground",
        value.length >= maxLength && "text-destructive"
      )}
    >
      {value.length}/{maxLength}
    </p>
  );
}

export function ReviewPanel({
  assignment,
  review,
  onReviewChange,
  hoveredCriterionId = null,
  onCriterionHover,
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
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-medium leading-[26px] tracking-[-0.2px]">
            Обратная связь
          </h2>
          {onReviewChange && !editingFeedback && (
            <EditButton onClick={() => setEditingFeedback(true)} />
          )}
          {onReviewChange && editingFeedback && (
            <SaveButton onClick={() => setEditingFeedback(false)} />
          )}
        </div>
        {editingFeedback ? (
          <div className="flex flex-col gap-1">
            <div className="rounded-[10px] bg-secondary p-3">
              <textarea
                value={review.feedback}
                onChange={(event) =>
                  updateReview({
                    feedback: clampReviewText(
                      event.target.value,
                      MAX_REVIEW_FEEDBACK_LENGTH
                    ),
                  })
                }
                maxLength={MAX_REVIEW_FEEDBACK_LENGTH}
                rows={5}
                className="w-full resize-y border-none bg-transparent text-base leading-6 outline-none"
              />
            </div>
            <CharacterCounter
              value={review.feedback}
              maxLength={MAX_REVIEW_FEEDBACK_LENGTH}
            />
          </div>
        ) : (
          <p className="text-base leading-6">{review.feedback}</p>
        )}
      </div>

      <div className="h-px bg-[#e4e6f7]" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-medium leading-[26px] tracking-[-0.2px]">
            Критерии оценивания
          </h2>
          {onReviewChange && !editingCriteria && (
            <EditButton onClick={() => setEditingCriteria(true)} />
          )}
          {onReviewChange && editingCriteria && (
            <SaveButton onClick={() => setEditingCriteria(false)} />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[32px] font-medium leading-9 tracking-[-0.6px]">
            {review.totalScore}/{review.maxScore}
          </p>
          <Progress
            value={(review.totalScore / review.maxScore) * 100}
            className="gap-0 [&_[data-slot=progress-indicator]]:bg-success [&_[data-slot=progress-track]]:h-[6px] [&_[data-slot=progress-track]]:bg-secondary"
          />
        </div>

        <div className="flex flex-col gap-2">
          {review.criteria.map((result) => {
            const criterion = criteria.find((c) => c.id === result.criterionId);

            return (
              <div
                key={result.criterionId}
                className={cn(
                  "flex flex-col gap-3 rounded-2xl border p-4 transition-colors",
                  hoveredCriterionId === result.criterionId
                    ? "border-primary bg-[#f0f2ff]"
                    : "border-[#e4e6f7]"
                )}
                onMouseEnter={() => onCriterionHover?.(result.criterionId)}
                onMouseLeave={() => onCriterionHover?.(null)}
              >
                <div className="flex items-start gap-3">
                  <p className="min-w-0 flex-1 text-lg font-medium leading-6 tracking-[-0.1px]">
                    {criterion
                      ? `${criterion.code}. ${criterion.title}`
                      : result.criterionId}
                  </p>
                  {editingCriteria ? (
                    <ScoreStepper
                      score={result.score}
                      maxScore={result.maxScore}
                      onChange={(score) =>
                        updateCriterion(result.criterionId, { score })
                      }
                    />
                  ) : (
                    <ScoreBadge
                      score={result.score}
                      maxScore={result.maxScore}
                    />
                  )}
                </div>
                {editingCriteria ? (
                  <div className="flex flex-col gap-1">
                    <div className="rounded-[10px] bg-secondary p-3">
                      <textarea
                        value={result.description}
                        onChange={(event) =>
                          updateCriterion(result.criterionId, {
                            description: clampReviewText(
                              event.target.value,
                              MAX_CRITERION_COMMENT_LENGTH
                            ),
                          })
                        }
                        maxLength={MAX_CRITERION_COMMENT_LENGTH}
                        rows={3}
                        className="w-full resize-y border-none bg-transparent text-base leading-6 outline-none"
                      />
                    </div>
                    <CharacterCounter
                      value={result.description}
                      maxLength={MAX_CRITERION_COMMENT_LENGTH}
                    />
                  </div>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
