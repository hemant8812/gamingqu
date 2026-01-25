"use client";
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

type Props = {
  name: string;
  initialHtml?: string;
  placeholder?: string;
};

export function RichTextEditor({ name, initialHtml = "", placeholder = "Deskripsi dan format bebas" }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEmpty, setIsEmpty] = useState(() => initialHtml.replace(/<br\s*\/?>|\s|&nbsp;/g, "").length === 0);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialHtml || "";
    }
    if (inputRef.current) {
      inputRef.current.value = initialHtml || "";
    }
  }, [initialHtml]);

  const sync = () => {
    const html = editorRef.current?.innerHTML || "";
    if (inputRef.current) {
      inputRef.current.value = html;
    }
    setIsEmpty(html.replace(/<br\s*\/?>|\s|&nbsp;/g, "").length === 0);
  };

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    sync();
  };

  const makeLink = () => {
    const url = prompt("Masukkan URL:");
    if (!url) return;
    exec("createLink", url);
  };

  const insertImageUrl = () => {
    const url = prompt("Masukkan URL gambar:");
    if (!url) return;
    exec("insertImage", url);
  };

  return (
    <div className="rounded-xl border border-zinc-900 bg-zinc-950 overflow-hidden h-full flex flex-col">
      <div className="flex flex-wrap items-center gap-1.5 px-2 py-2 border-b border-zinc-900">
        <button type="button" onClick={() => exec("undo")} title="Undo" className="size-7 rounded-lg bg-zinc-900 text-white inline-flex items-center justify-center hover:bg-zinc-800 ring-1 ring-white/10">
          <Undo2 className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("redo")} title="Redo" className="size-7 rounded-lg bg-zinc-900 text-white inline-flex items-center justify-center hover:bg-zinc-800 ring-1 ring-white/10">
          <Redo2 className="h-3.5 w-3.5" />
        </button>
        <div className="h-5 w-px bg-zinc-700/60" />
        <button type="button" onClick={() => exec("bold")} title="Bold" className="size-7 rounded-lg bg-zinc-900 text-white inline-flex items-center justify-center hover:bg-zinc-800 ring-1 ring-white/10">
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("italic")} title="Italic" className="size-7 rounded-lg bg-zinc-900 text-white inline-flex items-center justify-center hover:bg-zinc-800 ring-1 ring-white/10">
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("underline")} title="Underline" className="size-7 rounded-lg bg-zinc-900 text-white inline-flex items-center justify-center hover:bg-zinc-800 ring-1 ring-white/10">
          <Underline className="h-3.5 w-3.5" />
        </button>
        <div className="h-5 w-px bg-zinc-700/60" />
        <button type="button" onClick={() => exec("justifyLeft")} title="Align Left" className="size-7 rounded-lg bg-zinc-900 text-white inline-flex items-center justify-center hover:bg-zinc-800 ring-1 ring-white/10">
          <AlignLeft className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("justifyCenter")} title="Align Center" className="size-7 rounded-lg bg-zinc-900 text-white inline-flex items-center justify-center hover:bg-zinc-800 ring-1 ring-white/10">
          <AlignCenter className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("justifyRight")} title="Align Right" className="size-7 rounded-lg bg-zinc-900 text-white inline-flex items-center justify-center hover:bg-zinc-800 ring-1 ring-white/10">
          <AlignRight className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("justifyFull")} title="Justify" className="size-7 rounded-lg bg-zinc-900 text-white inline-flex items-center justify-center hover:bg-zinc-800 ring-1 ring-white/10">
          <AlignJustify className="h-3.5 w-3.5" />
        </button>
        <div className="h-5 w-px bg-zinc-700/60" />
        <button type="button" onClick={() => exec("insertUnorderedList")} title="Bullet List" className="size-7 rounded-lg bg-zinc-900 text-white inline-flex items-center justify-center hover:bg-zinc-800 ring-1 ring-white/10">
          <List className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("insertOrderedList")} title="Numbered List" className="size-7 rounded-lg bg-zinc-900 text-white inline-flex items-center justify-center hover:bg-zinc-800 ring-1 ring-white/10">
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
        <div className="h-5 w-px bg-zinc-700/60" />
        <button type="button" onClick={makeLink} title="Link" className="size-7 rounded-lg bg-zinc-900 text-white inline-flex items-center justify-center hover:bg-zinc-800 ring-1 ring-white/10">
          <LinkIcon className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={insertImageUrl} title="Gambar (URL)" className="size-7 rounded-lg bg-zinc-900 text-white inline-flex items-center justify-center hover:bg-zinc-800 ring-1 ring-white/10">
          <ImageIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="relative flex-1">
        <div
          ref={editorRef}
          className="h-full px-3 py-3 text-sm text-white bg-black outline-none rounded-b-xl overflow-y-auto"
          contentEditable
          onInput={sync}
          onBlur={sync}
          onPaste={sync}
          aria-label="Editor deskripsi"
        />
        {isEmpty && (
          <div className="pointer-events-none absolute top-3 left-3 text-sm text-zinc-500">
            {placeholder}
          </div>
        )}
      </div>
      <input ref={inputRef} type="hidden" name={name} />
    </div>
  );
}
