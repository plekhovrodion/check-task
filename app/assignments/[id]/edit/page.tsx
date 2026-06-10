import { AssignmentForm } from "@/components/assignments/assignment-form";
import { getAssignmentStaticParams } from "@/lib/static-paths";

export function generateStaticParams() {
  return getAssignmentStaticParams();
}

interface EditAssignmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAssignmentPage({
  params,
}: EditAssignmentPageProps) {
  const { id } = await params;
  return <AssignmentForm assignmentId={id} />;
}
