"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AssignmentsSearchEmpty } from "@/components/assignments/assignments-search-empty";
import { DeleteAssignmentDialog } from "@/components/assignments/delete-assignment-dialog";
import { NavIcon } from "@/components/layout/nav-icon";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import type { Assignment } from "@/lib/types";
import { SUBJECT_LABELS, WORK_TYPE_LABELS } from "@/lib/types";

interface AssignmentsTableProps {
  assignments: Assignment[];
}

export function AssignmentsTable({ assignments }: AssignmentsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const { deleteAssignment } = useStore();

  const searchQuery = search.trim();
  const hasSearch = searchQuery.length > 0;

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return assignments;
    return assignments.filter((a) => a.title.toLowerCase().includes(q));
  }, [assignments, searchQuery]);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteAssignment(deleteTarget.id);
    toast.success(`Задание «${deleteTarget.title}» удалено`);
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <div className="flex h-12 shrink-0 items-center justify-between">
          <div className="relative w-[320px]">
            <NavIcon
              name="search"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
            />
            <Input
              placeholder="Поиск по названию"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 rounded-[10px] border-none bg-white py-3 pr-11 pl-11 text-[16px] shadow-none placeholder:text-[16px] md:text-[16px]"
            />
            {hasSearch && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2"
                onClick={() => setSearch("")}
                aria-label="Очистить поиск"
              >
                <NavIcon name="cross" />
              </Button>
            )}
          </div>
          <ButtonLink href="/assignments/new">
            Создать задание
          </ButtonLink>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-white p-1">
          {hasSearch && filtered.length === 0 ? (
            <AssignmentsSearchEmpty
              query={searchQuery}
              onReset={() => setSearch("")}
            />
          ) : (
            <>
              <div className="shrink-0">
                <div className="flex items-center gap-4 py-2 pr-2 pl-4 text-base text-muted-foreground">
                  <div className="w-[420px] shrink-0">Название задания</div>
                  <div className="min-w-0 flex-1">Предмет</div>
                  <div className="min-w-0 flex-1">Тип работы</div>
                  <div className="min-w-0 flex-1">Параллель</div>
                  <div className="w-[72px] shrink-0" />
                </div>

                <div className="mx-4 h-px bg-border" />
              </div>

              <div className="min-h-0 flex-1 overflow-auto">
                <div className="flex flex-col">
                  {filtered.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex cursor-pointer items-center gap-4 rounded-xl py-2 pr-2 pl-4 text-base transition-colors hover:bg-secondary"
                    onClick={() => router.push(`/assignments/${assignment.id}`)}
                  >
                    <div className="w-[420px] shrink-0 truncate font-medium">
                      {assignment.title}
                    </div>
                    <div className="min-w-0 flex-1 truncate">
                      {SUBJECT_LABELS[assignment.subject]}
                    </div>
                    <div className="min-w-0 flex-1 truncate">
                      {WORK_TYPE_LABELS[assignment.workType]}
                    </div>
                    <div className="min-w-0 flex-1 truncate">
                      {assignment.grade}
                    </div>
                    <div
                      className="flex w-[72px] shrink-0 items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ButtonLink
                        href={`/assignments/${assignment.id}/edit`}
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-lg text-muted-foreground"
                      >
                        <NavIcon name="pen" />
                      </ButtonLink>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-lg hover:bg-destructive/10"
                        onClick={() =>
                          setDeleteTarget({
                            id: assignment.id,
                            title: assignment.title,
                          })
                        }
                      >
                        <NavIcon name="trash" destructive />
                      </Button>
                    </div>
                  </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <DeleteAssignmentDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}
