"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { assetPath } from "@/lib/asset-path";

interface AssignmentsSearchEmptyProps {
  query: string;
  onReset: () => void;
}

export function AssignmentsSearchEmpty({
  query,
  onReset,
}: AssignmentsSearchEmptyProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <div className="flex flex-col items-center">
        <Image
          src={assetPath("/images/calendar-inactive.png")}
          alt=""
          width={80}
          height={80}
          className="size-20"
          aria-hidden
        />
        <p className="mt-0 text-center text-lg font-medium tracking-[-0.1px] text-foreground">
          По запросу «{query}» ничего не нашли
        </p>
      </div>
      <Button variant="secondary" onClick={onReset}>
        Сбросить поиск
      </Button>
    </div>
  );
}
