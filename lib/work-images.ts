import { SAMPLE_PAGE_IMAGES } from "./mock-data";
import type { StudentWork } from "./types";

function isImageFile(name: string) {
  return !/\.pdf$/i.test(name);
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
  const uploaded = getUploadedPageImages(work);
  if (uploaded.length > 0) return uploaded;

  if (work.review?.pageImages.length) {
    return work.review.pageImages;
  }

  return SAMPLE_PAGE_IMAGES;
}
