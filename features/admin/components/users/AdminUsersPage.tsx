"use client";

import { useState } from "react";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../../hooks/admin.hooks";
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
import { Plus, Pencil, Trash2, Users, Loader2, Crown } from "lucide-react";
import type { AdminUser } from "../../types/admin.types";

export function AdminUsersPage() {
  const { user: currentUser } = useAuthStore();
  const { data: users, isLoading } = useUsers();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const isSuperAdmin = currentUser?.role === "super_admin";

  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  // Create form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "teacher">("admin");
  const [createError, setCreateError] = useState("");

  // Edit form
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "teacher">("admin");
  const [editError, setEditError] = useState("");

  const [filterRole, setFilterRole] = useState<
    "all" | "super_admin" | "admin" | "teacher"
  >("all");

  const filteredUsers = users?.filter((u) => {
    const matchRole = filterRole === "all" ? true : u.role === filterRole;
    const matchSearch = search.trim()
      ? u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchRole && matchSearch;
  });

  const openCreate = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("admin");
    setCreateError("");
    setCreateOpen(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditUser(u);
    setEditFullName(u.fullName);
    setEditEmail(u.email);
    setEditPassword("");
    setEditRole(u.role === "super_admin" ? "admin" : u.role);
    setEditError("");
  };

  const handleCreate = () => {
    if (!fullName.trim()) return setCreateError("Ism kiritilmagan");
    if (!email.trim()) return setCreateError("Email kiritilmagan");
    if (!password.trim()) return setCreateError("Parol kiritilmagan");
    createUser(
      { fullName: fullName.trim(), email: email.trim(), password, role },
      {
        onSuccess: () => setCreateOpen(false),
        onError: (err: Error) => setCreateError(err.message),
      },
    );
  };

  const handleUpdate = () => {
    if (!editUser) return;
    if (!editFullName.trim()) return setEditError("Ism kiritilmagan");
    if (!editEmail.trim()) return setEditError("Email kiritilmagan");
    updateUser(
      {
        id: editUser.id,
        data: {
          fullName: editFullName.trim(),
          email: editEmail.trim(),
          role: editRole,
          ...(editPassword ? { password: editPassword } : {}),
        },
      },
      {
        onSuccess: () => setEditUser(null),
        onError: (err: Error) => setEditError(err.message),
      },
    );
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteUser(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const getRoleBadge = (role: string) => {
    const config = {
      super_admin: {
        label: "Super Admin",
        color: "#ef4444",
        bg: "#fef2f2",
        border: "#fecaca",
      },
      admin: {
        label: "Admin",
        color: "#f59e0b",
        bg: "#fffbeb",
        border: "#fde68a",
      },
      teacher: {
        label: "Teacher",
        color: "#3b82f6",
        bg: "#eff6ff",
        border: "#bfdbfe",
      },
    };
    return config[role as keyof typeof config] ?? config.teacher;
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
            Tizim foydalanuvchilari
          </h2>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
            Jami {users?.length ?? 0} ta foydalanuvchi
          </p>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {/* Search */}
          <Input
            placeholder="Ism yoki email qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              borderRadius: 8,
              height: 36,
              width: 300,
              fontSize: 13,
              backgroundColor: "#fff",
            }}
          />

          {/* Filter */}
          <div style={{ display: "flex", gap: 4 }}>
            {(
              [
                { value: "all", label: "Barchasi" },
                { value: "super_admin", label: "Super Admin" },
                { value: "admin", label: "Admin" },
                { value: "teacher", label: "Teacher" },
              ] as const
            ).map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterRole(f.value)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  backgroundColor:
                    filterRole === f.value ? "var(--primary)" : "var(--card)",
                  color:
                    filterRole === f.value
                      ? "var(--primary-foreground)"
                      : "var(--foreground)",
                  transition: "all 0.15s",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {/* Create button — faqat super_admin */}
        {isSuperAdmin && (
          <Button onClick={openCreate} style={{ borderRadius: 8 }}>
            <Plus style={{ width: 16, height: 16, marginRight: 6 }} />
            Yangi admin
          </Button>
        )}
      </div>

      {/* Users list */}
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Loader2
            style={{
              width: 24,
              height: 24,
              color: "var(--muted-foreground)",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      ) : filteredUsers?.length === 0 ? (
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 48,
            textAlign: "center",
          }}
        >
          <Users
            style={{
              width: 32,
              height: 32,
              color: "var(--muted-foreground)",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ fontSize: 15, fontWeight: 500 }}>
            Foydalanuvchi topilmadi
          </p>
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
          {filteredUsers?.map((u, i) => {
            const badge = getRoleBadge(u.role);
            const isCurrentUser = u.id === currentUser?.id;
            const isSuperAdminUser = u.role === "super_admin";

            return (
              <div
                key={u.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 20px",
                  borderBottom:
                    i < (filteredUsers?.length ?? 0) - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor:
                      "color-mix(in srgb, var(--primary) 15%, transparent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {isSuperAdminUser ? (
                    <Crown
                      style={{ width: 16, height: 16, color: "#f59e0b" }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--primary)",
                      }}
                    >
                      {u.fullName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 3,
                    }}
                  >
                    <p style={{ fontSize: 14, fontWeight: 500 }}>
                      {u.fullName}
                    </p>
                    {isCurrentUser && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "#10b981",
                          backgroundColor: "#ecfdf5",
                          border: "1px solid #a7f3d0",
                          padding: "1px 6px",
                          borderRadius: 999,
                        }}
                      >
                        Siz
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        color: badge.color,
                        backgroundColor: badge.bg,
                        border: `1px solid ${badge.border}`,
                        padding: "1px 6px",
                        borderRadius: 999,
                      }}
                    >
                      {badge.label}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: u.isActive ? "#10b981" : "#ef4444",
                        backgroundColor: u.isActive ? "#ecfdf5" : "#fef2f2",
                        border: `1px solid ${u.isActive ? "#a7f3d0" : "#fecaca"}`,
                        padding: "1px 6px",
                        borderRadius: 999,
                      }}
                    >
                      {u.isActive ? "Faol" : "Nofaol"}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                    {u.email}
                  </p>
                </div>

                {/* Actions — faqat super_admin */}
                {isSuperAdmin && !isSuperAdminUser && (
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(u)}
                      style={{
                        borderRadius: 6,
                        width: 32,
                        height: 32,
                        padding: 0,
                      }}
                    >
                      <Pencil style={{ width: 14, height: 14 }} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(u.id)}
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
        <DialogContent className="max-w-md" style={{ borderRadius: 16 }}>
          <DialogHeader>
            <DialogTitle>Yangi foydalanuvchi</DialogTitle>
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
              <Label>Ism-familiya *</Label>
              <Input
                placeholder="Ali Valiyev"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ borderRadius: 8 }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderRadius: 8 }}
                autoComplete="off"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Label>Parol *</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderRadius: 8 }}
                autoComplete="new-password"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Label>Rol *</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "teacher")}
                style={{
                  height: 40,
                  padding: "0 12px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  fontSize: 14,
                  color: "var(--foreground)",
                  outline: "none",
                }}
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            {createError && (
              <p style={{ fontSize: 13, color: "var(--destructive)" }}>
                {createError}
              </p>
            )}
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
              disabled={isCreating}
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
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="max-w-md" style={{ borderRadius: 16 }}>
          <DialogHeader>
            <DialogTitle>Foydalanuvchini tahrirlash</DialogTitle>
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
              <Label>Ism-familiya *</Label>
              <Input
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                style={{ borderRadius: 8 }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Label>Email *</Label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                style={{ borderRadius: 8 }}
                autoComplete="off"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Label>Yangi parol (ixtiyoriy)</Label>
              <Input
                type="password"
                placeholder="O'zgartirmasangiz bo'sh qoldiring"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                style={{ borderRadius: 8 }}
                autoComplete="new-password"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Label>Rol *</Label>
              <select
                value={editRole}
                onChange={(e) =>
                  setEditRole(e.target.value as "admin" | "teacher")
                }
                style={{
                  height: 40,
                  padding: "0 12px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  fontSize: 14,
                  color: "var(--foreground)",
                  outline: "none",
                }}
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            {editError && (
              <p style={{ fontSize: 13, color: "var(--destructive)" }}>
                {editError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditUser(null)}
              style={{ borderRadius: 8 }}
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
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
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-md" style={{ borderRadius: 16 }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Foydalanuvchini o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu foydalanuvchini o'chirishni tasdiqlaysizmi? Bu amalni qaytarib
              bo'lmaydi.
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
