"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { INITIAL_ASSIGNMENTS, SAMPLE_REVIEW } from "./mock-data";
import { getMaxScore } from "./criteria";
import { calcScoredTotal } from "./review-utils";
import { getUploadedPageImages } from "./work-images";
import {
  nextAssignmentId,
  nextWorkId,
  normalizeAssignmentsForStaticExport,
} from "./static-paths";
import { loadStoreCache, saveStoreCache } from "./store-cache";
import type {
  Assignment,
  AssignmentFormData,
  ReviewResult,
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
  updateReview: (
    assignmentId: string,
    workId: string,
    review: ReviewResult
  ) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function getInitialStoreState() {
  const cached = loadStoreCache();
  const assignments = normalizeAssignmentsForStaticExport(
    cached?.assignments ?? INITIAL_ASSIGNMENTS
  );

  return {
    assignments,
    showEmptyState: cached?.showEmptyState ?? false,
  };
}

function StoreProviderClient({ children }: { children: ReactNode }) {
  const [{ assignments, showEmptyState }, setStoreState] = useState(
    getInitialStoreState
  );

  const setAssignments = useCallback(
    (value: Assignment[] | ((prev: Assignment[]) => Assignment[])) => {
      setStoreState((prev) => ({
        ...prev,
        assignments:
          typeof value === "function" ? value(prev.assignments) : value,
      }));
    },
    []
  );

  const setShowEmptyState = useCallback((value: boolean) => {
    setStoreState((prev) => ({ ...prev, showEmptyState: value }));
  }, []);

  useEffect(() => {
    saveStoreCache({ assignments, showEmptyState });
  }, [assignments, showEmptyState]);

  const getAssignment = useCallback(
    (id: string) => assignments.find((a) => a.id === id),
    [assignments]
  );

  const createAssignment = useCallback(
    (data: AssignmentFormData) => {
      const assignment: Assignment = {
        id: nextAssignmentId(assignments),
        ...data,
        works: [],
        createdAt: new Date().toISOString(),
      };
      setAssignments((prev) => [assignment, ...prev]);
      return assignment;
    },
    [assignments, setAssignments]
  );

  const updateAssignment = useCallback(
    (id: string, data: Partial<Assignment>) => {
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data } : a))
      );
    },
    [setAssignments]
  );

  const deleteAssignment = useCallback((id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  }, [setAssignments]);

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
    [setAssignments]
  );

  const deleteWork = useCallback((assignmentId: string, workId: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? { ...a, works: a.works.filter((w) => w.id !== workId) }
          : a
      )
    );
  }, [setAssignments]);

  const addStudentToAssignment = useCallback(
    (assignmentId: string, name: string) => {
      setAssignments((prev) =>
        prev.map((a) => {
          if (a.id !== assignmentId) return a;

          const work: StudentWork = {
            id: nextWorkId(a.works),
            studentName: name,
            status: "pending",
          };

          return { ...a, works: [...a.works, work] };
        })
      );
    },
    [setAssignments]
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
                id: nextWorkId(works),
                studentName: upload.studentName,
                ...workData,
              });
            }
          }

          return { ...a, works };
        })
      );
    },
    [setAssignments]
  );

  const startProcessing = useCallback(
    (assignmentId: string, workId: string) => {
      updateWork(assignmentId, workId, { status: "processing" as WorkStatus });
    },
    [updateWork]
  );

  const completeProcessing = useCallback(
    (assignmentId: string, workId: string) => {
      setAssignments((prev) =>
        prev.map((assignment) => {
          if (assignment.id !== assignmentId) return assignment;

          const maxScore = getMaxScore(assignment.subject, assignment.workType);

          return {
            ...assignment,
            works: assignment.works.map((work) => {
              if (work.id !== workId) return work;

              const pageImages = getUploadedPageImages(work);
              const review = {
                ...SAMPLE_REVIEW,
                maxScore,
                pageImages:
                  pageImages.length > 0 ? pageImages : SAMPLE_REVIEW.pageImages,
              };

              return {
                ...work,
                status: "checked" as WorkStatus,
                score: review.totalScore,
                maxScore,
                review,
              };
            }),
          };
        })
      );
    },
    [setAssignments]
  );

  const updateReview = useCallback(
    (assignmentId: string, workId: string, review: ReviewResult) => {
      const totalScore = calcScoredTotal(review.criteria);
      const nextReview = { ...review, totalScore };

      updateWork(assignmentId, workId, {
        review: nextReview,
        score: totalScore,
      });
    },
    [updateWork]
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
      updateReview,
    }),
    [
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
      updateReview,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!isClient) {
    return (
      <StoreContext.Provider
        value={{
          assignments: INITIAL_ASSIGNMENTS,
          showEmptyState: false,
          setShowEmptyState: () => {},
          getAssignment: () => undefined,
          createAssignment: () => INITIAL_ASSIGNMENTS[0],
          updateAssignment: () => {},
          deleteAssignment: () => {},
          getWork: () => undefined,
          updateWork: () => {},
          deleteWork: () => {},
          addStudentToAssignment: () => {},
          submitWorksForCheck: () => {},
          startProcessing: () => {},
          completeProcessing: () => {},
          updateReview: () => {},
        }}
      >
        {children}
      </StoreContext.Provider>
    );
  }

  return <StoreProviderClient>{children}</StoreProviderClient>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
