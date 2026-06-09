export interface StudentList {
  id: string;
  name: string;
  students: string[];
  createdAt: string;
}

const STORAGE_KEY = "ap-check-student-lists";

function isStudentList(value: unknown): value is StudentList {
  if (!value || typeof value !== "object") return false;
  const list = value as StudentList;
  return (
    typeof list.id === "string" &&
    typeof list.name === "string" &&
    Array.isArray(list.students) &&
    list.students.every((student) => typeof student === "string") &&
    typeof list.createdAt === "string"
  );
}

export function loadStudentLists(): StudentList[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(isStudentList);
  } catch {
    return [];
  }
}

export function saveStudentLists(lists: StudentList[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch {
    // localStorage quota exceeded or unavailable
  }
}

export function createStudentListId(): string {
  return `list-${Date.now()}`;
}

export function parseStudentsFromText(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter(Boolean);
}

export function studentsToText(students: string[]): string {
  const lines = [...students];
  const minLines = Math.max(10, lines.length);

  while (lines.length < minLines) {
    lines.push("");
  }

  return lines.join("\n");
}

export function formatStudentCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} ученик`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} ученика`;
  }

  return `${count} учеников`;
}

export function formatAddStudentsLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `Добавить ${count} ученика`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `Добавить ${count} ученика`;
  }

  return `Добавить ${count} учеников`;
}
