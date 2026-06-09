"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/layout/page-header";
import { ProcessingStepper } from "@/components/works/processing-stepper";
import { WorkViewer } from "@/components/works/work-viewer";
import { SAMPLE_PAGE_IMAGES } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export function WorkProcessingContent() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  const workId = params.workId as string;
  const { getAssignment, getWork, completeProcessing } = useStore();

  const assignment = getAssignment(assignmentId);
  const work = getWork(assignmentId, workId);

  const [progress, setProgress] = useState(12);
  const [currentStep, setCurrentStep] = useState(1);

  const works = assignment?.works ?? [];
  const currentIndex = works.findIndex((w) => w.id === workId);
  const prevWork = currentIndex > 0 ? works[currentIndex - 1] : null;
  const nextWork =
    currentIndex < works.length - 1 ? works[currentIndex + 1] : null;

  useEffect(() => {
    if (!work) return;

    if (work.status === "checked") {
      router.replace(`/assignments/${assignmentId}/works/${workId}/review`);
      return;
    }

    if (work.status !== "processing") return;

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 8, 100);
        return next;
      });
      setCurrentStep((s) => Math.min(s + 1, 6));
    }, 1500);

    const timeout = setTimeout(() => {
      completeProcessing(assignmentId, workId);
      router.push(`/assignments/${assignmentId}/works/${workId}/review`);
    }, 12000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [work, assignmentId, workId, completeProcessing, router]);

  if (!assignment || !work) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Работа не найдена
      </div>
    );
  }

  const images =
    work.uploadedFiles?.map((f) => f.url) ?? SAMPLE_PAGE_IMAGES;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "ИИ-проверка заданий", href: "/assignments" },
          { label: assignment.title, href: `/assignments/${assignmentId}` },
          { label: work.studentName },
        ]}
        title={work.studentName}
        navigation={
          <div className="flex items-center gap-1">
            {prevWork && (
              <ButtonLink
                href={`/assignments/${assignmentId}/works/${prevWork.id}`}
                variant="ghost"
                size="icon"
              >
                <ChevronLeft />
              </ButtonLink>
            )}
            {nextWork && (
              <ButtonLink
                href={`/assignments/${assignmentId}/works/${nextWork.id}`}
                variant="ghost"
                size="icon"
              >
                <ChevronRight />
              </ButtonLink>
            )}
          </div>
        }
      />

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-[24px] bg-white">
        <div className="min-w-0 flex-1">
          <WorkViewer images={images} />
        </div>
        <div className="w-px shrink-0 bg-[#e4e6f7]" />
        <div className="w-full max-w-md shrink-0">
          <ProcessingStepper
            progress={progress}
            currentStep={currentStep}
            onCancel={() => router.push(`/assignments/${assignmentId}`)}
          />
        </div>
      </div>
    </div>
  );
}
