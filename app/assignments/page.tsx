"use client";

import { AssignmentsEmpty } from "@/components/assignments/assignments-empty";
import { AssignmentsTable } from "@/components/assignments/assignments-table";
import { useStore } from "@/lib/store";

export default function AssignmentsPage() {
  const { assignments, showEmptyState } = useStore();

  if (showEmptyState || assignments.length === 0) {
    return <AssignmentsEmpty />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AssignmentsTable assignments={assignments} />
    </div>
  );
}
