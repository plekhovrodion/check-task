export const MAX_UPLOAD_FILE_SIZE_BYTES = 1024 * 1024;
export const MAX_UPLOAD_FILE_SIZE_LABEL = "1 МБ";
export const MAX_UPLOAD_FILES = 10;

export const ACCEPTED_UPLOAD_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/bmp",
  "image/heic",
] as const;

export const ACCEPTED_UPLOAD_EXTENSIONS =
  /\.(pdf|jpe?g|png|bmp|heic)$/i;

export type UploadValidationErrorCode =
  | "too_large"
  | "unsupported_type"
  | "too_many_files";

export interface UploadFile {
  id: string;
  name: string;
  url: string;
}

export interface UploadValidationError {
  id: string;
  fileName: string;
  code: UploadValidationErrorCode;
}

export function isAcceptedUploadFile(file: File): boolean {
  return (
    ACCEPTED_UPLOAD_TYPES.includes(
      file.type as (typeof ACCEPTED_UPLOAD_TYPES)[number]
    ) || ACCEPTED_UPLOAD_EXTENSIONS.test(file.name)
  );
}

export function validateUploadFile(file: File): UploadValidationErrorCode | null {
  if (!isAcceptedUploadFile(file)) {
    return "unsupported_type";
  }

  if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
    return "too_large";
  }

  return null;
}

export function getUploadErrorMessage(code: UploadValidationErrorCode): string {
  switch (code) {
    case "too_large":
      return `размер больше ${MAX_UPLOAD_FILE_SIZE_LABEL}`;
    case "unsupported_type":
      return "неподдерживаемый формат";
    case "too_many_files":
      return `Не более ${MAX_UPLOAD_FILES} файлов`;
  }
}

function formatQuotedFileNames(fileNames: string[]): string {
  return fileNames.map((name) => `«${name}»`).join(", ");
}

export function getUploadRejectedMessages(
  errors: UploadValidationError[]
): string[] {
  if (errors.length === 0) return [];

  const messages: string[] = [];
  const tooLarge = errors
    .filter((error) => error.code === "too_large")
    .map((error) => error.fileName);
  const unsupported = errors
    .filter((error) => error.code === "unsupported_type")
    .map((error) => error.fileName);
  const hasTooMany = errors.some((error) => error.code === "too_many_files");

  if (tooLarge.length === 1) {
    messages.push(
      `Файл: ${formatQuotedFileNames(tooLarge)} весит больше ${MAX_UPLOAD_FILE_SIZE_LABEL}. Попробуйте сжать или загрузить другие`
    );
  } else if (tooLarge.length > 1) {
    messages.push(
      `Файлы: ${formatQuotedFileNames(tooLarge)} весят больше ${MAX_UPLOAD_FILE_SIZE_LABEL}. Попробуйте сжать или загрузить другие`
    );
  }

  if (unsupported.length === 1) {
    messages.push(
      `Файл: ${formatQuotedFileNames(unsupported)} — неподдерживаемый формат`
    );
  } else if (unsupported.length > 1) {
    messages.push(
      `Файлы: ${formatQuotedFileNames(unsupported)} — неподдерживаемый формат`
    );
  }

  if (hasTooMany) {
    messages.push(`Не более ${MAX_UPLOAD_FILES} файлов`);
  }

  return messages;
}

export function createUploadValidationError(
  file: File,
  code: UploadValidationErrorCode
): UploadValidationError {
  return {
    id: `${file.name}-${file.size}-${code}-${Math.random().toString(36).slice(2)}`,
    fileName: file.name,
    code,
  };
}

export function createUploadFileFromNative(file: File): UploadFile {
  return {
    id: Math.random().toString(36).slice(2),
    name: file.name,
    url: URL.createObjectURL(file),
  };
}
