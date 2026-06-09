"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeleteWorkDialog } from "@/components/works/delete-work-dialog";
import { NavIcon } from "@/components/layout/nav-icon";
import { Button } from "@/components/ui/button";
import { WorkStatusBadge } from "./work-status-badge";
import { useStore } from "@/lib/store";
import type { Assignment, StudentWork } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StudentWorksTableProps {
  assignment: Assignment;
}

function getWorkHref(assignmentId: string, work: StudentWork) {
  if (work.status === "checked") {
    return `/assignments/${assignmentId}/works/${work.id}/review`;
  }
  if (work.status === "processing") {
    return `/assignments/${assignmentId}/works/${work.id}`;
  }
  return null;
}

export function StudentWorksTable({ assignment }: StudentWorksTableProps) {
  const router = useRouter();
  const { deleteWork } = useStore();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleRowClick = (work: StudentWork) => {
    const href = getWorkHref(assignment.id, work);
    if (href) router.push(href);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteWork(assignment.id, deleteTarget.id);
    toast.success(`Работа ${deleteTarget.name} удалена`);
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-white p-1">
        <div className="shrink-0">
          <div className="flex items-center gap-4 py-2 pr-2 pl-4 text-base text-muted-foreground">
            <div className="w-[420px] shrink-0">Имя ученика</div>
            <div className="min-w-0 flex-1">Статус</div>
            <div className="min-w-0 flex-1">Балл</div>
            <div className="w-[72px] shrink-0" />
          </div>

          <div className="mx-4 h-px bg-border" />
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <div className="flex flex-col">
            {assignment.works.map((work) => {
            const href = getWorkHref(assignment.id, work);
            const showScore =
              work.score !== undefined &&
              work.maxScore !== undefined &&
              work.status === "checked";

            return (
              <div
                key={work.id}
                className={cn(
                  "flex items-center gap-4 rounded-xl py-2 pr-2 pl-4 text-base transition-colors",
                  href && "cursor-pointer hover:bg-secondary"
                )}
                onClick={() => handleRowClick(work)}
              >
                <div className="w-[420px] shrink-0 truncate font-medium">
                  {work.studentName}
                </div>

                <div className="min-w-0 flex-1">
                  <WorkStatusBadge
                    status={work.status}
                    errorMessage={work.errorMessage}
                  />
                </div>

                <div className="min-w-0 flex-1 truncate font-medium">
                  {showScore ? `${work.score}/${work.maxScore}` : "\u00A0"}
                </div>

                <div
                  className="flex w-[72px] shrink-0 items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-lg"
                    onClick={() =>
                      setDeleteTarget({
                        id: work.id,
                        name: work.studentName,
                      })
                    }
                  >
                    <NavIcon name="trash" />
                  </Button>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </div>

      <DeleteWorkDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}
