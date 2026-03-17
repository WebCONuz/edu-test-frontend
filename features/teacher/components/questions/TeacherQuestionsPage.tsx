"use client";

import { useState } from "react";
import {
  useMyQuestions,
  useDeleteQuestion,
  useCreateQuestion,
  useImportQuestions,
  useSubjects,
  useUpdateQuestion,
} from "../../hooks/teacher.hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import type { Question } from "../../types/teacher.types";

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
import {
  Plus,
  Trash2,
  HelpCircle,
  Loader2,
  FileUp,
  CheckCircle,
  FileInput,
  ChevronDown,
  ChevronUp,
  Pencil,
} from "lucide-react";
import { MathText } from "@/shared/components/MathText";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const OPTION_LABELS = ["A", "B", "C", "D"];

interface AnswerOptionForm {
  optionLabel: string;
  optionText: string;
  isCorrect: boolean;
  displayOrder: number;
}

const defaultOptions: AnswerOptionForm[] = OPTION_LABELS.map((label, i) => ({
  optionLabel: label,
  optionText: "",
  isCorrect: i === 0,
  displayOrder: i,
}));

export function TeacherQuestionsPage() {
  const { data: questions, isLoading } = useMyQuestions();
  const { data: subjects } = useSubjects();
  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion();
  const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion();
  const { mutate: importQuestions, isPending: isImporting } =
    useImportQuestions();
  const { mutate: updateQuestion, isPending: isUpdating } = useUpdateQuestion();

  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") === "import" ? "import" : "list";

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterSubject, setFilterSubject] = useState("");

  // Create form state
  const [questionText, setQuestionText] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [options, setOptions] = useState<AnswerOptionForm[]>(defaultOptions);
  const [createError, setCreateError] = useState("");

  // Import state
  const [importSubjectId, setImportSubjectId] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importSuccess, setImportSuccess] = useState<{
    saved: number;
    skipped: number;
  } | null>(null);
  const [importError, setImportError] = useState("");

  //   Edit states
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editSubjectId, setEditSubjectId] = useState("");
  const [editOptions, setEditOptions] =
    useState<AnswerOptionForm[]>(defaultOptions);
  const [editError, setEditError] = useState("");

  const filteredQuestions = filterSubject
    ? questions?.filter((q) => q.subject.id === filterSubject)
    : questions;

  const handleOptionChange = (index: number, text: string) => {
    setOptions((prev) =>
      prev.map((o, i) => (i === index ? { ...o, optionText: text } : o)),
    );
  };

  const handleCorrectChange = (index: number) => {
    setOptions((prev) =>
      prev.map((o, i) => ({ ...o, isCorrect: i === index })),
    );
  };

  const resetCreateForm = () => {
    setQuestionText("");
    setSubjectId("");
    setOptions(defaultOptions);
    setCreateError("");
  };

  const handleCreate = () => {
    if (!questionText.trim()) return setCreateError("Savol matni kiritilmagan");
    if (!subjectId) return setCreateError("Fan tanlanmagan");
    if (options.some((o) => !o.optionText.trim()))
      return setCreateError("Barcha javob variantlarini to'ldiring");
    if (!options.some((o) => o.isCorrect))
      return setCreateError("To'g'ri javobni belgilang");

    createQuestion(
      {
        questionText: questionText.trim(),
        questionType: "single",
        subjectId,
        answerOptions: options,
      },
      {
        onSuccess: () => {
          resetCreateForm();
          setActiveTab("list");
        },
        onError: (err: Error) => setCreateError(err.message),
      },
    );
  };

  const handleImport = () => {
    if (!importSubjectId) return setImportError("Fan tanlanmagan");
    if (!importFile) return setImportError("Fayl tanlanmagan");

    importQuestions(
      { subjectId: importSubjectId, file: importFile },
      {
        onSuccess: (res) => {
          setImportSuccess({ saved: res.saved, skipped: res.skipped });
          setImportFile(null);
          setImportSubjectId("");
          setImportError("");
        },
        onError: (err: Error) => setImportError(err.message),
      },
    );
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteQuestion(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const openEdit = (q: Question) => {
    setEditQuestion(q);
    setEditQuestionText(q.questionText);
    setEditSubjectId(q.subject.id);
    setEditOptions(
      q.answerOptions.map((opt) => ({
        optionLabel: opt.optionLabel,
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
        displayOrder: opt.displayOrder,
      })),
    );
    setEditError("");
  };

  const handleEditOptionChange = (index: number, text: string) => {
    setEditOptions((prev) =>
      prev.map((o, i) => (i === index ? { ...o, optionText: text } : o)),
    );
  };

  const handleEditCorrectChange = (index: number) => {
    setEditOptions((prev) =>
      prev.map((o, i) => ({ ...o, isCorrect: i === index })),
    );
  };

  const handleUpdate = () => {
    if (!editQuestion) return;
    if (!editQuestionText.trim())
      return setEditError("Savol matni kiritilmagan");
    if (!editSubjectId) return setEditError("Fan tanlanmagan");
    if (editOptions.some((o) => !o.optionText.trim()))
      return setEditError("Barcha javob variantlarini to'ldiring");
    if (!editOptions.some((o) => o.isCorrect))
      return setEditError("To'g'ri javobni belgilang");

    updateQuestion(
      {
        id: editQuestion.id,
        data: {
          questionText: editQuestionText.trim(),
          subjectId: editSubjectId,
          answerOptions: editOptions,
        },
      },
      {
        onSuccess: () => setEditQuestion(null),
        onError: (err: Error) => setEditError(err.message),
      },
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        Mening savollarim
      </h2>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          {/* Tab buttons */}
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { value: "list", label: "Ro'yxat", icon: null },
              {
                value: "create",
                label: "Yangi savol",
                icon: <Plus style={{ width: 14, height: 14 }} />,
              },
              {
                value: "import",
                label: "Import",
                icon: <FileUp style={{ width: 14, height: 14 }} />,
              },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  backgroundColor: activeTab === tab.value ? "#000" : "#fff",
                  color: activeTab === tab.value ? "#fff" : "#000",
                  transition: "all 0.15s",
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filter */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            style={{
              height: 36,
              padding: "0 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
              fontSize: 13,
              color: "var(--foreground)",
              outline: "none",
              minWidth: 180,
            }}
          >
            <option value="">Barcha fanlar</option>
            {subjects?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* ===== LIST TAB ===== */}
        <TabsContent value="list">
          {isLoading ? (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 48 }}
            >
              <Loader2
                style={{
                  width: 24,
                  height: 24,
                  color: "var(--muted-foreground)",
                  animation: "spin 1s linear infinite",
                }}
              />
            </div>
          ) : filteredQuestions?.length === 0 ? (
            <div
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 48,
                textAlign: "center",
              }}
            >
              <HelpCircle
                style={{
                  width: 32,
                  height: 32,
                  color: "var(--muted-foreground)",
                  margin: "0 auto 12px",
                }}
              />
              <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>
                Hali siz savol qo'shganingiz yo'q
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--muted-foreground)",
                  marginBottom: 16,
                }}
              >
                Yangi savol yarating yoki fayldan import qiling
              </p>
              <div
                style={{ display: "flex", gap: 8, justifyContent: "center" }}
              >
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("create")}
                  style={{ borderRadius: 8 }}
                >
                  <Plus style={{ width: 14, height: 14, marginRight: 6 }} />
                  Yangi savol
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("import")}
                  style={{ borderRadius: 8 }}
                >
                  <FileUp style={{ width: 14, height: 14, marginRight: 6 }} />
                  Import
                </Button>
              </div>
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
              {filteredQuestions?.map((q, i) => {
                const isExpanded = expandedId === q.id;
                return (
                  <div
                    key={q.id}
                    style={{
                      borderBottom:
                        i < (filteredQuestions?.length ?? 0) - 1
                          ? "1px solid var(--border)"
                          : "none",
                    }}
                  >
                    {/* Question header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "14px 20px",
                      }}
                    >
                      {/* Status dot */}
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: q.isActive ? "#10b981" : "#f59e0b",
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 4,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: "#3b82f6",
                              backgroundColor: "#eff6ff",
                              border: "1px solid #bfdbfe",
                              padding: "1px 6px",
                              borderRadius: 999,
                            }}
                          >
                            {q.subject.name}
                          </span>
                          {q.source === "file_import" && (
                            <span
                              style={{
                                fontSize: 11,
                                color: "#8b5cf6",
                                backgroundColor: "#f5f3ff",
                                border: "1px solid #ddd6fe",
                                padding: "1px 6px",
                                borderRadius: 999,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 3,
                              }}
                            >
                              <FileInput style={{ width: 9, height: 9 }} />
                              Import
                            </span>
                          )}
                        </div>

                        <p
                          style={{
                            fontSize: 14,
                            lineHeight: 1.6,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: isExpanded ? "unset" : 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          <MathText text={q.questionText} />
                        </p>
                      </div>

                      {/* Actions */}
                      {/* Actions */}
                      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : q.id)
                          }
                          className="w-8 h-8 p-0 rounded-md"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(q)}
                          className="w-8 h-8 p-0 rounded-md"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(q.id)}
                          className="w-8 h-8 p-0 rounded-md text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Expanded — javob variantlari */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: "0 20px 16px 40px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {q.imageUrl && (
                          <img
                            src={q.imageUrl}
                            alt="Savol rasmi"
                            style={{
                              maxWidth: 400,
                              borderRadius: 8,
                              border: "1px solid var(--border)",
                              marginBottom: 8,
                            }}
                          />
                        )}
                        {q.answerOptions.map((opt) => (
                          <div
                            key={opt.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "8px 12px",
                              borderRadius: 8,
                              backgroundColor: opt.isCorrect
                                ? "#ecfdf5"
                                : "var(--muted)",
                              border: `1px solid ${opt.isCorrect ? "#a7f3d0" : "var(--border)"}`,
                            }}
                          >
                            <span
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                fontWeight: 600,
                                backgroundColor: opt.isCorrect
                                  ? "#10b981"
                                  : "var(--border)",
                                color: opt.isCorrect
                                  ? "white"
                                  : "var(--muted-foreground)",
                                flexShrink: 0,
                              }}
                            >
                              {opt.optionLabel}
                            </span>
                            <span style={{ fontSize: 13 }}>
                              <MathText text={opt.optionText} />
                            </span>
                            {opt.isCorrect && (
                              <CheckCircle
                                style={{
                                  width: 14,
                                  height: 14,
                                  color: "#10b981",
                                  marginLeft: "auto",
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ===== CREATE TAB ===== */}
        <TabsContent value="create">
          <div
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Fan tanlash */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Label>Fan *</Label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  style={{
                    height: 44,
                    padding: "0 12px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    fontSize: 14,
                    color: "var(--foreground)",
                    outline: "none",
                  }}
                >
                  <option value="">Fan tanlang</option>
                  {subjects
                    ?.filter((s) => s.isActive)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Savol matni */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Label>{`Savol matni`}</Label>
                <Textarea
                  placeholder="Savolingizni kiriting..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  style={{
                    borderRadius: 10,
                    minHeight: 100,
                    resize: "vertical",
                    padding: "8px 12px",
                  }}
                />
                {questionText && (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      backgroundColor: "var(--muted)",
                      fontSize: 14,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--muted-foreground)",
                        marginBottom: 4,
                      }}
                    >
                      Ko'rinish:
                    </p>
                    <MathText text={questionText} />
                  </div>
                )}
              </div>

              {/* Javob variantlari */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Label>Javob variantlari * (to'g'ri javobni belgilang)</Label>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {options.map((opt, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      {/* To'g'ri javob radio */}
                      <button
                        type="button"
                        onClick={() => handleCorrectChange(i)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          border: `2px solid ${opt.isCorrect ? "#10b981" : "var(--border)"}`,
                          backgroundColor: opt.isCorrect
                            ? "#10b981"
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                          fontSize: 12,
                          fontWeight: 600,
                          color: opt.isCorrect
                            ? "white"
                            : "var(--muted-foreground)",
                          transition: "all 0.15s",
                        }}
                      >
                        {opt.optionLabel}
                      </button>
                      <Input
                        placeholder={`${opt.optionLabel} variant`}
                        value={opt.optionText}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        style={{ borderRadius: 8, flex: 1 }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {createError && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    backgroundColor:
                      "color-mix(in srgb, var(--destructive) 8%, transparent)",
                    border:
                      "1px solid color-mix(in srgb, var(--destructive) 20%, transparent)",
                  }}
                >
                  <p style={{ fontSize: 13, color: "var(--destructive)" }}>
                    {createError}
                  </p>
                </div>
              )}

              <div
                style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
              >
                <Button
                  variant="outline"
                  onClick={resetCreateForm}
                  style={{ borderRadius: 8 }}
                >
                  Tozalash
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
                    <>
                      <Plus style={{ width: 16, height: 16, marginRight: 6 }} />
                      Saqlash
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ===== IMPORT TAB ===== */}
        <TabsContent value="import">
          <div
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  backgroundColor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  fontSize: 13,
                  color: "#1d4ed8",
                  lineHeight: 1.6,
                }}
              >
                📄 Qo'llab-quvvatlanadigan fayl turlari: <strong>.pdf</strong>,{" "}
                <strong>.docx</strong>, <strong>.txt</strong>
                <br />
                AI savollarni avtomatik aniqlaydi va import qiladi.
              </div>

              {/* Fan tanlash */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Label>Fan *</Label>
                <select
                  value={importSubjectId}
                  onChange={(e) => setImportSubjectId(e.target.value)}
                  style={{
                    height: 44,
                    padding: "0 12px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    fontSize: 14,
                    color: "var(--foreground)",
                    outline: "none",
                  }}
                >
                  <option value="">Fan tanlang</option>
                  {subjects
                    ?.filter((s) => s.isActive)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Fayl yuklash */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Label>Fayl *</Label>
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: 32,
                    borderRadius: 10,
                    border: `2px dashed ${importFile ? "#10b981" : "var(--border)"}`,
                    backgroundColor: importFile ? "#ecfdf5" : "var(--muted)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      setImportFile(e.target.files?.[0] ?? null);
                      setImportSuccess(null);
                      setImportError("");
                    }}
                  />
                  {importFile ? (
                    <>
                      <CheckCircle
                        style={{ width: 28, height: 28, color: "#10b981" }}
                      />
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#10b981",
                        }}
                      >
                        {importFile.name}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {(importFile.size / 1024).toFixed(1)} KB — fayl tanlandi
                      </p>
                    </>
                  ) : (
                    <>
                      <FileUp
                        style={{
                          width: 28,
                          height: 28,
                          color: "var(--muted-foreground)",
                        }}
                      />
                      <p style={{ fontSize: 14, fontWeight: 500 }}>
                        Fayl tanlash uchun bosing
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        PDF, DOCX yoki TXT
                      </p>
                    </>
                  )}
                </label>
              </div>

              {/* Import natija */}
              {importSuccess !== null && (
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: 10,
                    backgroundColor: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                  }}
                >
                  <p
                    style={{ fontSize: 14, color: "#065f46", fontWeight: 500 }}
                  >
                    {importSuccess.saved} ta yangi savol saqlandi
                    {importSuccess.skipped > 0 &&
                      `, ${importSuccess.skipped} ta takror o'tkazib yuborildi`}
                  </p>
                </div>
              )}

              {importError && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    backgroundColor:
                      "color-mix(in srgb, var(--destructive) 8%, transparent)",
                    border:
                      "1px solid color-mix(in srgb, var(--destructive) 20%, transparent)",
                  }}
                >
                  <p style={{ fontSize: 13, color: "var(--destructive)" }}>
                    {importError}
                  </p>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={handleImport}
                  disabled={isImporting || !importFile || !importSubjectId}
                  style={{ borderRadius: 8 }}
                >
                  {isImporting ? (
                    <>
                      <Loader2
                        style={{
                          width: 16,
                          height: 16,
                          marginRight: 6,
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      Import qilinmoqda...
                    </>
                  ) : (
                    <>
                      <FileUp
                        style={{ width: 16, height: 16, marginRight: 6 }}
                      />
                      Import qilish
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editQuestion} onOpenChange={() => setEditQuestion(null)}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Savolni tahrirlash</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5 py-2">
            {/* Fan */}
            <div className="flex flex-col gap-2">
              <Label>Fan *</Label>
              <select
                value={editSubjectId}
                onChange={(e) => setEditSubjectId(e.target.value)}
                className="h-11 px-3 rounded-xl border border-input bg-background text-sm outline-none"
              >
                <option value="">Fan tanlang</option>
                {subjects
                  ?.filter((s) => s.isActive)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Savol matni */}
            <div className="flex flex-col gap-2 mt-2">
              <Label>Savol matni *</Label>
              <Textarea
                value={editQuestionText}
                onChange={(e) => setEditQuestionText(e.target.value)}
                className="rounded-xl min-h-24 resize-y"
              />
              {editQuestionText && (
                <div
                  className="rounded-lg bg-muted text-sm mb-3"
                  style={{ padding: "8px 12px" }}
                >
                  <p className="text-xs text-muted-foreground">Ko'rinish:</p>
                  <MathText text={editQuestionText} />
                </div>
              )}
            </div>

            {/* Javob variantlari */}
            <div className="flex flex-col gap-2">
              <Label>Javob variantlari *</Label>
              <div className="flex flex-col gap-2">
                {editOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditCorrectChange(i)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all"
                      style={{
                        border: `2px solid ${opt.isCorrect ? "#10b981" : "var(--border)"}`,
                        backgroundColor: opt.isCorrect
                          ? "#10b981"
                          : "transparent",
                        color: opt.isCorrect
                          ? "white"
                          : "var(--muted-foreground)",
                      }}
                    >
                      {opt.optionLabel}
                    </button>
                    <Input
                      value={opt.optionText}
                      onChange={(e) =>
                        handleEditOptionChange(i, e.target.value)
                      }
                      className="rounded-lg flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {editError && (
              <p className="text-xs text-destructive">{editError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditQuestion(null)}
              className="rounded-xl"
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="rounded-xl"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
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
            <AlertDialogTitle>Savolni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu savolni o'chirishni tasdiqlaysizmi? Savol nofaol holatga
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
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
