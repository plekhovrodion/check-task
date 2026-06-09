import { INITIAL_ASSIGNMENTS } from "./mock-data";

export function getAssignmentStaticParams() {
  return INITIAL_ASSIGNMENTS.map((assignment) => ({
    id: assignment.id,
  }));
}

export function getWorkStaticParams() {
  return INITIAL_ASSIGNMENTS.flatMap((assignment) =>
    assignment.works.map((work) => ({
      id: assignment.id,
      workId: work.id,
    }))
  );
}
