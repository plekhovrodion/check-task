import Image from "next/image";
import { cn } from "@/lib/utils";

export const NAV_ICONS = {
  main: "/icons/nav/ic_stroke_main.svg",
  ai: "/icons/nav/button-icon.svg",
  materials: "/icons/nav/ic_stroke_materials.svg",
  plus: "/icons/nav/ic_stroke_plus.svg",
  calendar: "/icons/nav/ic_stroke_calendar.svg",
  calendarToggle: "/icons/nav/calendar-icon.svg",
  smile: "/icons/nav/ic_stroke_smile.svg",
  quiz: "/icons/nav/ic_stroke_quiz.svg",
  arrowUpRight: "/icons/nav/ic_stroke_arrow_up_right.svg",
  analysisVoice: "/icons/nav/ic_stroke_analysis_voice.svg",
  statistics: "/icons/nav/ic_stroke_statistics.svg",
  penBrand: "/icons/nav/ic_stroke_pen_brand.svg",
  pen: "/icons/nav/ic_stroke_pen.svg",
  ratings: "/icons/nav/ic_stroke_question_ratings.svg",
  performance: "/icons/nav/ic_stroke_performance.svg",
  search: "/icons/nav/ic_stroke_magnifying_glass.svg",
  trash: "/icons/nav/ic_stroke_trash_bin.svg",
  cross: "/icons/nav/ic_stroke_cross.svg",
} as const;

export type NavIconName = keyof typeof NAV_ICONS;

export function NavIcon({
  name,
  className,
  destructive,
}: {
  name: NavIconName;
  className?: string;
  destructive?: boolean;
}) {
  return (
    <Image
      src={NAV_ICONS[name]}
      alt=""
      width={20}
      height={20}
      className={cn(
        "size-5 shrink-0",
        destructive &&
          "[filter:brightness(0)_saturate(100%)_invert(27%)_sepia(95%)_saturate(5000%)_hue-rotate(340deg)]",
        className
      )}
      aria-hidden
    />
  );
}
