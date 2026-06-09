import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { cn } from "@/lib/utils";

export const NAV_ICONS = {
  main: assetPath("/icons/nav/ic_stroke_main.svg"),
  ai: assetPath("/icons/nav/button-icon.svg"),
  materials: assetPath("/icons/nav/ic_stroke_materials.svg"),
  plus: assetPath("/icons/nav/ic_stroke_plus.svg"),
  calendar: assetPath("/icons/nav/ic_stroke_calendar.svg"),
  calendarToggle: assetPath("/icons/nav/calendar-icon.svg"),
  smile: assetPath("/icons/nav/ic_stroke_smile.svg"),
  quiz: assetPath("/icons/nav/ic_stroke_quiz.svg"),
  arrowUpRight: assetPath("/icons/nav/ic_stroke_arrow_up_right.svg"),
  analysisVoice: assetPath("/icons/nav/ic_stroke_analysis_voice.svg"),
  statistics: assetPath("/icons/nav/ic_stroke_statistics.svg"),
  penBrand: assetPath("/icons/nav/ic_stroke_pen_brand.svg"),
  pen: assetPath("/icons/nav/ic_stroke_pen.svg"),
  ratings: assetPath("/icons/nav/ic_stroke_question_ratings.svg"),
  performance: assetPath("/icons/nav/ic_stroke_performance.svg"),
  search: assetPath("/icons/nav/ic_stroke_magnifying_glass.svg"),
  trash: assetPath("/icons/nav/ic_stroke_trash_bin.svg"),
  cross: assetPath("/icons/nav/ic_stroke_cross.svg"),
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
