"use client";

import { AppEmptyState } from "@/components/ui/app-empty-state";

interface AssignmentWorksEmptyProps {
  assignmentId: string;
}

export function AssignmentWorksEmpty({ assignmentId }: AssignmentWorksEmptyProps) {
  return (
    <AppEmptyState
      className="min-h-0 flex-1"
      imageSrc="/images/library-empty.png"
      title="Пока нет работ учеников"
      description="Загрузите работы учеников для проверки"
      actionLabel="Загрузить работы"
      actionHref={`/assignments/${assignmentId}/upload`}
    />
  );
}
