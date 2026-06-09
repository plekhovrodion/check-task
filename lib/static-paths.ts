import { INITIAL_ASSIGNMENTS } from "./mock-data";
import type { Assignment, StudentWork } from "./types";

export const MAX_STATIC_ASSIGNMENT_ID = 100;
export const MAX_STATIC_WORKS_PER_ASSIGNMENT = 50;

export function getAssignmentStaticParams() {
  return Array.from({ length: MAX_STATIC_ASSIGNMENT_ID }, (_, index) => ({
    id: String(index + 1),
  }));
}

export function getWorkStaticParams() {
  const params: Array<{ id: string; workId: string }> = [];

  for (let assignmentIndex = 0; assignmentIndex < MAX_STATIC_ASSIGNMENT_ID; assignmentIndex++) {
    const id = String(assignmentIndex + 1);
    for (let workIndex = 0; workIndex < MAX_STATIC_WORKS_PER_ASSIGNMENT; workIndex++) {
      params.push({
        id,
        workId: `w${workIndex + 1}`,
      });
    }
  }

  for (const assignment of INITIAL_ASSIGNMENTS) {
    for (const work of assignment.works) {
      const key = `${assignment.id}:${work.id}`;
      if (!params.some((param) => `${param.id}:${param.workId}` === key)) {
        params.push({ id: assignment.id, workId: work.id });
      }
    }
  }

  return params;
}

export function nextAssignmentId(assignments: Assignment[]): string {
  const used = new Set(assignments.map((assignment) => assignment.id));

  for (let index = 1; index <= MAX_STATIC_ASSIGNMENT_ID; index++) {
    const id = String(index);
    if (!used.has(id)) return id;
  }

  return String(MAX_STATIC_ASSIGNMENT_ID);
}

export function nextWorkId(works: StudentWork[]): string {
  const used = new Set(works.map((work) => work.id));

  for (let index = 1; index <= MAX_STATIC_WORKS_PER_ASSIGNMENT; index++) {
    const id = `w${index}`;
    if (!used.has(id)) return id;
  }

  return `w${MAX_STATIC_WORKS_PER_ASSIGNMENT}`;
}

function isStaticAssignmentId(id: string) {
  if (!/^\d+$/.test(id)) return false;
  const numericId = Number(id);
  return numericId >= 1 && numericId <= MAX_STATIC_ASSIGNMENT_ID;
}

function isStaticWorkId(id: string) {
  const match = /^w(\d+)$/.exec(id);
  if (!match) return false;
  const numericId = Number(match[1]);
  return numericId >= 1 && numericId <= MAX_STATIC_WORKS_PER_ASSIGNMENT;
}

export function normalizeAssignmentsForStaticExport(
  assignments: Assignment[]
): Assignment[] {
  const normalized: Assignment[] = [];

  for (const assignment of assignments) {
    const assignmentId = isStaticAssignmentId(assignment.id)
      ? assignment.id
      : nextAssignmentId(normalized);

    const works: StudentWork[] = [];
    for (const work of assignment.works) {
      works.push({
        ...work,
        id: isStaticWorkId(work.id) ? work.id : nextWorkId(works),
      });
    }

    normalized.push({
      ...assignment,
      id: assignmentId,
      works,
    });
  }

  return normalized;
}
