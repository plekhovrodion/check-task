"use client";

import { buildPdfEmbedUrl, type PdfEmbedOptions } from "@/lib/pdf-url";
import { cn } from "@/lib/utils";

interface PdfViewerProps extends PdfEmbedOptions {
  url: string;
  title?: string;
  className?: string;
}

export function PdfViewer({
  url,
  title = "PDF-документ",
  className,
  page,
  hideToolbar = true,
  hideNavpanes = true,
  hideScrollbar = false,
  view = "FitH",
  zoom,
}: PdfViewerProps) {
  const embedUrl = buildPdfEmbedUrl(url, {
    page,
    hideToolbar,
    hideNavpanes,
    hideScrollbar,
    view,
    zoom,
  });

  return (
    <iframe
      src={embedUrl}
      title={title}
      className={cn("size-full rounded-[20px] border-0 bg-white", className)}
    />
  );
}
