"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { NavIcon } from "@/components/layout/nav-icon";
import { PageHeader } from "@/components/layout/page-header";
import { HighlightedText } from "@/components/works/highlighted-text";
import { RecheckWorkDialog } from "@/components/works/recheck-work-dialog";
import { ReviewPanel } from "@/components/works/review-panel";
import { ReviewRating } from "@/components/works/review-rating";
import { TextEditView } from "@/components/works/text-edit-view";
import { WorkThumbnails } from "@/components/works/work-thumbnails";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { useStore } from "@/lib/store";
import { enrichCriteriaWithTextRanges } from "@/lib/criterion-highlights";
import { getCriteria } from "@/lib/criteria";
import { getWorkPageImages } from "@/lib/work-images";
import { cn } from "@/lib/utils";

export function WorkReviewContent() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  const workId = params.workId as string;
  const { getAssignment, getWork, updateReview, startProcessing } = useStore();

  const assignment = getAssignment(assignmentId);
  const work = getWork(assignmentId, workId);

  const [isEditingText, setIsEditingText] = useState(false);
  const [recheckDialogOpen, setRecheckDialogOpen] = useState(false);
  const [recheckDialogVariant, setRecheckDialogVariant] = useState<
    "afterEdit" | "regenerate"
  >("afterEdit");
  const [hoveredCriterionId, setHoveredCriterionId] = useState<string | null>(
    null
  );

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

  const handleRecheck = () => {
    startProcessing(assignmentId, workId);
    router.push(`/assignments/${assignmentId}/works/${workId}`);
  };

  const handleSaveText = (nextText: string) => {
    if (!work?.review) return;

    const textChanged = nextText !== work.review.recognizedText;

    if (textChanged) {
      const criteriaDefs = getCriteria(assignment!.subject, assignment!.workType);
      updateReview(assignmentId, workId, {
        ...work.review,
        recognizedText: nextText,
        criteria: enrichCriteriaWithTextRanges(
          nextText,
          criteriaDefs,
          work.review.criteria
        ),
      });
    }

    setIsEditingText(false);

    if (textChanged) {
      setRecheckDialogVariant("afterEdit");
      setRecheckDialogOpen(true);
    }
  };

  const openRecheckDialog = (variant: "afterEdit" | "regenerate") => {
    setRecheckDialogVariant(variant);
    setRecheckDialogOpen(true);
  };

  const highlightRanges = useMemo(() => {
    if (!work?.review || !hoveredCriterionId) return [];

    return (
      work.review.criteria.find(
        (result) => result.criterionId === hoveredCriterionId
      )?.textRanges ?? []
    );
  }, [work?.review, hoveredCriterionId]);

  if (!assignment || !work || !work.review) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Результат проверки не найден
      </div>
    );
  }

  const images = getWorkPageImages(work);

  if (isEditingText) {
    return (
      <>
        <TextEditView
          images={images}
          text={work.review.recognizedText}
          onSave={handleSaveText}
        />
        <RecheckWorkDialog
          open={recheckDialogOpen}
          onOpenChange={setRecheckDialogOpen}
          onConfirm={handleRecheck}
          variant={recheckDialogVariant}
        />
      </>
    );
  }

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
            <Button
              variant="ghost"
              size="icon"
              aria-label="Проверить заново"
              onClick={() => openRecheckDialog("regenerate")}
            >
              <RefreshCw />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Скачать">
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
            <button
              type="button"
              onClick={() => setIsEditingText(true)}
              className={cn(
                "rounded-md p-0.5 transition-colors hover:bg-secondary"
              )}
              aria-label="Редактировать текст работы"
            >
              <NavIcon name="pen" />
            </button>
          </div>
          <WorkThumbnails images={images} />
          <p className="whitespace-pre-wrap text-base leading-6">
            <HighlightedText
              text={work.review.recognizedText}
              ranges={highlightRanges}
              active={hoveredCriterionId !== null}
            />
          </p>
        </div>

        <div className="hidden w-px shrink-0 bg-[#e4e6f7] lg:block" />

        <ReviewPanel
          assignment={assignment}
          review={work.review}
          hoveredCriterionId={hoveredCriterionId}
          onCriterionHover={setHoveredCriterionId}
          onReviewChange={(review) =>
            updateReview(assignmentId, workId, review)
          }
          className="min-w-0 p-6 lg:flex-1"
        />
      </div>

      <ReviewRating className="pb-2" />

      <RecheckWorkDialog
        open={recheckDialogOpen}
        onOpenChange={setRecheckDialogOpen}
        onConfirm={handleRecheck}
        variant={recheckDialogVariant}
      />
    </div>
  );
}
