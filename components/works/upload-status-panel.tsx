import { Info } from "lucide-react";
import { CheckCircle2, CircleDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadProgressRing } from "@/components/works/upload-progress-ring";
import { cn } from "@/lib/utils";

interface StudentUploadStatus {
  id: string;
  name: string;
  fileCount: number;
  uploaded: boolean;
}

interface UploadStatusPanelProps {
  uploadedCount: number;
  totalCount: number;
  students: StudentUploadStatus[];
  onSelectStudent: (studentId: string) => void;
  onCheck: () => void;
  canCheck: boolean;
}

export function UploadStatusPanel({
  uploadedCount,
  totalCount,
  students,
  onSelectStudent,
  onCheck,
  canCheck,
}: UploadStatusPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[20px] bg-white p-2">
      <div className="flex shrink-0 items-center gap-2 p-3">
        <UploadProgressRing value={uploadedCount} total={totalCount} />
        <p className="text-base font-medium">
          {uploadedCount}/{totalCount} работ загружено
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {students.map((student) => (
          <button
            key={student.id}
            type="button"
            onClick={() => onSelectStudent(student.id)}
            className="flex w-full items-start gap-2 rounded-xl p-3 text-left transition-colors hover:bg-secondary"
          >
            {student.uploaded ? (
              <CheckCircle2 className="size-5 shrink-0 text-success" />
            ) : (
              <CircleDashed className="size-5 shrink-0 text-muted-foreground" />
            )}
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-base">
                {student.name.trim() || "Имя ученика"}
              </span>
              <span className="text-sm text-muted-foreground">
                {student.uploaded
                  ? `${student.fileCount} файлов`
                  : "Файлы не загружены"}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex shrink-0 flex-col gap-3 p-3">
        <Button
          aria-disabled={!canCheck}
          className={cn(
            "w-full",
            !canCheck &&
              "cursor-not-allowed bg-secondary text-[#9399bd] hover:bg-secondary"
          )}
          onClick={onCheck}
        >
          Проверить работы
        </Button>
        <div className="flex items-center justify-center gap-1">
          <Info className="size-5 shrink-0 text-foreground" />
          <span className="text-sm">Спишем 5 ИИ-генераций</span>
        </div>
      </div>
    </div>
  );
}
