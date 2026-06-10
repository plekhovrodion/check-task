"use client";

import {
  getUploadRejectedMessages,
  type UploadValidationError,
} from "@/lib/upload";

interface UploadRejectedFilesProps {
  errors: UploadValidationError[];
}

export function UploadRejectedFiles({ errors }: UploadRejectedFilesProps) {
  const messages = getUploadRejectedMessages(errors);

  if (messages.length === 0) return null;

  return (
    <div className="space-y-1 text-sm text-destructive" role="alert">
      {messages.map((message) => (
        <p key={message}>{message}</p>
      ))}
    </div>
  );
}
