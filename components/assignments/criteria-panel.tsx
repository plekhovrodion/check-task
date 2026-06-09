"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCriteria, getCriteriaSummary } from "@/lib/criteria";
import type { Subject, WorkType } from "@/lib/types";
import { SUBJECT_LABELS, WORK_TYPE_LABELS } from "@/lib/types";

interface CriteriaPanelProps {
  subject: Subject;
  workType: WorkType;
}

export function CriteriaPanel({ subject, workType }: CriteriaPanelProps) {
  const criteria = getCriteria(subject, workType);
  const summary = getCriteriaSummary(subject, workType);

  return (
    <div className="flex flex-col gap-4 border-[#e4e6f7] p-6 lg:border-l">
      <div>
        <h2 className="text-xl font-medium tracking-[-0.2px]">
          Критерии оценивания
        </h2>
        <p className="mt-1 text-base text-muted-foreground">
          {SUBJECT_LABELS[subject]} · {WORK_TYPE_LABELS[workType]} · {summary}
        </p>
      </div>

      <Accordion multiple className="flex w-full flex-col gap-2">
        {criteria.map((criterion) => (
          <AccordionItem
            key={criterion.id}
            value={criterion.id}
            className="rounded-xl border border-[#e4e6f7]"
          >
            <AccordionTrigger className="px-4 py-4 hover:no-underline">
              <div className="flex flex-1 items-start gap-2 text-left">
                {criterion.maxScore > 0 && (
                  <span className="flex min-w-5 items-center justify-center rounded-full bg-secondary px-1 py-0.5 text-sm font-medium">
                    {criterion.maxScore}
                  </span>
                )}
                <span className="flex-1 text-base font-medium">
                  {criterion.code}. {criterion.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-base whitespace-pre-wrap text-muted-foreground">
              {criterion.description ??
                `Критерий оценивания по ${WORK_TYPE_LABELS[workType]} для предмета «${SUBJECT_LABELS[subject]}».`}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
