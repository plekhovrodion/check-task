"use client";

import { useParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/layout/page-header";
import { AssignmentWorksEmpty } from "@/components/works/assignment-works-empty";
import { StudentWorksTable } from "@/components/works/student-works-table";
import { getCriteriaSummary } from "@/lib/criteria";
import { useStore } from "@/lib/store";
import { SUBJECT_LABELS, WORK_TYPE_LABELS } from "@/lib/types";

export default function AssignmentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { getAssignment } = useStore();
  const assignment = getAssignment(id);

  if (!assignment) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Задание не найдено
      </div>
    );
  }

  const summary = getCriteriaSummary(assignment.subject, assignment.workType);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageHeader
        className="shrink-0"
        breadcrumbs={[
          { label: "ИИ-проверка заданий", href: "/assignments" },
          { label: assignment.title },
        ]}
        title={assignment.title}
        subtitle={`${SUBJECT_LABELS[assignment.subject]} · ${WORK_TYPE_LABELS[assignment.workType]} · ${summary}`}
        actions={
          <ButtonLink href={`/assignments/${id}/upload`}>
            Загрузить работы
          </ButtonLink>
        }
      />

      {assignment.works.length === 0 ? (
        <AssignmentWorksEmpty assignmentId={id} />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <StudentWorksTable assignment={assignment} />
        </div>
      )}
    </div>
  );
}
