"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NavIcon } from "@/components/layout/nav-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CriteriaPanel } from "./criteria-panel";
import { PageHeader } from "@/components/layout/page-header";
import { useStore } from "@/lib/store";
import type { Subject, WorkType } from "@/lib/types";

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

export function AssignmentForm() {
  const router = useRouter();
  const { createAssignment } = useStore();
  const [title, setTitle] = useState("Новое задание");
  const [subject, setSubject] = useState<Subject>("russian");
  const [workType, setWorkType] = useState<WorkType>("ege");

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error("Введите название задания");
      return;
    }
    const assignment = createAssignment({
      title: title.trim(),
      subject,
      workType,
      grade: "11-я параллель",
    });
    toast.success("Задание создано");
    router.push(`/assignments/${assignment.id}`);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "ИИ-проверка заданий", href: "/assignments" },
          { label: "Создание задания" },
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
                  <Label htmlFor="russian" className="cursor-pointer text-base font-normal">
                    Русский язык
                  </Label>
                </div>
                <div className="flex h-5 items-center gap-2">
                  <RadioGroupItem value="literature" id="literature" />
                  <Label htmlFor="literature" className="cursor-pointer text-base font-normal">
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
                    <Label htmlFor={value} className="cursor-pointer text-base font-normal">
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
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
            onClick={() => router.push("/assignments")}
          >
            Отменить
          </Button>
          <Button onClick={handleCreate}>
            Создать задание
          </Button>
        </div>
      </div>
    </div>
  );
}
