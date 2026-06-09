"use client";

import { AppEmptyState } from "@/components/ui/app-empty-state";
import { assetPath } from "@/lib/asset-path";

export function AssignmentsEmpty() {
  return (
    <AppEmptyState
      className="min-h-0 flex-1"
      imageSrc={assetPath("/images/library-empty.png")}
      title="Пока нет заданий"
      description="Создайте первое задание для проверки письменных работ учеников"
      actionLabel="Создать задание"
      actionHref="/assignments/new"
    />
  );
}
