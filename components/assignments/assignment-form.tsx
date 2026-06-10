"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChangeCriteriaDialog } from "@/components/assignments/change-criteria-dialog";
import { NavIcon } from "@/components/layout/nav-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CriteriaPanel } from "./criteria-panel";
import { PageHeader } from "@/components/layout/page-header";
import { useStore } from "@/lib/store";
import type { AssignmentFormData, Subject, WorkType } from "@/lib/types";

function FormLabel({
  children,
  required,
}: {
  children: string;
  required?: boolean;
}) {
  return (
    <p className="text-base font-medium text-foreground">
      {children}
      {required && <span className="text-[#fa3448]">*</span>}
    </p>
  );
}

interface AssignmentFormProps {
  assignmentId?: string;
}

export function AssignmentForm({ assignmentId }: AssignmentFormProps) {
  const router = useRouter();
  const {
    getAssignment,
    createAssignment,
    updateAssignment,
    recheckAllWorks,
    clearAllWorks,
  } = useStore();

  const assignment = assignmentId ? getAssignment(assignmentId) : undefined;
  const isEditMode = Boolean(assignmentId);

  const [title, setTitle] = useState(assignment?.title ?? "Новое задание");
  const [subject, setSubject] = useState<Subject>(
    assignment?.subject ?? "russian"
  );
  const [workType, setWorkType] = useState<WorkType>(
    assignment?.workType ?? "ege"
  );
  const [changeCriteriaDialogOpen, setChangeCriteriaDialogOpen] =
    useState(false);
  const [pendingSave, setPendingSave] = useState<AssignmentFormData | null>(
    null
  );

  if (isEditMode && !assignment) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Задание не найдено
      </div>
    );
  }

  const formData: AssignmentFormData = {
    title: title.trim(),
    subject,
    workType,
    grade: assignment?.grade ?? "11-я параллель",
  };

  const criteriaChanged =
    isEditMode &&
    assignment &&
    (subject !== assignment.subject || workType !== assignment.workType);

  const checkedCount =
    assignment?.works.filter((w) => w.status === "checked").length ?? 0;

  const navigateAfterSave = (path: string) => {
    router.push(path);
  };

  const applySave = (data: AssignmentFormData) => {
    if (!assignmentId) return;
    updateAssignment(assignmentId, data);
  };

  const handleRecheck = () => {
    if (!assignmentId || !pendingSave) return;
    const firstChecked = assignment?.works.find((w) => w.status === "checked");
    applySave(pendingSave);
    recheckAllWorks(assignmentId);
    toast.success(
      `${checkedCount} ${checkedCount === 1 ? "работа отправлена" : "работ отправлено"} на перепроверку`
    );
    setPendingSave(null);

    if (firstChecked) {
      navigateAfterSave(
        `/assignments/${assignmentId}/works/${firstChecked.id}`
      );
    } else {
      navigateAfterSave(`/assignments/${assignmentId}`);
    }
  };

  const handleClearAndUpload = () => {
    if (!assignmentId || !pendingSave) return;
    applySave(pendingSave);
    clearAllWorks(assignmentId);
    toast.success("Работы удалены. Загрузите их заново по новым критериям");
    setPendingSave(null);
    navigateAfterSave(`/assignments/${assignmentId}/upload`);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Введите название задания");
      return;
    }

    if (!isEditMode) {
      const created = createAssignment(formData);
      toast.success("Задание создано");
      router.push(`/assignments/${created.id}`);
      return;
    }

    if (!criteriaChanged) {
      applySave(formData);
      toast.success("Изменения сохранены");
      navigateAfterSave(`/assignments/${assignmentId}`);
      return;
    }

    if (checkedCount === 0) {
      applySave(formData);
      toast.success("Критерии изменены. Новые настройки применятся при проверке");
      navigateAfterSave(`/assignments/${assignmentId}`);
      return;
    }

    setPendingSave(formData);
    setChangeCriteriaDialogOpen(true);
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <PageHeader
          breadcrumbs={[
            { label: "ИИ-проверка заданий", href: "/assignments" },
            ...(isEditMode && assignment
              ? [
                  {
                    label: assignment.title,
                    href: `/assignments/${assignmentId}`,
                  },
                  { label: "Редактирование" },
                ]
              : [{ label: "Создание задания" }]),
          ]}
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-white">
          <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
            <div className="flex min-h-0 flex-col gap-6 overflow-y-auto p-6">
              <div className="flex flex-col gap-2">
                <FormLabel required>Название задания</FormLabel>
                <div className="relative">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-12 rounded-[10px] border-none bg-secondary pr-10 text-[16px] shadow-none md:text-[16px]"
                  />
                  {title && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-2 -translate-y-1/2"
                      onClick={() => setTitle("")}
                    >
                      <NavIcon name="cross" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <FormLabel required>Предмет</FormLabel>
                <RadioGroup
                  value={subject}
                  onValueChange={(v) => setSubject(v as Subject)}
                  className="flex flex-col gap-3"
                >
                  <div className="flex h-5 items-center gap-2">
                    <RadioGroupItem value="russian" id="russian" />
                    <Label
                      htmlFor="russian"
                      className="cursor-pointer text-base font-normal"
                    >
                      Русский язык
                    </Label>
                  </div>
                  <div className="flex h-5 items-center gap-2">
                    <RadioGroupItem value="literature" id="literature" />
                    <Label
                      htmlFor="literature"
                      className="cursor-pointer text-base font-normal"
                    >
                      Литература
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-3">
                <FormLabel required>Тип работы и критерии</FormLabel>
                <RadioGroup
                  value={workType}
                  onValueChange={(v) => setWorkType(v as WorkType)}
                  className="flex flex-col gap-3"
                >
                  {(
                    [
                      ["ege", "ЕГЭ"],
                      ["oge", "ОГЭ"],
                      ["final-essay", "Итоговое сочинение"],
                      ["essay", "Сочинение"],
                    ] as const
                  ).map(([value, label]) => (
                    <div key={value} className="flex h-5 items-center gap-2">
                      <RadioGroupItem value={value} id={value} />
                      <Label
                        htmlFor={value}
                        className="cursor-pointer text-base font-normal"
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {isEditMode && criteriaChanged && checkedCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    При сохранении нужно будет выбрать, что делать с уже
                    проверенными работами
                  </p>
                )}
              </div>

              <button
                type="button"
                className="flex w-fit items-center gap-1.5 text-base font-medium text-foreground"
              >
                Параллель
                <NavIcon name="plus" />
              </button>
              <button
                type="button"
                className="flex w-fit items-center gap-1.5 text-base font-medium text-foreground"
              >
                Текст задания
                <NavIcon name="plus" />
              </button>
            </div>

            <CriteriaPanel subject={subject} workType={workType} />
          </div>

          <div className="flex items-center justify-between border-t border-[#e4e6f7] px-6 pt-4 pb-6">
            <Button
              variant="secondary"
              onClick={() =>
                router.push(
                  isEditMode ? `/assignments/${assignmentId}` : "/assignments"
                )
              }
            >
              Отменить
            </Button>
            <Button onClick={handleSubmit}>
              {isEditMode ? "Сохранить изменения" : "Создать задание"}
            </Button>
          </div>
        </div>
      </div>

      {isEditMode && assignment && pendingSave && (
        <ChangeCriteriaDialog
          open={changeCriteriaDialogOpen}
          onOpenChange={(open) => {
            setChangeCriteriaDialogOpen(open);
            if (!open) setPendingSave(null);
          }}
          checkedCount={checkedCount}
          fromSubject={assignment.subject}
          fromWorkType={assignment.workType}
          toSubject={pendingSave.subject}
          toWorkType={pendingSave.workType}
          onRecheck={handleRecheck}
          onClearAndUpload={handleClearAndUpload}
        />
      )}
    </>
  );
}
