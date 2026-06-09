import type { Assignment } from "./types";

const STORAGE_KEY = "ap-check-store";

export interface StoreCache {
  assignments: Assignment[];
  showEmptyState: boolean;
}

function isAssignment(value: unknown): value is Assignment {
  if (!value || typeof value !== "object") return false;
  const a = value as Assignment;
  return (
    typeof a.id === "string" &&
    typeof a.title === "string" &&
    typeof a.subject === "string" &&
    typeof a.workType === "string" &&
    typeof a.grade === "string" &&
    Array.isArray(a.works) &&
    typeof a.createdAt === "string"
  );
}

function parseStoreCache(raw: string): StoreCache | null {
  try {
    const data = JSON.parse(raw) as Partial<StoreCache>;
    if (!Array.isArray(data.assignments)) return null;

    const assignments = data.assignments.filter(isAssignment);
    return {
      assignments,
      showEmptyState: data.showEmptyState === true,
    };
  } catch {
    return null;
  }
}

export function loadStoreCache(): StoreCache | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  return parseStoreCache(raw);
}

export function saveStoreCache(cache: StoreCache): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage quota exceeded or unavailable
  }
}

export function clearStoreCache(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
