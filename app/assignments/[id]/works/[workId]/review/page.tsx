import { WorkReviewContent } from "./work-review-content";
import { getWorkStaticParams } from "@/lib/static-paths";

export function generateStaticParams() {
  return getWorkStaticParams();
}

export default function WorkReviewPage() {
  return <WorkReviewContent />;
}
