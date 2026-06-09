"use client";

import { cn } from "@/lib/utils";
import type { WorkMediaItem } from "@/lib/work-files";
import { PdfPreviewThumb } from "@/components/works/pdf-preview-thumb";

interface WorkMediaThumbProps {
  item: WorkMediaItem;
  index: number;
  size?: "sm" | "md";
  active?: boolean;
  className?: string;
}

export function WorkMediaThumb({
  item,
  index,
  size = "md",
  active = false,
  className,
}: WorkMediaThumbProps) {
  const sizeClass = size === "sm" ? "size-10" : "size-24";

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg border",
        sizeClass,
        active ? "border-2 border-primary" : "border-[#e4e6f7]",
        className
      )}
    >
      {item.type === "pdf" ? (
        <PdfPreviewThumb
          url={item.url}
          iconClassName={size === "sm" ? "size-4" : "size-8"}
        />
      ) : (
        <img
          src={item.url}
          alt={item.name ?? `Страница ${index + 1}`}
          className="size-full object-cover"
        />
      )}
      {size === "md" && (
        <span className="absolute bottom-[3px] left-[3px] flex min-w-5 items-center justify-center rounded-full bg-[rgba(22,26,51,0.6)] px-1 text-sm font-medium text-white backdrop-blur-[2px]">
          {index + 1}
        </span>
      )}
    </div>
  );
}
