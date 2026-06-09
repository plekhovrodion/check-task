import { UploadContent } from "./upload-content";
import { getAssignmentStaticParams } from "@/lib/static-paths";

export function generateStaticParams() {
  return getAssignmentStaticParams();
}

export default function UploadPage() {
  return <UploadContent />;
}
