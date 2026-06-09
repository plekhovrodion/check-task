import Image from "next/image";
import { AlertCircle, Loader2 } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import type { WorkStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  WorkStatus,
  { label: string; icon: React.ReactNode | null }
> = {
  checked: {
    label: "Проверено",
    icon: (
      <Image
        src={assetPath("/icons/success.svg")}
        alt=""
        width={20}
        height={20}
        className="size-5 shrink-0"
        aria-hidden
      />
    ),
  },
  processing: {
    label: "Проверяется",
    icon: <Loader2 className="size-5 shrink-0 animate-spin text-primary" />,
  },
  error: {
    label: "",
    icon: <AlertCircle className="size-5 shrink-0 text-destructive" />,
  },
  pending: {
    label: "Ожидает",
    icon: null,
  },
};

interface WorkStatusBadgeProps {
  status: WorkStatus;
  errorMessage?: string;
}

export function WorkStatusBadge({ status, errorMessage }: WorkStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex min-w-0 items-center gap-1.5 text-base text-foreground">
      {config.icon}
      <span className="truncate">
        {status === "error" ? errorMessage : config.label}
      </span>
    </div>
  );
}
