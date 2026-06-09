import type { Assignment, ReviewResult } from "./types";

export const SAMPLE_PAGE_IMAGES = [
  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=560&fit=crop",
  "https://images.unsplash.com/photo-1455390582260-0446de2cb77d?w=400&h=560&fit=crop",
  "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=560&fit=crop",
  "https://images.unsplash.com/photo-1456324504439-367cee3b3a32?w=400&h=560&fit=crop",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=560&fit=crop",
];

const SAMPLE_RECOGNIZED_TEXT = `В современном мире проблема взаимоотношений человека и природы становится всё более актуальной. Автор текста поднимает важный вопрос о том, как человек должен относиться к окружающей среде.

Позиция автора заключается в том, что человек несёт ответственность за сохранение природы для будущих поколений. Автор убеждён, что бездумное потребление ресурсов приведёт к необратимым последствиям.

Я согласен с позицией автора. Действительно, каждый из нас должен задуматься о своём вкладе в сохранение природы. Примеры из литературы подтверждают эту мысль: в повести «Муму» Тургенева показано, как человек может быть жесток к природе.

Таким образом, проблема взаимоотношений человека и природы требует нашего внимания и осознанного отношения к окружающему миру.`;

export const SAMPLE_REVIEW: ReviewResult = {
  feedback:
    "Сочинение написано на хорошем уровне. Ученик правильно определил проблему и позицию автора, привёл аргументы. Есть незначительные ошибки в пунктуации и грамматике, которые снизили итоговый балл.",
  totalScore: 18,
  maxScore: 22,
  recognizedText: SAMPLE_RECOGNIZED_TEXT,
  pageImages: SAMPLE_PAGE_IMAGES,
  criteria: [
    {
      criterionId: "k0",
      score: 235,
      maxScore: 0,
      description: "Объём работы соответствует требованиям",
    },
    {
      criterionId: "k1",
      score: 1,
      maxScore: 1,
      description: "Позиция автора отражена верно",
    },
    {
      criterionId: "k2",
      score: 2,
      maxScore: 3,
      description: "Комментарий дан, но не все аспекты раскрыты",
    },
    {
      criterionId: "k3",
      score: 2,
      maxScore: 2,
      description: "Собственное отношение выражено чётко",
    },
    {
      criterionId: "k4",
      score: 1,
      maxScore: 1,
      description: "Фактическая точность соблюдена",
    },
    {
      criterionId: "k5",
      score: 2,
      maxScore: 2,
      description: "Логика изложения выдержана",
    },
    {
      criterionId: "k6",
      score: 1,
      maxScore: 1,
      description: "Этические нормы соблюдены",
    },
    {
      criterionId: "k7",
      score: 3,
      maxScore: 3,
      description: "Орфографических ошибок нет",
    },
    {
      criterionId: "k8",
      score: 2,
      maxScore: 3,
      description: "Две пунктуационные ошибки",
      errors: ["Пропущена запятая перед «что»", "Лишняя запятая в сложном предложении"],
    },
    {
      criterionId: "k9",
      score: 2,
      maxScore: 3,
      description: "Одна грамматическая ошибка",
      errors: ["Нарушение согласования подлежащего и сказуемого"],
    },
    {
      criterionId: "k10",
      score: 2,
      maxScore: 3,
      description: "Одна речевая ошибка — тавтология",
      errors: ["Повтор: «важный вопрос о том, как»"],
    },
  ],
};

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "1",
    title: "Ухо граммар-наци: найди ошибку на слух",
    subject: "russian",
    workType: "oge",
    grade: "7-я параллель",
    createdAt: "2025-01-15",
    works: [],
  },
  {
    id: "2",
    title: "Новое задание",
    subject: "russian",
    workType: "ege",
    grade: "11-я параллель",
    createdAt: "2025-02-01",
    works: [
      {
        id: "w1",
        studentName: "Волконский Платон",
        status: "checked",
        score: 22,
        maxScore: 22,
        uploadedFiles: SAMPLE_PAGE_IMAGES.map((url, i) => ({
          id: `f${i}`,
          url,
          name: `page-${i + 1}.jpg`,
        })),
        review: {
          ...SAMPLE_REVIEW,
          totalScore: 22,
          maxScore: 22,
          feedback:
            "Отличная работа! Все критерии выполнены на высоком уровне.",
        },
      },
      {
        id: "w2",
        studentName: "Щедрина Аполлинария",
        status: "processing",
        uploadedFiles: SAMPLE_PAGE_IMAGES.map((url, i) => ({
          id: `f${i}`,
          url,
          name: `page-${i + 1}.jpg`,
        })),
      },
      {
        id: "w3",
        studentName: "Смирнов Артём",
        status: "error",
        errorMessage: "Не удалось распознать текст на фотографиях",
      },
      {
        id: "w4",
        studentName: "Иванов Демьян",
        status: "pending",
      },
      {
        id: "w5",
        studentName: "Коваленко Виолетта",
        status: "pending",
      },
    ],
  },
  {
    id: "3",
    title: "Тренажёр ударений: 3 минуты в день",
    subject: "russian",
    workType: "oge",
    grade: "7-я параллель",
    createdAt: "2025-02-10",
    works: [],
  },
  {
    id: "4",
    title: "Новое задание",
    subject: "literature",
    workType: "essay",
    grade: "9-я параллель",
    createdAt: "2025-02-12",
    works: [],
  },
  {
    id: "5",
    title: "Новое задание",
    subject: "russian",
    workType: "oge",
    grade: "7-я параллель",
    createdAt: "2025-02-14",
    works: [],
  },
  {
    id: "6",
    title: "Новое задание",
    subject: "russian",
    workType: "oge",
    grade: "7-я параллель",
    createdAt: "2025-02-15",
    works: [],
  },
  {
    id: "7",
    title: "Новое задание",
    subject: "literature",
    workType: "final-essay",
    grade: "11-я параллель",
    createdAt: "2025-02-16",
    works: [],
  },
  {
    id: "8",
    title: "Новое задание",
    subject: "russian",
    workType: "oge",
    grade: "7-я параллель",
    createdAt: "2025-02-17",
    works: [],
  },
  {
    id: "9",
    title: "Новое задание",
    subject: "russian",
    workType: "oge",
    grade: "7-я параллель",
    createdAt: "2025-02-18",
    works: [],
  },
  {
    id: "10",
    title: "Новое задание",
    subject: "russian",
    workType: "oge",
    grade: "7-я параллель",
    createdAt: "2025-02-19",
    works: [],
  },
];
