"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

/** Legacy seed posts are stored as plain text; wrap them in <p> for the editor. */
export function toEditorHtml(content: string): string {
  const trimmed = content.trim();
  if (!trimmed || trimmed.startsWith("<")) return trimmed;
  return trimmed
    .split(/\r?\n\s*\r?\n/)
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>`)
    .join("");
}

function ToolButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`rounded-md px-2.5 py-1.5 font-body text-sm transition-colors disabled:opacity-30 ${
        active
          ? "bg-primary-container/30 text-primary"
          : "text-on-surface-variant hover:bg-white/10 hover:text-on-surface"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadImage(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        setError(data.error || "Upload failed.");
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setUploading(false);
    }
  }

  function setLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (leave empty to remove)", prev ?? "https://");
    if (url === null) return;
    if (url === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-white/10 px-2 py-2">
      <ToolButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <strong>B</strong>
      </ToolButton>
      <ToolButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <em>I</em>
      </ToolButton>
      <ToolButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <s>S</s>
      </ToolButton>
      <span className="mx-1 h-5 w-px bg-white/10" />
      <ToolButton title="Heading" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolButton>
      <ToolButton title="Subheading" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolButton>
      <span className="mx-1 h-5 w-px bg-white/10" />
      <ToolButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • List
      </ToolButton>
      <ToolButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. List
      </ToolButton>
      <ToolButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        &ldquo;Quote&rdquo;
      </ToolButton>
      <span className="mx-1 h-5 w-px bg-white/10" />
      <ToolButton title="Add or edit link" active={editor.isActive("link")} onClick={setLink}>
        Link
      </ToolButton>
      <ToolButton title="Insert image at cursor" disabled={uploading} onClick={() => fileRef.current?.click()}>
        {uploading ? "Uploading…" : "🖼 Image"}
      </ToolButton>
      <span className="mx-1 h-5 w-px bg-white/10" />
      <ToolButton title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        ↺
      </ToolButton>
      <ToolButton title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        ↻
      </ToolButton>

      {error && <span className="ml-2 font-body text-xs text-error">{error}</span>}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadImage(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export default function RichEditor({
  initialHtml,
  onChange,
}: {
  initialHtml: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: "Write your post…" }),
    ],
    content: toEditorHtml(initialHtml),
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "tiptap-editor post-body focus:outline-none" },
      handleDrop: (view, event) => {
        const file = event.dataTransfer?.files?.[0];
        if (file && file.type.startsWith("image/")) {
          event.preventDefault();
          const fd = new FormData();
          fd.append("file", file);
          fetch("/api/admin/upload", { method: "POST", body: fd })
            .then((r) => r.json())
            .then((data) => {
              if (data.url) {
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src: data.url });
                const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
                const tr = view.state.tr.insert(pos?.pos ?? view.state.selection.from, node);
                view.dispatch(tr);
              }
            })
            .catch(() => {});
          return true;
        }
        return false;
      },
    },
  });

  if (!editor) {
    return (
      <div className="rounded-lg border border-white/10 bg-black p-4 font-body text-sm text-outline">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black focus-within:border-primary-container">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
