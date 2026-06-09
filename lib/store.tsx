"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SAMPLE_REVIEW } from "./mock-data";
import { getMaxScore } from "./criteria";
import { loadStoreCache, saveStoreCache } from "./store-cache";
import type {
  Assignment,
  AssignmentFormData,
  StudentWork,
  WorkStatus,
} from "./types";

interface StoreContextValue {
  assignments: Assignment[];
  showEmptyState: boolean;
  setShowEmptyState: (value: boolean) => void;
  getAssignment: (id: string) => Assignment | undefined;
  createAssignment: (data: AssignmentFormData) => Assignment;
  updateAssignment: (id: string, data: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  getWork: (assignmentId: string, workId: string) => StudentWork | undefined;
  updateWork: (
    assignmentId: string,
    workId: string,
    data: Partial<StudentWork>
  ) => void;
  deleteWork: (assignmentId: string, workId: string) => void;
  addStudentToAssignment: (assignmentId: string, name: string) => void;
  submitWorksForCheck: (
    assignmentId: string,
    uploads: Array<{
      studentName: string;
      files: { id: string; url: string; name: string }[];
    }>
  ) => void;
  startProcessing: (assignmentId: string, workId: string) => void;
  completeProcessing: (assignmentId: string, workId: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const cached = loadStoreCache();
    if (cached) {
      setAssignments(cached.assignments);
      setShowEmptyState(cached.showEmptyState);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveStoreCache({ assignments, showEmptyState });
  }, [assignments, showEmptyState, hydrated]);

  const getAssignment = useCallback(
    (id: string) => assignments.find((a) => a.id === id),
    [assignments]
  );

  const createAssignment = useCallback((data: AssignmentFormData) => {
    const assignment: Assignment = {
      id: generateId(),
      ...data,
      works: [],
      createdAt: new Date().toISOString(),
    };
    setAssignments((prev) => [assignment, ...prev]);
    return assignment;
  }, []);

  const updateAssignment = useCallback(
    (id: string, data: Partial<Assignment>) => {
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data } : a))
      );
    },
    []
  );

  const deleteAssignment = useCallback((id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const getWork = useCallback(
    (assignmentId: string, workId: string) => {
      const assignment = assignments.find((a) => a.id === assignmentId);
      return assignment?.works.find((w) => w.id === workId);
    },
    [assignments]
  );

  const updateWork = useCallback(
    (assignmentId: string, workId: string, data: Partial<StudentWork>) => {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId
            ? {
                ...a,
                works: a.works.map((w) =>
                  w.id === workId ? { ...w, ...data } : w
                ),
              }
            : a
        )
      );
    },
    []
  );

  const deleteWork = useCallback((assignmentId: string, workId: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? { ...a, works: a.works.filter((w) => w.id !== workId) }
          : a
      )
    );
  }, []);

  const addStudentToAssignment = useCallback(
    (assignmentId: string, name: string) => {
      const work: StudentWork = {
        id: generateId(),
        studentName: name,
        status: "pending",
      };
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId ? { ...a, works: [...a.works, work] } : a
        )
      );
      return work;
    },
    []
  );

  const submitWorksForCheck = useCallback(
    (
      assignmentId: string,
      uploads: Array<{
        studentName: string;
        files: { id: string; url: string; name: string }[];
      }>
    ) => {
      setAssignments((prev) =>
        prev.map((a) => {
          if (a.id !== assignmentId) return a;

          const works = [...a.works];
          for (const upload of uploads) {
            const existingIndex = works.findIndex(
              (w) => w.studentName === upload.studentName
            );
            const workData = {
              uploadedFiles: upload.files,
              status: "processing" as WorkStatus,
            };

            if (existingIndex >= 0) {
              works[existingIndex] = {
                ...works[existingIndex],
                ...workData,
              };
            } else {
              works.push({
                id: generateId(),
                studentName: upload.studentName,
                ...workData,
              });
            }
          }

          return { ...a, works };
        })
      );
    },
    []
  );

  const startProcessing = useCallback(
    (assignmentId: string, workId: string) => {
      updateWork(assignmentId, workId, { status: "processing" as WorkStatus });
    },
    [updateWork]
  );

  const completeProcessing = useCallback(
    (assignmentId: string, workId: string) => {
      const assignment = assignments.find((a) => a.id === assignmentId);
      const maxScore = assignment
        ? getMaxScore(assignment.subject, assignment.workType)
        : 22;
      updateWork(assignmentId, workId, {
        status: "checked",
        score: 18,
        maxScore,
        review: SAMPLE_REVIEW,
      });
    },
    [assignments, updateWork]
  );

  const value = useMemo(
    () => ({
      assignments,
      showEmptyState,
      setShowEmptyState,
      getAssignment,
      createAssignment,
      updateAssignment,
      deleteAssignment,
      getWork,
      updateWork,
      deleteWork,
      addStudentToAssignment,
      submitWorksForCheck,
      startProcessing,
      completeProcessing,
    }),
    [
      assignments,
      showEmptyState,
      getAssignment,
      createAssignment,
      updateAssignment,
      deleteAssignment,
      getWork,
      updateWork,
      deleteWork,
      addStudentToAssignment,
      submitWorksForCheck,
      startProcessing,
      completeProcessing,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
