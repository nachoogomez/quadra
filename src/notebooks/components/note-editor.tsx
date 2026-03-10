"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { EditorToolbar } from "./editor-toolbar";
import type { INote, INotebook } from "../types";
import { ChevronRight } from "lucide-react";

interface NoteEditorProps {
  note: INote;
  notebook: INotebook | null;
  onBack: () => void;
  onBackToGrid: () => void;
  onSave: (updated: INote) => void;
}

export function NoteEditor({ note, notebook, onBack, onBackToGrid, onSave }: NoteEditorProps) {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Refs to avoid stale closures in onUpdate
  const noteRef = useRef(note);
  const onSaveRef = useRef(onSave);
  noteRef.current = note;
  onSaveRef.current = onSave;

  const editor = useEditor({
    immediatelyRender: false,
    autofocus: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing…" }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: (() => {
      try { return JSON.parse(note.content); } catch { return note.content; }
    })(),
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[400px] px-4 md:px-8 py-6",
      },
    },
    onUpdate: ({ editor }) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        onSaveRef.current({
          ...noteRef.current,
          content: JSON.stringify(editor.getJSON()),
          editedAt: new Date().toISOString().split("T")[0],
        });
      }, 600);
    },
  });

  // Sync editor content when switching to a different note
  useEffect(() => {
    if (!editor) return;
    try {
      const parsed = JSON.parse(note.content);
      editor.commands.setContent(parsed, { emitUpdate: false });
    } catch {
      editor.commands.setContent(note.content, { emitUpdate: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header / breadcrumb */}
      <div className="flex select-none items-center gap-2 border-b border-border px-6 py-3 text-sm text-muted-foreground">
        <button onClick={onBackToGrid} aria-label="Back to all notebooks" className="hover:text-foreground transition-colors">
          Notebooks
        </button>
        {notebook && (
          <>
            <ChevronRight size={14} aria-hidden="true" />
            <button onClick={onBack} aria-label={`Back to ${notebook.title}`} className="hover:text-foreground transition-colors">
              {notebook.icon} {notebook.title}
            </button>
          </>
        )}
        <ChevronRight size={14} aria-hidden="true" />
        <span className="text-foreground font-medium">{note.title}</span>
      </div>

      {/* Toolbar */}
      {editor && <EditorToolbar editor={editor} />}

      {/* Editor area */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl">
          <h1 className="select-none px-4 md:px-8 pt-6 md:pt-8 pb-2 text-2xl font-bold text-foreground">{note.title}</h1>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
