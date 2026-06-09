import type { Criterion, Subject, WorkType } from "./types";

const EGE_CRITERIA: Criterion[] = [
  { id: "k0", code: "K0", title: "Объём работы", maxScore: 0 },
  { id: "k1", code: "K1", title: "Отражение позиции автора", maxScore: 1 },
  { id: "k2", code: "K2", title: "Комментарий к позиции автора", maxScore: 3 },
  { id: "k3", code: "K3", title: "Собственное отношение к позиции автора", maxScore: 2 },
  { id: "k4", code: "K4", title: "Фактическая точность", maxScore: 1 },
  { id: "k5", code: "K5", title: "Логичность", maxScore: 2 },
  { id: "k6", code: "K6", title: "Соблюдение этических норм", maxScore: 1 },
  { id: "k7", code: "K7", title: "Орфография", maxScore: 3 },
  { id: "k8", code: "K8", title: "Пунктуация", maxScore: 3 },
  { id: "k9", code: "K9", title: "Грамматика", maxScore: 3 },
  { id: "k10", code: "K10", title: "Речевые нормы", maxScore: 3 },
];

const OGE_CRITERIA: Criterion[] = [
  { id: "k1", code: "K1", title: "Содержание текста", maxScore: 3 },
  { id: "k2", code: "K2", title: "Речевое оформление", maxScore: 3 },
  { id: "k3", code: "K3", title: "Грамотность", maxScore: 2 },
];

export function getCriteria(subject: Subject, workType: WorkType): Criterion[] {
  if (workType === "oge") return OGE_CRITERIA;
  if (workType === "ege" || workType === "final-essay") return EGE_CRITERIA;
  return EGE_CRITERIA.slice(0, 8);
}

export function getMaxScore(subject: Subject, workType: WorkType): number {
  const criteria = getCriteria(subject, workType);
  return criteria.reduce((sum, c) => sum + c.maxScore, 0);
}

export function getCriteriaSummary(
  subject: Subject,
  workType: WorkType
): string {
  const criteria = getCriteria(subject, workType);
  const maxScore = getMaxScore(subject, workType);
  return `${criteria.length} критериев · ${maxScore} баллов`;
}
