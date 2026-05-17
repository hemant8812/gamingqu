import type { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-6 md:p-10">
          <article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-blue-400 prose-strong:text-white prose-li:text-gray-300 prose-p:text-gray-300">
            {children}
          </article>
        </div>
      </div>
    </div>
  );
}
