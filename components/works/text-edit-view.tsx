"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WorkViewer } from "@/components/works/work-viewer";
import type { WorkMediaItem } from "@/lib/work-files";
import { cn } from "@/lib/utils";

interface TextEditViewProps {
  items: WorkMediaItem[];
  text: string;
  onSave: (text: string) => void;
  className?: string;
}

export function TextEditView({
  items,
  text,
  onSave,
  className,
}: TextEditViewProps) {
  const [draft, setDraft] = useState(text);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-center gap-2">
        <h1 className="flex-1 text-2xl font-medium tracking-[-0.2px]">
          Редактирование текста
        </h1>
        <Button onClick={() => onSave(draft)}>Сохранить и закрыть</Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-white lg:flex-row">
        <div className="min-h-[320px] min-w-0 flex-1 lg:min-h-[560px]">
          <WorkViewer items={items} className="h-full" />
        </div>

        <div className="hidden w-px shrink-0 bg-[#e4e6f7] lg:block" />

        <div className="flex min-h-[240px] min-w-0 flex-1 flex-col border-t border-[#e4e6f7] p-6 lg:min-h-0 lg:border-t-0">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="min-h-0 flex-1 resize-none bg-transparent text-base leading-6 outline-none"
            aria-label="Распознанный текст работы ученика"
          />
        </div>
      </div>
    </div>
  );
}
