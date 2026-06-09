import type { ReactNode } from "react";
import type { TextRange } from "@/lib/types";

interface HighlightedTextProps {
  text: string;
  ranges: TextRange[];
  active: boolean;
}

export function HighlightedText({ text, ranges, active }: HighlightedTextProps) {
  if (!active || ranges.length === 0) {
    return <>{text}</>;
  }

  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const range of sorted) {
    if (range.start > cursor) {
      parts.push(text.slice(cursor, range.start));
    }

    parts.push(
      <mark
        key={`${range.start}-${range.end}`}
        className="rounded-sm bg-[rgba(80,58,224,0.18)] text-inherit"
      >
        {text.slice(range.start, range.end)}
      </mark>
    );

    cursor = Math.max(cursor, range.end);
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return <>{parts}</>;
}
