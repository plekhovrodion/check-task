import type { Criterion, CriterionResult, TextRange } from "./types";

const LANGUAGE_CRITERION_IDS = new Set([
  "k7",
  "k8",
  "k9",
  "k10",
  "gk1",
  "gk2",
  "gk3",
  "gk4",
]);

export function getParagraphRanges(text: string): TextRange[] {
  const ranges: TextRange[] = [];
  let pos = 0;

  for (const line of text.split("\n")) {
    if (line.length > 0) {
      ranges.push({ start: pos, end: pos + line.length });
    }
    pos += line.length + 1;
  }

  return ranges;
}

function findRange(text: string, snippet: string): TextRange | null {
  const index = text.indexOf(snippet);
  if (index < 0) return null;
  return { start: index, end: index + snippet.length };
}

function findLanguageHighlights(
  text: string,
  result: CriterionResult
): TextRange[] {
  const ranges: TextRange[] = [];

  if (result.criterionId === "k8") {
    const snippets = ["без особо энтузиазма", "и  добивался"];
    for (const snippet of snippets) {
      const range = findRange(text, snippet);
      if (range) ranges.push(range);
    }
  }

  if (result.criterionId === "k9") {
    const range = findRange(text, "в нем");
    if (range) ranges.push(range);
  }

  if (result.criterionId === "k10") {
    let searchFrom = 0;
    while (searchFrom < text.length) {
      const index = text.indexOf("На мой взгляд", searchFrom);
      if (index < 0) break;
      ranges.push({ start: index, end: index + "На мой взгляд".length });
      searchFrom = index + 1;
    }
  }

  for (const error of result.errors ?? []) {
    const quoted = error.match(/«([^»]+)»/)?.[1];
    if (quoted) {
      const range = findRange(text, quoted);
      if (range) ranges.push(range);
    }
  }

  return ranges;
}

function mergeRanges(ranges: TextRange[]): TextRange[] {
  if (ranges.length === 0) return [];

  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged: TextRange[] = [{ ...sorted[0] }];

  for (let index = 1; index < sorted.length; index++) {
    const current = sorted[index];
    const last = merged[merged.length - 1];

    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

export function enrichCriteriaWithTextRanges(
  text: string,
  criteria: Criterion[],
  results: CriterionResult[]
): CriterionResult[] {
  const paragraphs = getParagraphRanges(text);
  const fullText: TextRange[] = [{ start: 0, end: text.length }];
  const contentCriteria = criteria.filter(
    (criterion) =>
      criterion.id !== "k0" && !LANGUAGE_CRITERION_IDS.has(criterion.id)
  );

  return results.map((result) => {
    if (result.criterionId === "k0") {
      return { ...result, textRanges: fullText };
    }

    if (LANGUAGE_CRITERION_IDS.has(result.criterionId)) {
      const languageRanges = mergeRanges(findLanguageHighlights(text, result));
      return {
        ...result,
        textRanges:
          languageRanges.length > 0
            ? languageRanges
            : paragraphs.length > 0
              ? [paragraphs[paragraphs.length - 1]]
              : fullText,
      };
    }

    const contentIndex = contentCriteria.findIndex(
      (criterion) => criterion.id === result.criterionId
    );

    if (contentIndex < 0 || paragraphs.length === 0) {
      return { ...result, textRanges: fullText };
    }

    const chunkSize = Math.max(1, Math.ceil(paragraphs.length / contentCriteria.length));
    const startIndex = Math.min(
      contentIndex * chunkSize,
      paragraphs.length - 1
    );
    const ranges = paragraphs.slice(startIndex, startIndex + chunkSize);

    return {
      ...result,
      textRanges: ranges.length > 0 ? ranges : [paragraphs[0]],
    };
  });
}
