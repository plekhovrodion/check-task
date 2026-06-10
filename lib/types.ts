export type Subject = "russian" | "literature";
export type WorkType = "ege" | "oge" | "final-essay" | "essay";
export type WorkStatus =
  | "pending"
  | "processing"
  | "checked"
  | "error"
  | "cancelled";

export interface Criterion {
  id: string;
  code: string;
  title: string;
  maxScore: number;
  description?: string;
}

export interface TextRange {
  start: number;
  end: number;
}

export interface CriterionResult {
  criterionId: string;
  score: number;
  maxScore: number;
  description: string;
  errors?: string[];
  textRanges?: TextRange[];
}

export interface ReviewResult {
  feedback: string;
  totalScore: number;
  maxScore: number;
  criteria: CriterionResult[];
  recognizedText: string;
  pageImages: string[];
}

export interface StudentWork {
  id: string;
  studentName: string;
  status: WorkStatus;
  score?: number;
  maxScore?: number;
  errorMessage?: string;
  uploadedFiles?: { id: string; url: string; name: string }[];
  review?: ReviewResult;
}

export interface Assignment {
  id: string;
  title: string;
  subject: Subject;
  workType: WorkType;
  grade: string;
  taskText?: string;
  works: StudentWork[];
  createdAt: string;
}

export interface AssignmentFormData {
  title: string;
  subject: Subject;
  workType: WorkType;
  grade: string;
  taskText?: string;
}

export const SUBJECT_LABELS: Record<Subject, string> = {
  russian: "Русский язык",
  literature: "Литература",
};

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  ege: "ЕГЭ",
  oge: "ОГЭ",
  "final-essay": "Итоговое сочинение",
  essay: "Сочинение",
};

export const PROCESSING_STEPS = [
  "Загружаем",
  "Проверяем на вирусы",
  "Меняем формат",
  "Распознаём рукописный текст",
  "Проверяем по критериям",
  "Формируем обратную связь",
  "Завершаем проверку",
] as const;
