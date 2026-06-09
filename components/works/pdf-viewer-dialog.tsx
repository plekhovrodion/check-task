"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PdfViewer } from "@/components/works/pdf-viewer";

interface PdfViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  fileName: string;
}

export function PdfViewerDialog({
  open,
  onOpenChange,
  url,
  fileName,
}: PdfViewerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[min(90vh,800px)] max-w-[min(90vw,900px)] gap-0 p-0">
        <DialogHeader className="border-b border-[#e4e6f7] p-6 pb-4">
          <DialogTitle className="truncate">{fileName}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 p-6 pt-4">
          <PdfViewer url={url} title={fileName} className="min-h-[60vh]" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
