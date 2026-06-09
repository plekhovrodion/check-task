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
import { getWorkPageImages } from "@/lib/work-images";

export function WorkReviewContent() {
  const params = useParams();
  const assignmentId = params.id as string;
  const workId = params.workId as string;
  const { getAssignment, getWork, updateReview } = useStore();

  const assignment = getAssignment(assignmentId);
  const work = getWork(assignmentId, workId);

  const works = assignment?.works.filter((w) => w.status === "checked") ?? [];
  const currentIndex = works.findIndex((w) => w.id === workId);
  const showWorkNavigation = works.length > 2;
  const prevWork =
    showWorkNavigation && currentIndex > 0 ? works[currentIndex - 1] : null;
  const nextWork =
    showWorkNavigation && currentIndex < works.length - 1
      ? works[currentIndex + 1]
      : null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Ссылка скопирована");
  };

  if (!assignment || !work || !work.review) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Результат проверки не найден
      </div>
    );
  }

  const images = getWorkPageImages(work);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "ИИ-проверка заданий", href: "/assignments" },
          { label: assignment.title, href: `/assignments/${assignmentId}` },
          { label: work.studentName },
        ]}
        title={work.studentName}
        navigation={
          showWorkNavigation ? (
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
          ) : undefined
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

      <div className="flex flex-col rounded-[20px] bg-white lg:flex-row">
        <div className="flex min-w-0 flex-col gap-6 p-6 lg:flex-1">
          <div className="flex items-center gap-2">
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
          onReviewChange={(review) =>
            updateReview(assignmentId, workId, review)
          }
          className="min-w-0 p-6 lg:flex-1"
        />
      </div>

      <ReviewRating className="pb-2" />
    </div>
  );
}
