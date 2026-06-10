"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { buildPdfEmbedUrl } from "@/lib/pdf-url";
import { cn } from "@/lib/utils";

interface PdfPreviewThumbProps {
  url: string;
  className?: string;
  iconClassName?: string;
}

export function PdfPreviewThumb({
  url,
  className,
  iconClassName,
}: PdfPreviewThumbProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex size-full flex-col items-center justify-center gap-1 bg-secondary text-muted-foreground",
          className
        )}
      >
        <FileText className={cn("size-8", iconClassName)} />
        <span className="max-w-full truncate px-1 text-xs">PDF</span>
      </div>
    );
  }

  return (
    <div className={cn("relative size-full overflow-hidden bg-white", className)}>
      <iframe
        src={buildPdfEmbedUrl(url, { page: 1, hideScrollbar: true })}
        title="Превью PDF"
        className="pointer-events-none absolute top-0 left-0 h-[400%] w-[400%] max-w-none origin-top-left scale-[0.25] border-0"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
