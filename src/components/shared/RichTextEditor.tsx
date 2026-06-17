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
  Code,
} from "lucide-react";

type Props = {
  name: string;
  initialHtml?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
};

export function RichTextEditor({ name, initialHtml = "", placeholder = "Enter description and format here", onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sourceRef = useRef<HTMLTextAreaElement>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  const [isEmpty, setIsEmpty] = useState(() => initialHtml.replace(/<br\s*\/?>|\s|&nbsp;/g, "").length === 0);
  const [sourceMode, setSourceMode] = useState(false);
  const [dialogMode, setDialogMode] = useState<"link" | "image" | "table" | null>(null);
  const [dialogValue, setDialogValue] = useState<string>("");
  const [tableRows, setTableRows] = useState<number>(2);
  const [tableCols, setTableCols] = useState<number>(2);
  const [tableHeader, setTableHeader] = useState<boolean>(true);
  const [activeBold, setActiveBold] = useState<boolean>(false);
  const [activeItalic, setActiveItalic] = useState<boolean>(false);
  const [activeUnderline, setActiveUnderline] = useState<boolean>(false);
  const [activeAlign, setActiveAlign] = useState<"left" | "center" | "right" | "justify" | null>(null);
  const [activeList, setActiveList] = useState<"ul" | "ol" | null>(null);
  const [activeHeading, setActiveHeading] = useState<"h1" | "h2" | "h3" | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialHtml || "";
    }
    if (inputRef.current) {
      inputRef.current.value = initialHtml || "";
    }
  }, [initialHtml]);

  const sync = () => {
    if (sourceMode) return;
    const html = editorRef.current?.innerHTML || "";
    if (inputRef.current) {
      inputRef.current.value = html;
    }
    setIsEmpty(html.replace(/<br\s*\/?>|\s|&nbsp;/g, "").length === 0);
    updateToolbarState();
    if (onChangeRef.current) onChangeRef.current(html);
  };

  const toggleSource = () => {
    if (sourceMode) {
      // Switch to Visual
      const html = sourceRef.current?.value || "";
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
      }
      if (inputRef.current) {
        inputRef.current.value = html;
      }
      setIsEmpty(html.replace(/<br\s*\/?>|\s|&nbsp;/g, "").length === 0);
      setSourceMode(false);
      // defer toolbar update until render/focus
      setTimeout(() => updateToolbarState(), 0);
      if (onChangeRef.current) onChangeRef.current(html);
    } else {
      // Switch to Source
      sync(); // Ensure inputRef has latest visual content
      if (sourceRef.current && inputRef.current) {
        sourceRef.current.value = inputRef.current.value;
      }
      setSourceMode(true);
    }
  };

  const saveSelection = () => {
    try {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const r = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(r.startContainer)) {
        savedRangeRef.current = r.cloneRange();
      }
    } catch { }
  };
  const restoreSelection = () => {
    try {
      if (!editorRef.current) return;
      editorRef.current.focus();
      const sel = window.getSelection();
      sel?.removeAllRanges();
      if (savedRangeRef.current) {
        sel?.addRange(savedRangeRef.current);
      }
    } catch { }
  };

  const exec = (cmd: string, value?: string) => {
    restoreSelection();
    document.execCommand(cmd, false, value);
    sync();
  };

  const makeLink = () => {
    setDialogMode("link");
    setDialogValue("");
  };

  const insertImageUrl = () => {
    setDialogMode("image");
    setDialogValue("");
  };
  const openTable = () => {
    setDialogMode("table");
    setDialogValue("");
    setTableRows(2);
    setTableCols(2);
    setTableHeader(true);
  };
  const applyHeading = (tag: "h1" | "h2" | "h3") => {
    restoreSelection();
    const cur = String(document.queryCommandValue("formatBlock") || "").toLowerCase();
    if (cur === tag) {
      document.execCommand("formatBlock", false, "p");
    } else {
      document.execCommand("formatBlock", false, tag);
      const after = String(document.queryCommandValue("formatBlock") || "").toLowerCase();
      if (after !== tag) {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const r = sel.getRangeAt(0);
          const h = document.createElement(tag);
          const br = document.createElement("br");
          h.appendChild(br);
          r.insertNode(h);
          const nr = document.createRange();
          nr.setStart(h, 0);
          nr.collapse(true);
          sel.removeAllRanges();
          sel.addRange(nr);
        }
      }
    }
    sync();
  };
  const breakHeadingToParagraph = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const r = sel.getRangeAt(0);
    const node = r.startContainer;
    const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element | null);
    const block = el?.closest("h1,h2,h3");
    if (!block) return;
    const p = document.createElement("p");
    const br = document.createElement("br");
    p.appendChild(br);
    block.after(p);
    const nr = document.createRange();
    nr.setStart(p, 0);
    nr.collapse(true);
    sel.removeAllRanges();
    sel.addRange(nr);
    sync();
  };
  const updateToolbarState = () => {
    try {
      const sel = window.getSelection();
      const node = sel?.anchorNode || null;
      let el: Element | null = null;
      if (node) {
        el = node.nodeType === Node.TEXT_NODE ? (node.parentElement as Element | null) : (node as Element | null);
      }
      if (el && editorRef.current && editorRef.current.contains(el)) {
        const b = document.queryCommandState("bold");
        const i = document.queryCommandState("italic");
        const u = document.queryCommandState("underline");
        const left = document.queryCommandState("justifyLeft");
        const center = document.queryCommandState("justifyCenter");
        const right = document.queryCommandState("justifyRight");
        const justify = document.queryCommandState("justifyFull");
        const ul = document.queryCommandState("insertUnorderedList");
        const ol = document.queryCommandState("insertOrderedList");
        const h = String(document.queryCommandValue("formatBlock") || "").toLowerCase();
        setActiveBold(Boolean(b));
        setActiveItalic(Boolean(i));
        setActiveUnderline(Boolean(u));
        setActiveAlign(left ? "left" : center ? "center" : right ? "right" : justify ? "justify" : null);
        setActiveList(ul ? "ul" : ol ? "ol" : null);
        setActiveHeading(h === "h1" ? "h1" : h === "h2" ? "h2" : h === "h3" ? "h3" : null);
      }
    } catch { }
  };
  useEffect(() => {
    const handler = () => updateToolbarState();
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);
  const editorEventSave = () => {
    saveSelection();
    updateToolbarState();
  };
  const btnClass = (active?: boolean) =>
    `size-7 rounded-lg ${active ? "bg-blue-600 ring-blue-400/50" : "bg-zinc-900 ring-white/10"} text-white inline-flex items-center justify-center hover:bg-zinc-800`;
  const confirmDialog = () => {
    if (!dialogMode) return;
    if (dialogMode === "link") {
      if (!dialogValue) return;
      exec("createLink", dialogValue);
    } else if (dialogMode === "image") {
      if (!dialogValue) return;
      exec("insertImage", dialogValue);
    } else if (dialogMode === "table") {
      const cols = Math.min(Math.max(tableCols, 1), 12);
      const rows = Math.min(Math.max(tableRows, 1), 30);
      const thead = tableHeader ? `<thead><tr>${Array.from({ length: cols }).map((_, i) => `<th>Header ${i + 1}</th>`).join("")}</tr></thead>` : "";
      const tbody = `<tbody>${Array.from({ length: rows }).map((_, r) => `<tr>${Array.from({ length: cols }).map((_, c) => `<td>Cell ${r + 1}-${c + 1}</td>`).join("")}</tr>`).join("")}</tbody>`;
      const html = `<table>${thead}${tbody}</table>`;
      exec("insertHTML", html);
    }
    setDialogValue("");
    setDialogMode(null);
  };
  const cancelDialog = () => {
    setDialogValue("");
    setDialogMode(null);
  };

  return (
    <div className="rounded-xl border border-zinc-900 bg-zinc-950 overflow-hidden h-full flex flex-col">
      <div className="flex flex-wrap items-center gap-1.5 px-2 py-2 border-b border-zinc-900">
        <button type="button" onClick={() => exec("undo")} title="Undo" className={btnClass(false)}>
          <Undo2 className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("redo")} title="Redo" className={btnClass(false)}>
          <Redo2 className="h-3.5 w-3.5" />
        </button>
        <div className="h-5 w-px bg-zinc-700/60" />
        <button type="button" onClick={() => exec("bold")} title="Bold" className={btnClass(activeBold)}>
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("italic")} title="Italic" className={btnClass(activeItalic)}>
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("underline")} title="Underline" className={btnClass(activeUnderline)}>
          <Underline className="h-3.5 w-3.5" />
        </button>
        <div className="h-5 w-px bg-zinc-700/60" />
        <button type="button" onClick={() => applyHeading("h1")} title="Heading 1" className={btnClass(activeHeading === "h1")}>
          <span className="text-[10px] font-bold">H1</span>
        </button>
        <button type="button" onClick={() => applyHeading("h2")} title="Heading 2" className={btnClass(activeHeading === "h2")}>
          <span className="text-[10px] font-bold">H2</span>
        </button>
        <button type="button" onClick={() => applyHeading("h3")} title="Heading 3" className={btnClass(activeHeading === "h3")}>
          <span className="text-[10px] font-bold">H3</span>
        </button>
        <div className="h-5 w-px bg-zinc-700/60" />
        <button type="button" onClick={() => exec("justifyLeft")} title="Align Left" className={btnClass(activeAlign === "left")}>
          <AlignLeft className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("justifyCenter")} title="Align Center" className={btnClass(activeAlign === "center")}>
          <AlignCenter className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("justifyRight")} title="Align Right" className={btnClass(activeAlign === "right")}>
          <AlignRight className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("justifyFull")} title="Justify" className={btnClass(activeAlign === "justify")}>
          <AlignJustify className="h-3.5 w-3.5" />
        </button>
        <div className="h-5 w-px bg-zinc-700/60" />
        <button type="button" onClick={() => exec("insertUnorderedList")} title="Bullet List" className={btnClass(activeList === "ul")}>
          <List className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => exec("insertOrderedList")} title="Numbered List" className={btnClass(activeList === "ol")}>
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
        <div className="h-5 w-px bg-zinc-700/60" />
        <button type="button" onClick={makeLink} title="Link" className={btnClass(dialogMode === "link")}>
          <LinkIcon className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={insertImageUrl} title="Gambar (URL)" className={btnClass(dialogMode === "image")}>
          <ImageIcon className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={openTable} title="Tabel" className={btnClass(dialogMode === "table")}>
          <span className="text-[10px] font-bold">T</span>
        </button>
        <div className="h-5 w-px bg-zinc-700/60" />
        <button type="button" onClick={toggleSource} title="View HTML Source" className={btnClass(sourceMode)}>
          <Code className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="relative flex-1 min-h-[400px]">
        <textarea
          ref={sourceRef}
          className="h-full w-full min-h-[400px] px-3 py-3 text-sm font-mono text-gray-300 bg-black outline-none rounded-b-xl overflow-y-auto resize-none"
          style={{ display: sourceMode ? "block" : "none" }}
          onChange={(e) => {
            if (inputRef.current) inputRef.current.value = e.target.value;
            setIsEmpty(e.target.value.trim().length === 0);
            if (onChangeRef.current) onChangeRef.current(e.target.value);
          }}
          defaultValue={initialHtml}
        />
        <div
          ref={editorRef}
          className="h-full min-h-[400px] px-3 py-3 text-sm text-white bg-black outline-none rounded-b-xl overflow-y-auto"
          style={{ display: sourceMode ? "none" : "block" }}
          contentEditable={!sourceMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && activeHeading) {
              e.preventDefault();
              breakHeadingToParagraph();
            }
          }}
          onKeyUp={editorEventSave}
          onMouseUp={editorEventSave}
          onFocus={editorEventSave}
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
      {dialogMode && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
        <div className="w-11/12 max-w-sm bg-[#0F172A] border border-white/10 text-white rounded-2xl shadow-lg">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="text-sm font-semibold">{dialogMode === "image" ? "Insert Image URL" : dialogMode === "table" ? "Insert Table" : "Insert URL"}</div>
              <button type="button" onClick={cancelDialog} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
                <span className="text-gray-400">×</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {dialogMode === "table" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs mb-1">Rows</div>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={tableRows}
                        onChange={(e) => setTableRows(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <div className="text-xs mb-1">Columns</div>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={tableCols}
                        onChange={(e) => setTableCols(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={tableHeader} onChange={(e) => setTableHeader(e.target.checked)} />
                    <span className="text-sm">Use table header</span>
                  </label>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder={dialogMode === "image" ? "https://example.com/image.jpg" : "https://example.com"}
                    className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={dialogValue}
                    onChange={(e) => setDialogValue(e.target.value)}
                  />
                </>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={cancelDialog} className="h-10 px-4 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDialog}
                  className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                  disabled={dialogMode !== "table" ? !dialogValue : false}
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
