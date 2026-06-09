import { CheckCircle2, CircleDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudentUploadStatus {
  id: string;
  name: string;
  fileCount: number;
  uploaded: boolean;
}

interface UploadStatusPanelProps {
  students: StudentUploadStatus[];
  onSelectStudent: (studentId: string) => void;
  onCheck: () => void;
  canCheck: boolean;
}

export function UploadStatusPanel({
  students,
  onSelectStudent,
  onCheck,
  canCheck,
}: UploadStatusPanelProps) {
  return (
    <div className="sticky top-0 flex max-h-[600px] w-[320px] shrink-0 flex-col self-start overflow-hidden rounded-[20px] bg-white p-2">
      <div className="min-h-0 flex-1 overflow-auto">
        {students.map((student) => (
          <button
            key={student.id}
            type="button"
            onClick={() => onSelectStudent(student.id)}
            className="flex h-[68px] w-full items-start gap-2 rounded-xl p-3 text-left transition-colors hover:bg-secondary"
          >
            {student.uploaded ? (
              <CheckCircle2 className="size-5 shrink-0 text-success" />
            ) : (
              <CircleDashed className="size-5 shrink-0 text-muted-foreground" />
            )}
            <div className="flex min-w-0 flex-1 flex-col">
              <span
                className={cn(
                  "truncate text-base",
                  !student.name.trim() && "text-muted-foreground"
                )}
              >
                {student.name.trim() || "Введите ученика"}
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

      <div className="shrink-0 p-3">
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
      </div>
    </div>
  );
}
