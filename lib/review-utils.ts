import type { CriterionResult } from "./types";

export function calcScoredTotal(criteria: CriterionResult[]) {
  return criteria
    .filter((criterion) => criterion.maxScore > 0)
    .reduce((sum, criterion) => sum + criterion.score, 0);
}
