"use client";

import { useState } from "react";
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from "../../hooks/teacher.hooks";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, BookOpen, Crown, Loader2 } from "lucide-react";
import type { Subject } from "../../types/teacher.types";

export function TeacherSubjectsPage() {
  const { user } = useAuthStore();
  const { data: subjects, isLoading } = useSubjects();
  const { mutate: createSubject, isPending: isCreating } = useCreateSubject();
  const { mutate: updateSubject, isPending: isUpdating } = useUpdateSubject();
  const { mutate: deleteSubject, isPending: isDeleting } = useDeleteSubject();

  const [createOpen, setCreateOpen] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const openCreate = () => {
    setName("");
    setDescription("");
    setCreateOpen(true);
  };

  const openEdit = (subject: Subject) => {
    setName(subject.name);
    setDescription(subject.description ?? "");
    setEditSubject(subject);
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    createSubject(
      { name: name.trim(), description: description.trim() || undefined },
      { onSuccess: () => setCreateOpen(false) },
    );
  };

  const handleUpdate = () => {
    if (!editSubject || !name.trim()) return;
    updateSubject(
      {
        id: editSubject.id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
        },
      },
      { onSuccess: () => setEditSubject(null) },
    );
  };

  const handleDelete = () => {
    if (!deleteSubjectId) return;
    deleteSubject(deleteSubjectId, {
      onSuccess: () => setDeleteSubjectId(null),
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 2 }}>
            Fanlar
          </h2>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
            Jami {subjects?.length ?? 0} ta fan
          </p>
        </div>
        <Button onClick={openCreate} style={{ borderRadius: 8 }}>
          <Plus style={{ width: 16, height: 16, marginRight: 6 }} />
          Yangi fan
        </Button>
      </div>

      {/* Subjects list */}
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Loader2
            style={{
              width: 24,
              height: 24,
              animation: "spin 1s linear infinite",
              color: "var(--muted-foreground)",
            }}
          />
        </div>
      ) : subjects?.length === 0 ? (
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 48,
            textAlign: "center",
          }}
        >
          <BookOpen
            style={{
              width: 32,
              height: 32,
              color: "var(--muted-foreground)",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>
            Hali fan yo'q
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--muted-foreground)",
              marginBottom: 16,
            }}
          >
            Birinchi fanni yarating
          </p>
          <Button
            onClick={openCreate}
            variant="outline"
            style={{ borderRadius: 8 }}
          >
            <Plus style={{ width: 16, height: 16, marginRight: 6 }} />
            Yangi fan
          </Button>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {subjects?.map((subject, i) => {
            const isOwner = subject.createdBy?.id === user?.id;
            return (
              <div
                key={subject.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 20px",
                  borderBottom:
                    i < subjects.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor:
                        "color-mix(in srgb, var(--primary) 10%, transparent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen
                      style={{ width: 16, height: 16, color: "var(--primary)" }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <p style={{ fontSize: 14, fontWeight: 500 }}>
                        {subject.name}
                      </p>
                      {isOwner && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            fontSize: 10,
                            fontWeight: 500,
                            color: "#f59e0b",
                            backgroundColor: "#fffbeb",
                            border: "1px solid #fde68a",
                            padding: "1px 6px",
                            borderRadius: 999,
                          }}
                        >
                          <Crown style={{ width: 9, height: 9 }} />
                          Men tomonimdan yaratilgan
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: subject.isActive ? "#10b981" : "#f59e0b",
                          backgroundColor: subject.isActive
                            ? "#ecfdf5"
                            : "#fffbeb",
                          border: `1px solid ${subject.isActive ? "#a7f3d0" : "#fde68a"}`,
                          padding: "1px 6px",
                          borderRadius: 999,
                        }}
                      >
                        {subject.isActive ? "Faol" : "Nofaol"}
                      </span>
                    </div>
                    {subject.description && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--muted-foreground)",
                          marginTop: 2,
                        }}
                      >
                        {subject.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions — faqat o'zi kiritgan fanni o'zgartira oladi */}
                {isOwner && (
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(subject)}
                      style={{
                        borderRadius: 6,
                        width: 32,
                        height: 32,
                        padding: 0,
                        color: "green",
                      }}
                    >
                      <Pencil style={{ width: 14, height: 14 }} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteSubjectId(subject.id)}
                      style={{
                        borderRadius: 6,
                        width: 32,
                        height: 32,
                        padding: 0,
                        color: "var(--destructive)",
                      }}
                    >
                      <Trash2 style={{ width: 14, height: 14 }} />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent style={{ borderRadius: 16 }}>
          <DialogHeader>
            <DialogTitle>Yangi fan yaratish</DialogTitle>
          </DialogHeader>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: "8px 0",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Label>Fan nomi *</Label>
              <Input
                placeholder="Matematika"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ borderRadius: 8 }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Label>Tavsif (ixtiyoriy)</Label>
              <Input
                placeholder="Fan haqida qisqacha..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ borderRadius: 8 }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              style={{ borderRadius: 8 }}
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating || !name.trim()}
              style={{ borderRadius: 8 }}
            >
              {isCreating ? (
                <Loader2
                  style={{
                    width: 16,
                    height: 16,
                    animation: "spin 1s linear infinite",
                  }}
                />
              ) : (
                "Yaratish"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editSubject} onOpenChange={() => setEditSubject(null)}>
        <DialogContent style={{ borderRadius: 16 }}>
          <DialogHeader>
            <DialogTitle>Fanni tahrirlash</DialogTitle>
          </DialogHeader>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: "8px 0",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Label>Fan nomi *</Label>
              <Input
                placeholder="Matematika"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ borderRadius: 8 }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Label>Tavsif (ixtiyoriy)</Label>
              <Input
                placeholder="Fan haqida qisqacha..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ borderRadius: 8 }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditSubject(null)}
              style={{ borderRadius: 8 }}
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating || !name.trim()}
              style={{ borderRadius: 8 }}
            >
              {isUpdating ? (
                <Loader2
                  style={{
                    width: 16,
                    height: 16,
                    animation: "spin 1s linear infinite",
                  }}
                />
              ) : (
                "Saqlash"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog
        open={!!deleteSubjectId}
        onOpenChange={() => setDeleteSubjectId(null)}
      >
        <AlertDialogContent style={{ borderRadius: 16 }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Fanni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu fanni o'chirishni tasdiqlaysizmi? Fan nofaol holatga
              o'tkaziladi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderRadius: 8 }}>
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                borderRadius: 8,
                backgroundColor: "var(--destructive)",
                color: "white",
              }}
            >
              {isDeleting ? (
                <Loader2
                  style={{
                    width: 16,
                    height: 16,
                    animation: "spin 1s linear infinite",
                  }}
                />
              ) : (
                "O'chirish"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
