import { AssignmentDetailContent } from "./assignment-detail-content";
import { getAssignmentStaticParams } from "@/lib/static-paths";

export function generateStaticParams() {
  return getAssignmentStaticParams();
}

export default function AssignmentDetailPage() {
  return <AssignmentDetailContent />;
}
