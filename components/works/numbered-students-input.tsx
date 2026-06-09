"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface NumberedStudentsInputProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
}

export function NumberedStudentsInput({
  value,
  onChange,
  rows = 10,
  className,
}: NumberedStudentsInputProps) {
  const lineCount = useMemo(() => {
    const contentLines = value.split("\n").length;
    return Math.max(rows, contentLines);
  }, [rows, value]);

  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, index) => index + 1),
    [lineCount]
  );

  return (
    <div
      className={cn(
        "flex gap-2 rounded-[10px] bg-secondary px-4 py-3",
        className
      )}
    >
      <div
        className="flex shrink-0 flex-col text-base leading-6 text-muted-foreground select-none"
        aria-hidden
      >
        {lineNumbers.map((number) => (
          <span key={number} className="min-h-6">
            {number}.
          </span>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={lineCount}
        placeholder="Фамилия и имя"
        className="min-h-[240px] flex-1 resize-none border-none bg-transparent text-base leading-6 text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
