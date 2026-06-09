"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { UploadProgressRing } from "@/components/works/upload-progress-ring";
import {
  UploadStudentCard,
  type UploadFile,
} from "@/components/works/upload-student-card";
import { UploadStatusPanel } from "@/components/works/upload-status-panel";
import { isUploadReorderHintDismissed } from "@/components/works/upload-reorder-hint";
import { useStore } from "@/lib/store";

interface StudentUpload {
  id: string;
  name: string;
  files: UploadFile[];
  canRemove: boolean;
}

const DEFAULT_STUDENT: StudentUpload = {
  id: "upload-0",
  name: "",
  files: [],
  canRemove: false,
};

export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getAssignment, submitWorksForCheck } = useStore();
  const assignment = getAssignment(id);

  const [students, setStudents] = useState<StudentUpload[]>([DEFAULT_STUDENT]);
  const [activeStudentId, setActiveStudentId] = useState<string | null>(
    DEFAULT_STUDENT.id
  );
  const [showReorderHint, setShowReorderHint] = useState(false);
  const [hintChecked, setHintChecked] = useState(false);
  const [invalidNameIds, setInvalidNameIds] = useState<Set<string>>(
    () => new Set()
  );
  const studentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setHintChecked(true);
  }, []);

  const uploadedCount = students.filter((s) => s.files.length > 0).length;
  const allFilesUploaded =
    uploadedCount === students.length && students.length > 0;
  const allNamesFilled = students.every((s) => s.name.trim().length > 0);
  const canCheck = allFilesUploaded && allNamesFilled;

  const statusStudents = useMemo(
    () =>
      students.map((s) => ({
        id: s.id,
        name: s.name,
        fileCount: s.files.length,
        uploaded: s.files.length > 0,
      })),
    [students]
  );

  const scrollToStudent = useCallback((studentId: string) => {
    setActiveStudentId(studentId);
    studentRefs.current[studentId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const updateStudentFiles = useCallback(
    (studentId: string, files: UploadFile[]) => {
      setStudents((prev) => {
        const next = prev.map((s) =>
          s.id === studentId ? { ...s, files } : s
        );
        const student = next.find((s) => s.id === studentId);
        if (
          student &&
          files.length > 0 &&
          prev.find((s) => s.id === studentId)?.files.length === 0 &&
          !isUploadReorderHintDismissed()
        ) {
          setShowReorderHint(true);
        }
        return next;
      });
    },
    []
  );

  const updateStudentName = useCallback((studentId: string, name: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, name } : s))
    );
    if (name.trim()) {
      setInvalidNameIds((prev) => {
        if (!prev.has(studentId)) return prev;
        const next = new Set(prev);
        next.delete(studentId);
        return next;
      });
    }
  }, []);

  const handleAddStudent = () => {
    const newId = `upload-${Date.now()}`;

    setStudents((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        files: [],
        canRemove: true,
      },
    ]);
    setActiveStudentId(newId);

    requestAnimationFrame(() => {
      scrollToStudent(newId);
    });
  };

  const handleRemoveStudent = (studentId: string) => {
    setStudents((prev) => {
      const next = prev.filter((s) => s.id !== studentId);
      if (activeStudentId === studentId) {
        setActiveStudentId(next[0]?.id ?? null);
      }
      return next;
    });
  };

  const handleCheck = () => {
    if (!assignment) return;

    const studentsWithEmptyNames = students.filter((s) => !s.name.trim());
    if (studentsWithEmptyNames.length > 0) {
      setInvalidNameIds(new Set(studentsWithEmptyNames.map((s) => s.id)));
      scrollToStudent(studentsWithEmptyNames[0].id);
      return;
    }

    if (!allFilesUploaded) return;

    submitWorksForCheck(
      id,
      students
        .filter((student) => student.files.length > 0)
        .map((student) => ({
          studentName: student.name.trim(),
          files: student.files.map((f) => ({
            id: f.id,
            url: f.url,
            name: f.name,
          })),
        }))
    );

    router.push(`/assignments/${id}`);
  };

  if (!assignment) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Задание не найдено
      </div>
    );
  }

  const shouldShowHint =
    hintChecked && showReorderHint && !isUploadReorderHintDismissed();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "ИИ-проверка заданий", href: "/assignments" },
          { label: assignment.title, href: `/assignments/${id}` },
          { label: "Загрузка работ учеников" },
        ]}
        title="Загрузка работ учеников"
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[20px] bg-white">
          <div className="sticky top-0 z-10 flex shrink-0 items-center gap-4 border-b border-[#e4e6f7] bg-white p-6">
            <UploadProgressRing value={uploadedCount} total={students.length} />
            <p className="flex-1 text-xl font-medium tracking-[-0.2px]">
              {uploadedCount}/{students.length} работ учеников загружено
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            {students.map((student, index) => (
              <div
                key={student.id}
                ref={(el) => {
                  studentRefs.current[student.id] = el;
                }}
                className={
                  activeStudentId === student.id
                    ? "ring-2 ring-inset ring-primary/20"
                    : undefined
                }
              >
                <UploadStudentCard
                  studentName={student.name}
                  files={student.files}
                  nameInvalid={invalidNameIds.has(student.id)}
                  onFilesChange={(files) =>
                    updateStudentFiles(student.id, files)
                  }
                  onNameChange={(name) => updateStudentName(student.id, name)}
                  canRemoveStudent={student.canRemove}
                  onRemoveStudent={
                    student.canRemove
                      ? () => handleRemoveStudent(student.id)
                      : undefined
                  }
                  showReorderHint={index === 0 && shouldShowHint}
                  onCloseReorderHint={() => setShowReorderHint(false)}
                />
              </div>
            ))}
          </div>

          <div className="flex shrink-0 gap-2 border-t border-[#e4e6f7] px-6 py-4">
            <Button
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/15"
              onClick={handleAddStudent}
            >
              <Plus />
              Добавить ученика
            </Button>
            <Button variant="secondary">Из списка</Button>
          </div>
        </div>

        <UploadStatusPanel
          students={statusStudents}
          onSelectStudent={scrollToStudent}
          onCheck={handleCheck}
          canCheck={canCheck}
        />
      </div>
    </div>
  );
}
