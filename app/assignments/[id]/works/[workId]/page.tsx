import { WorkProcessingContent } from "./work-processing-content";
import { getWorkStaticParams } from "@/lib/static-paths";

export function generateStaticParams() {
  return getWorkStaticParams();
}

export default function WorkProcessingPage() {
  return <WorkProcessingContent />;
}
