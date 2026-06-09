"use client";

import { cn } from "@/lib/utils";

interface PdfViewerProps {
  url: string;
  title?: string;
  className?: string;
}

export function PdfViewer({ url, title = "PDF-документ", className }: PdfViewerProps) {
  return (
    <iframe
      src={url}
      title={title}
      className={cn("size-full rounded-[20px] border-0 bg-white", className)}
    />
  );
}
