import Image from "next/image";
import { type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface AppEmptyStateProps {
  imageSrc: string;
  imageWidth?: number;
  imageHeight?: number;
  title: string;
  description: string;
  action?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function AppEmptyState({
  imageSrc,
  imageWidth = 400,
  imageHeight = 280,
  title,
  description,
  action,
  actionLabel,
  actionHref,
  className,
}: AppEmptyStateProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="image">
          <Image
            src={imageSrc}
            alt=""
            width={imageWidth}
            height={imageHeight}
            className="h-[280px] w-[400px] object-contain"
            aria-hidden
          />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {(action || (actionLabel && actionHref)) && (
        <EmptyContent>
          {action ?? <ButtonLink href={actionHref!}>{actionLabel}</ButtonLink>}
        </EmptyContent>
      )}
    </Empty>
  );
}
