"use client";

import { useCallback, useRef, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import { NavIcon } from "@/components/layout/nav-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PdfPreviewThumb } from "@/components/works/pdf-preview-thumb";
import { PdfViewerDialog } from "@/components/works/pdf-viewer-dialog";
import { UploadImageDialog } from "@/components/works/upload-image-dialog";
import { UploadRejectedFiles } from "@/components/works/upload-rejected-files";
import {
  createUploadFileFromNative,
  createUploadValidationError,
  MAX_UPLOAD_FILE_SIZE_LABEL,
  MAX_UPLOAD_FILES,
  validateUploadFile,
  type UploadFile,
  type UploadValidationError,
} from "@/lib/upload";
import { cn } from "@/lib/utils";

export type { UploadFile } from "@/lib/upload";

interface UploadStudentCardProps {
  studentName: string;
  files: UploadFile[];
  onFilesChange: (files: UploadFile[]) => void;
  onNameChange: (name: string) => void;
  onRemoveStudent?: () => void;
  canRemoveStudent?: boolean;
  nameInvalid?: boolean;
}

interface SortableFileThumbProps {
  file: UploadFile;
  index: number;
  onRemove: () => void;
  onPreview: () => void;
}

function SortableFileThumb({
  file,
  index,
  onRemove,
  onPreview,
}: SortableFileThumbProps) {
  const isPdf = Boolean(file.name.match(/\.pdf$/i));
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative size-24 shrink-0 touch-none overflow-hidden rounded-lg border border-[#e4e6f7]",
        isDragging && "z-10 border-2 border-primary opacity-96"
      )}
      {...attributes}
      {...listeners}
    >
      {isPdf ? (
        <button
          type="button"
          className="size-full cursor-grab active:cursor-grabbing"
          onClick={onPreview}
        >
          <PdfPreviewThumb url={file.url} />
        </button>
      ) : (
        <button
          type="button"
          className="size-full cursor-grab active:cursor-grabbing"
          onClick={onPreview}
        >
          <img
            src={file.url}
            alt={file.name}
            className="pointer-events-none size-full object-cover"
            draggable={false}
          />
        </button>
      )}
      <button
        type="button"
        className="absolute top-[3px] right-[3px] flex items-center rounded bg-white p-1"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label="Удалить файл"
      >
        <NavIcon name="cross" className="size-4" />
      </button>
      <span className="pointer-events-none absolute bottom-[3px] left-[3px] min-w-5 rounded-full bg-[rgba(22,26,51,0.6)] px-1 text-sm font-medium leading-5 text-white backdrop-blur-[2px]">
        {index + 1}
      </span>
    </div>
  );
}

export function UploadStudentCard({
  studentName,
  files,
  onFilesChange,
  onNameChange,
  onRemoveStudent,
  canRemoveStudent = true,
  nameInvalid = false,
}: UploadStudentCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadFile | null>(null);
  const [rejectedFiles, setRejectedFiles] = useState<UploadValidationError[]>(
    []
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const newFiles: UploadFile[] = [];
      const newErrors: UploadValidationError[] = [];
      let slotsLeft = MAX_UPLOAD_FILES - files.length;

      Array.from(fileList).forEach((file) => {
        const errorCode = validateUploadFile(file);

        if (errorCode) {
          newErrors.push(createUploadValidationError(file, errorCode));
          return;
        }

        if (slotsLeft <= 0) {
          newErrors.push(createUploadValidationError(file, "too_many_files"));
          return;
        }

        newFiles.push(createUploadFileFromNative(file));
        slotsLeft -= 1;
      });

      if (newErrors.length > 0) {
        setRejectedFiles((prev) => [...prev, ...newErrors]);
      }

      if (newFiles.length > 0) {
        onFilesChange([...files, ...newFiles]);
      }
    },
    [files, onFilesChange]
  );

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = files.findIndex((f) => f.id === active.id);
    const newIndex = files.findIndex((f) => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onFilesChange(arrayMove(files, oldIndex, newIndex));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleSaveCropped = (url: string) => {
    if (!previewFile) return;
    onFilesChange(
      files.map((f) => (f.id === previewFile.id ? { ...f, url } : f))
    );
  };

  const dropZone = (
    <div
      className={cn(
        "flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#bfc3de] p-4 text-center transition-colors",
        isDragging && "border-primary bg-primary/5"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <p className="text-base font-medium">
        <span className="text-primary">Выберите</span>
        <span className="text-foreground"> или перетащите файлы</span>
      </p>
      <p className="text-sm text-muted-foreground">
        Формат — pdf, jpg, jpeg, png, bmp, heic, меньше{" "}
        {MAX_UPLOAD_FILE_SIZE_LABEL}. Не более {MAX_UPLOAD_FILES} файлов
      </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-5 border-b border-[#e4e6f7] bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          value={studentName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Введите имя ученика"
          aria-invalid={nameInvalid}
          className={cn(
            "h-auto w-[320px] rounded-[10px] border-none bg-secondary px-4 py-3 text-base shadow-none placeholder:text-[#9399bd] md:text-base",
            nameInvalid &&
              "border border-destructive bg-destructive/10 ring-3 ring-destructive/20"
          )}
        />
        {canRemoveStudent && onRemoveStudent && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 hover:bg-destructive/10"
            onClick={onRemoveStudent}
            aria-label="Удалить ученика"
          >
            <NavIcon name="trash" destructive />
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-base font-medium">
          {files.length === 0 ? "Работа ученика" : "Проверьте порядок файлов"}
        </p>

        {files.length === 0 ? (
          dropZone
        ) : (
          <div
            className={cn(
              "rounded-xl border border-dashed border-[#bfc3de] p-4 transition-colors",
              isDragging && "border-primary bg-primary/5"
            )}
            onDragOver={(e) => {
              if (e.dataTransfer.types.includes("Files")) {
                e.preventDefault();
                setIsDragging(true);
              }
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              if (e.dataTransfer.files.length > 0) {
                handleDrop(e);
              }
            }}
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={files.map((f) => f.id)}
                strategy={rectSortingStrategy}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {files.map((file, index) => (
                    <SortableFileThumb
                      key={file.id}
                      file={file}
                      index={index}
                      onRemove={() => removeFile(file.id)}
                      onPreview={() => setPreviewFile(file)}
                    />
                  ))}
                  {files.length < MAX_UPLOAD_FILES && (
                    <button
                      type="button"
                      className="flex size-24 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/15"
                      onClick={() => inputRef.current?.click()}
                      aria-label="Добавить файлы"
                    >
                      <Plus className="size-5" />
                    </button>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>

      <UploadRejectedFiles errors={rejectedFiles} />

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.bmp,.heic"
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {previewFile && previewFile.name.match(/\.pdf$/i) && (
        <PdfViewerDialog
          open={previewFile !== null}
          onOpenChange={(open) => {
            if (!open) setPreviewFile(null);
          }}
          url={previewFile.url}
          fileName={previewFile.name}
        />
      )}

      {previewFile && !previewFile.name.match(/\.pdf$/i) && (
        <UploadImageDialog
          open={previewFile !== null}
          onOpenChange={(open) => {
            if (!open) setPreviewFile(null);
          }}
          imageUrl={previewFile.url}
          fileName={previewFile.name}
          onSave={handleSaveCropped}
        />
      )}
    </div>
  );
}
