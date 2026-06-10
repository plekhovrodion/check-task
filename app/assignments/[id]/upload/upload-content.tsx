"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { PageHeader } from "@/components/layout/page-header";
import {
  UploadStudentCard,
  type UploadFile,
} from "@/components/works/upload-student-card";
import { StudentListsDialog } from "@/components/works/student-lists-dialog";
import { UploadStatusPanel } from "@/components/works/upload-status-panel";
import { useStore } from "@/lib/store";

interface StudentUpload {
  id: string;
  name: string;
  files: UploadFile[];
  canRemove: boolean;
}

const ADD_STUDENT_SHORTCUT_KEY = "Enter";

function AddStudentShortcutHint() {
  const isMac =
    typeof navigator !== "undefined" && /Mac/i.test(navigator.platform);

  return (
    <KbdGroup className="ml-1">
      {isMac ? <Kbd>⌘</Kbd> : <Kbd>Ctrl</Kbd>}
      <Kbd>↵</Kbd>
    </KbdGroup>
  );
}

const DEFAULT_STUDENT: StudentUpload = {
  id: "upload-0",
  name: "",
  files: [],
  canRemove: false,
};

export function UploadContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getAssignment, submitWorksForCheck } = useStore();
  const assignment = getAssignment(id);

  const [students, setStudents] = useState<StudentUpload[]>([DEFAULT_STUDENT]);
  const [activeStudentId, setActiveStudentId] = useState<string | null>(
    DEFAULT_STUDENT.id
  );
  const [invalidNameIds, setInvalidNameIds] = useState<Set<string>>(
    () => new Set()
  );
  const [listsDialogOpen, setListsDialogOpen] = useState(false);
  const studentRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

  const handleAddStudent = useCallback(() => {
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
  }, [scrollToStudent]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (listsDialogOpen) return;
      if (event.key !== ADD_STUDENT_SHORTCUT_KEY) return;
      if (!(event.metaKey || event.ctrlKey)) return;

      event.preventDefault();
      handleAddStudent();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAddStudent, listsDialogOpen]);

  const handleRemoveStudent = (studentId: string) => {
    setStudents((prev) => {
      const next = prev.filter((s) => s.id !== studentId);
      if (activeStudentId === studentId) {
        setActiveStudentId(next[0]?.id ?? null);
      }
      return next;
    });
  };

  const handleAddStudentsFromLists = useCallback(
    (names: string[]) => {
      if (names.length === 0) return;

      let firstFilledId: string | null = null;
      const timestamp = Date.now();

      setStudents((prev) => {
        const next = prev.map((student) => ({ ...student }));
        let nameIndex = 0;

        for (let index = 0; index < next.length && nameIndex < names.length; index++) {
          if (!next[index].name.trim()) {
            if (!firstFilledId) {
              firstFilledId = next[index].id;
            }
            next[index] = {
              ...next[index],
              name: names[nameIndex],
            };
            nameIndex += 1;
          }
        }

        while (nameIndex < names.length) {
          const newId = `upload-${timestamp}-${nameIndex}`;
          if (!firstFilledId) {
            firstFilledId = newId;
          }
          next.push({
            id: newId,
            name: names[nameIndex],
            files: [],
            canRemove: true,
          });
          nameIndex += 1;
        }

        return next;
      });

      if (firstFilledId) {
        setActiveStudentId(firstFilledId);
        requestAnimationFrame(() => {
          scrollToStudent(firstFilledId!);
        });
      }
    },
    [scrollToStudent]
  );

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

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <PageHeader
        breadcrumbs={[
          { label: "ИИ-проверка заданий", href: "/assignments" },
          { label: assignment.title, href: `/assignments/${id}` },
          { label: "Загрузка работ учеников" },
        ]}
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[20px] bg-white">
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
              <AddStudentShortcutHint />
            </Button>
            <Button
              variant="secondary"
              onClick={() => setListsDialogOpen(true)}
            >
              Из списка
            </Button>
          </div>
        </div>

        <StudentListsDialog
          open={listsDialogOpen}
          onOpenChange={setListsDialogOpen}
          onAddStudents={handleAddStudentsFromLists}
        />

        <UploadStatusPanel
          uploadedCount={uploadedCount}
          totalCount={students.length}
          students={statusStudents}
          onSelectStudent={scrollToStudent}
          onCheck={handleCheck}
          canCheck={canCheck}
        />
      </div>
    </div>
  );
}
