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
import { FileText, Plus } from "lucide-react";
import { NavIcon } from "@/components/layout/nav-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadImageDialog } from "@/components/works/upload-image-dialog";
import { UploadReorderHint } from "@/components/works/upload-reorder-hint";
import { cn } from "@/lib/utils";

export interface UploadFile {
  id: string;
  url: string;
  name: string;
}

interface UploadStudentCardProps {
  studentName: string;
  files: UploadFile[];
  onFilesChange: (files: UploadFile[]) => void;
  onNameChange: (name: string) => void;
  onRemoveStudent?: () => void;
  canRemoveStudent?: boolean;
  showReorderHint?: boolean;
  onCloseReorderHint?: () => void;
  nameInvalid?: boolean;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/bmp",
  "image/heic",
];

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
        isDragging && "z-10 opacity-50"
      )}
      {...attributes}
      {...listeners}
    >
      {isPdf ? (
        <div className="flex size-full cursor-grab flex-col items-center justify-center gap-1 bg-secondary text-muted-foreground active:cursor-grabbing">
          <FileText className="size-8" />
          <span className="max-w-full truncate px-1 text-xs">PDF</span>
        </div>
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
        className="absolute top-[3px] right-[3px] flex items-center rounded-full bg-white p-1 shadow-sm"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label="Удалить файл"
      >
        <NavIcon name="cross" className="size-4" />
      </button>
      <span className="pointer-events-none absolute bottom-[3px] left-[3px] min-w-5 rounded-full bg-[rgba(22,26,51,0.6)] px-1 text-sm font-medium text-white backdrop-blur-[2px]">
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
  showReorderHint,
  onCloseReorderHint,
  nameInvalid = false,
}: UploadStudentCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadFile | null>(null);

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
      Array.from(fileList).forEach((file) => {
        if (
          ACCEPTED_TYPES.includes(file.type) ||
          file.name.match(/\.(pdf|jpe?g|png|bmp|heic)$/i)
        ) {
          newFiles.push({
            id: Math.random().toString(36).slice(2),
            url: URL.createObjectURL(file),
            name: file.name,
          });
        }
      });
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
        "flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#bfc3de] p-4 text-center transition-colors",
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
        Формат — pdf, jpg, jpeg, png, bmp, heic
      </p>
    </div>
  );

  return (
    <div className="border-b border-[#e4e6f7] bg-white p-6">
      <div className="mb-3 flex items-center justify-between gap-4">
        <Input
          value={studentName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Введите ученика"
          aria-invalid={nameInvalid}
          className={cn(
            "h-12 max-w-[320px] rounded-[10px] border-none bg-secondary px-4 text-base shadow-none placeholder:text-muted-foreground md:text-base",
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

      {files.length === 0 ? (
        dropZone
      ) : (
        <div
          className={cn(
            "relative rounded-xl border border-dashed border-[#bfc3de] p-4 transition-colors",
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
          {showReorderHint && onCloseReorderHint && (
            <UploadReorderHint open onClose={onCloseReorderHint} />
          )}
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
                <button
                  type="button"
                  className="flex size-24 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/15"
                  onClick={() => inputRef.current?.click()}
                  aria-label="Добавить файлы"
                >
                  <Plus className="size-5" />
                </button>
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

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
