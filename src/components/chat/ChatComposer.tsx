"use client";

import { useRef } from "react";
import { Send } from "lucide-react";

// Message box that clears itself after sending. Enter sends, Shift+Enter adds a line.
export function ChatComposer({ code, action }: { code: string; action: (formData: FormData) => void | Promise<void> }) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await action(fd);
        formRef.current?.reset();
      }}
      className="flex items-end gap-2 border-t border-white/10 p-3"
    >
      <input type="hidden" name="code" value={code} />
      <label htmlFor={`chat-${code}`} className="sr-only">Message</label>
      <textarea
        id={`chat-${code}`}
        name="body"
        rows={1}
        maxLength={2000}
        required
        placeholder="Write a message…"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
          }
        }}
        className="min-h-10 flex-1 resize-y rounded-xl border border-white/10 bg-ink-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none"
      />
      <button type="submit" className="btn btn-gaming h-10 min-h-0 rounded-xl px-4" aria-label="Send message">
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
