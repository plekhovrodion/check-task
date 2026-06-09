import { SAMPLE_PAGE_IMAGES } from "./mock-data";
import type { StudentWork } from "./types";

export type WorkMediaType = "image" | "pdf";

export interface WorkMediaItem {
  type: WorkMediaType;
  url: string;
  name?: string;
}

export function isPdfFile(name: string) {
  return /\.pdf$/i.test(name);
}

export function isImageFile(name: string) {
  return !isPdfFile(name);
}

export function getWorkMediaItems(work: StudentWork): WorkMediaItem[] {
  if (work.uploadedFiles?.length) {
    return work.uploadedFiles.map((file) => ({
      type: isPdfFile(file.name) ? "pdf" : "image",
      url: file.url,
      name: file.name,
    }));
  }

  if (work.review?.pageImages.length) {
    return work.review.pageImages.map((url, index) => ({
      type: "image" as const,
      url,
      name: `Страница ${index + 1}`,
    }));
  }

  return SAMPLE_PAGE_IMAGES.map((url, index) => ({
    type: "image" as const,
    url,
    name: `Страница ${index + 1}`,
  }));
}

export function getUploadedPageImages(
  work: Pick<StudentWork, "uploadedFiles">
) {
  return (
    work.uploadedFiles
      ?.filter((file) => isImageFile(file.name))
      .map((file) => file.url) ?? []
  );
}

export function getWorkPageImages(work: StudentWork) {
  return getWorkMediaItems(work)
    .filter((item) => item.type === "image")
    .map((item) => item.url);
}
