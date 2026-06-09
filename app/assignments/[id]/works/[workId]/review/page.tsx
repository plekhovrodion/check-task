"use client";

import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { NavIcon } from "@/components/layout/nav-icon";
import { PageHeader } from "@/components/layout/page-header";
import { ReviewPanel } from "@/components/works/review-panel";
import { ReviewRating } from "@/components/works/review-rating";
import { WorkThumbnails } from "@/components/works/work-thumbnails";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { useStore } from "@/lib/store";

export default function WorkReviewPage() {
  const params = useParams();
  const assignmentId = params.id as string;
  const workId = params.workId as string;
  const { getAssignment, getWork } = useStore();

  const assignment = getAssignment(assignmentId);
  const work = getWork(assignmentId, workId);

  const works = assignment?.works.filter((w) => w.status === "checked") ?? [];
  const currentIndex = works.findIndex((w) => w.id === workId);
  const prevWork = currentIndex > 0 ? works[currentIndex - 1] : null;
  const nextWork =
    currentIndex < works.length - 1 ? works[currentIndex + 1] : null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/assignments/${assignmentId}/works/${workId}/review`
    );
    toast.success("Ссылка скопирована");
  };

  if (!assignment || !work || !work.review) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Результат проверки не найден
      </div>
    );
  }

  const images = work.review.pageImages;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageHeader
        className="shrink-0"
        breadcrumbs={[
          { label: "ИИ-проверка заданий", href: "/assignments" },
          { label: assignment.title, href: `/assignments/${assignmentId}` },
          { label: work.studentName },
        ]}
        title={work.studentName}
        navigation={
          <div className="flex items-center">
            {prevWork && (
              <ButtonLink
                href={`/assignments/${assignmentId}/works/${prevWork.id}/review`}
                variant="secondary"
                size="icon"
                className="size-10 rounded-lg"
              >
                <ChevronLeft />
              </ButtonLink>
            )}
            {nextWork && (
              <ButtonLink
                href={`/assignments/${assignmentId}/works/${nextWork.id}/review`}
                variant="secondary"
                size="icon"
                className="size-10 rounded-lg"
              >
                <ChevronRight />
              </ButtonLink>
            )}
          </div>
        }
        actions={
          <>
            <Button variant="ghost" size="icon">
              <RefreshCw />
            </Button>
            <Button variant="ghost" size="icon">
              <Download />
            </Button>
            <Button onClick={handleCopyLink}>
              Скопировать ссылку для ученика
            </Button>
          </>
        }
      />

      <div className="mt-6 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col rounded-[20px] bg-white lg:min-h-0 lg:flex-1 lg:flex-row lg:overflow-hidden">
          <div className="flex min-w-0 flex-col gap-6 p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            <div className="flex shrink-0 items-center gap-2">
              <h2 className="text-xl font-medium tracking-tight">Работа ученика</h2>
              <NavIcon name="pen" />
            </div>
            <WorkThumbnails images={images} />
            <p className="whitespace-pre-wrap text-base leading-6">
              {work.review.recognizedText}
            </p>
          </div>

          <div className="hidden w-px shrink-0 bg-[#e4e6f7] lg:block" />

          <ReviewPanel
            assignment={assignment}
            review={work.review}
            className="min-w-0 p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
          />
        </div>

        <ReviewRating className="shrink-0 pb-2" />
      </div>
    </div>
  );
}
