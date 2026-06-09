"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { HighlightedText } from "@/components/works/highlighted-text";
import { ReviewPanel } from "@/components/works/review-panel";
import { WorkThumbnails } from "@/components/works/work-thumbnails";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";
import { getWorkMediaItems } from "@/lib/work-images";
import { SUBJECT_LABELS, WORK_TYPE_LABELS } from "@/lib/types";

export function StudentReportContent() {
  const params = useParams();
  const assignmentId = params.id as string;
  const workId = params.workId as string;
  const { getAssignment, getWork } = useStore();

  const assignment = getAssignment(assignmentId);
  const work = getWork(assignmentId, workId);
  const [hoveredCriterionId, setHoveredCriterionId] = useState<string | null>(
    null
  );

  const highlightRanges = useMemo(() => {
    if (!work?.review || !hoveredCriterionId) return [];

    return (
      work.review.criteria.find(
        (result) => result.criterionId === hoveredCriterionId
      )?.textRanges ?? []
    );
  }, [work?.review, hoveredCriterionId]);

  if (!assignment || !work || !work.review || work.status !== "checked") {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Отчёт не найден
      </div>
    );
  }

  const mediaItems = getWorkMediaItems(work);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-primary">Отчёт для ученика</p>
        <h1 className="text-2xl font-medium tracking-[-0.2px]">
          {work.studentName}
        </h1>
        <p className="text-base text-muted-foreground">
          {assignment.title} · {SUBJECT_LABELS[assignment.subject]} ·{" "}
          {WORK_TYPE_LABELS[assignment.workType]}
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-[20px] bg-white p-6">
        <p className="text-[32px] font-medium leading-9 tracking-[-0.6px]">
          {work.review.totalScore}/{work.review.maxScore}
        </p>
        <Progress
          value={(work.review.totalScore / work.review.maxScore) * 100}
          className="gap-0 [&_[data-slot=progress-indicator]]:bg-success [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-secondary"
        />
      </div>

      <div className="flex flex-col rounded-[20px] bg-white lg:flex-row">
        <div className="flex min-w-0 flex-col gap-6 p-6 lg:flex-1">
          <h2 className="text-xl font-medium tracking-tight">Работа</h2>
          <WorkThumbnails items={mediaItems} />
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
          className="min-w-0 p-6 lg:flex-1"
        />
      </div>
    </div>
  );
}
