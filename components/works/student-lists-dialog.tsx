"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NavIcon } from "@/components/layout/nav-icon";
import { assetPath } from "@/lib/asset-path";
import {
  createStudentListId,
  formatAddStudentsLabel,
  formatStudentCount,
  loadStudentLists,
  parseStudentsFromText,
  saveStudentLists,
  studentsToText,
  type StudentList,
} from "@/lib/student-lists";
import { NumberedStudentsInput } from "./numbered-students-input";

type DialogMode = "browse" | "create" | "edit";

interface StudentListsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStudents: (names: string[]) => void;
}

export function StudentListsDialog({
  open,
  onOpenChange,
  onAddStudents,
}: StudentListsDialogProps) {
  const [lists, setLists] = useState<StudentList[]>([]);
  const [mode, setMode] = useState<DialogMode>("browse");
  const [selectedListIds, setSelectedListIds] = useState<Set<string>>(
    () => new Set()
  );
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [listName, setListName] = useState("Новый список");
  const [studentsText, setStudentsText] = useState("");

  useEffect(() => {
    if (!open) return;
    setLists(loadStudentLists());
    setMode("browse");
    setSelectedListIds(new Set());
    setEditingListId(null);
    setListName("Новый список");
    setStudentsText("");
  }, [open]);

  const parsedStudents = useMemo(
    () => parseStudentsFromText(studentsText),
    [studentsText]
  );

  const canCreateList =
    listName.trim().length > 0 && parsedStudents.length > 0;

  const selectedStudentCount = useMemo(() => {
    return lists
      .filter((list) => selectedListIds.has(list.id))
      .reduce((total, list) => total + list.students.length, 0);
  }, [lists, selectedListIds]);

  const persistLists = (nextLists: StudentList[]) => {
    setLists(nextLists);
    saveStudentLists(nextLists);
  };

  const openCreateMode = () => {
    setMode("create");
    setEditingListId(null);
    setListName("Новый список");
    setStudentsText("");
  };

  const openEditMode = (list: StudentList) => {
    setMode("edit");
    setEditingListId(list.id);
    setListName(list.name);
    setStudentsText(studentsToText(list.students));
  };

  const handleBackToBrowse = () => {
    setMode("browse");
    setEditingListId(null);
    setListName("Новый список");
    setStudentsText("");
  };

  const handleSaveList = () => {
    if (!canCreateList) return;

    const payload = {
      name: listName.trim(),
      students: parsedStudents,
    };

    if (mode === "edit" && editingListId) {
      persistLists(
        lists.map((list) =>
          list.id === editingListId ? { ...list, ...payload } : list
        )
      );
    } else {
      const newList: StudentList = {
        id: createStudentListId(),
        ...payload,
        createdAt: new Date().toISOString(),
      };
      persistLists([newList, ...lists]);
      setSelectedListIds(new Set([newList.id]));
    }

    handleBackToBrowse();
  };

  const toggleListSelection = (listId: string, checked: boolean) => {
    setSelectedListIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(listId);
      } else {
        next.delete(listId);
      }
      return next;
    });
  };

  const handleAddSelectedStudents = () => {
    const names = lists
      .filter((list) => selectedListIds.has(list.id))
      .flatMap((list) => list.students);

    if (names.length === 0) return;

    onAddStudents(names);
    onOpenChange(false);
  };

  const isBrowseMode = mode === "browse";
  const isFormMode = mode === "create" || mode === "edit";

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleBackToBrowse();
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent showCloseButton>
        {isBrowseMode ? (
          <>
            <DialogHeader className="gap-6 pb-0">
              <DialogTitle>Мои списки</DialogTitle>

              {lists.length === 0 ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center gap-1 text-center">
                  <Image
                    src={assetPath("/images/lists-empty.png")}
                    alt=""
                    width={80}
                    height={80}
                    className="size-20 object-contain"
                    aria-hidden
                  />
                  <p className="text-xl font-medium tracking-[-0.2px]">
                    Пока нет списков
                  </p>
                  <p className="text-base text-muted-foreground">
                    Создайте список и добавьте учеников
                  </p>
                </div>
              ) : (
                <div className="flex min-h-[320px] flex-col gap-4">
                  <button
                    type="button"
                    className="flex w-fit items-center gap-1.5 text-base font-medium text-primary"
                    onClick={openCreateMode}
                  >
                    <Plus className="size-5" />
                    Создать новый список
                  </button>

                  <div className="flex flex-col gap-4">
                    {lists.map((list) => (
                      <div
                        key={list.id}
                        className="flex items-center gap-2"
                      >
                        <div className="flex min-w-0 flex-1 items-start gap-2">
                          <Checkbox
                            checked={selectedListIds.has(list.id)}
                            onCheckedChange={(checked) =>
                              toggleListSelection(list.id, checked === true)
                            }
                            className="mt-0.5 size-5"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-base">{list.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatStudentCount(list.students.length)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => openEditMode(list)}
                        >
                          <NavIcon name="pen" className="size-5" />
                          <span className="sr-only">Редактировать список</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </DialogHeader>

            <DialogFooter>
              {lists.length === 0 ? (
                <Button className="w-full" onClick={openCreateMode}>
                  Создать новый список
                </Button>
              ) : (
                <Button
                  className="w-full"
                  disabled={selectedStudentCount === 0}
                  onClick={handleAddSelectedStudents}
                >
                  {selectedStudentCount > 0
                    ? formatAddStudentsLabel(selectedStudentCount)
                    : "Добавить учеников"}
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="gap-6 pb-0">
              <DialogTitle>Список учеников</DialogTitle>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <p className="text-base font-medium">Название списка</p>
                  <Input
                    value={listName}
                    onChange={(event) => setListName(event.target.value)}
                    className="h-12 rounded-[10px] border-none bg-secondary text-base shadow-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-base font-medium">Добавьте учеников</p>
                  <p className="text-sm text-muted-foreground">
                    Скопируйте и вставьте список учеников, или впишите их
                    поимённо
                  </p>
                  <NumberedStudentsInput
                    value={studentsText}
                    onChange={setStudentsText}
                  />
                </div>
              </div>
            </DialogHeader>

            <DialogFooter>
              <Button
                className="w-full"
                disabled={!canCreateList}
                onClick={handleSaveList}
              >
                {mode === "edit" ? "Сохранить список" : "Создать список"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
