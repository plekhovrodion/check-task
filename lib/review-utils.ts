import type { CriterionResult } from "./types";

export const MAX_REVIEW_FEEDBACK_LENGTH = 2000;
export const MAX_CRITERION_COMMENT_LENGTH = 500;

export function clampReviewText(value: string, maxLength: number) {
  return value.slice(0, maxLength);
}

export function calcScoredTotal(criteria: CriterionResult[]) {
  return criteria
    .filter((criterion) => criterion.maxScore > 0)
    .reduce((sum, criterion) => sum + criterion.score, 0);
}
