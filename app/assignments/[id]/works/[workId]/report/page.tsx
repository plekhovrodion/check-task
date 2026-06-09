import { StudentReportContent } from "./student-report-content";
import { getWorkStaticParams } from "@/lib/static-paths";

export function generateStaticParams() {
  return getWorkStaticParams();
}

export default function StudentReportPage() {
  return <StudentReportContent />;
}
