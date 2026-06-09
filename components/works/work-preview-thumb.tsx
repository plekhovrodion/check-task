import { cn } from "@/lib/utils";

interface WorkPreviewThumbProps {
  src?: string;
  className?: string;
}

export function WorkPreviewThumb({ src, className }: WorkPreviewThumbProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "size-10 shrink-0 rounded-lg bg-secondary",
          className
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn(
        "size-10 shrink-0 overflow-hidden rounded-lg border border-[#e4e6f7]",
        className
      )}
    >
      <img src={src} alt="" className="size-full object-cover" />
    </div>
  );
}
