"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, FileText, Loader2 } from "lucide-react";
import { LegalEditor } from "./LegalEditor";
import { toast } from "sonner";

type Page = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  isActive: boolean;
};

export function LegalManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "edit">("list");
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pages");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPages(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Page deleted");
      fetchPages();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting page");
    }
  };

  if (view === "edit") {
    return (
      <LegalEditor 
        page={selectedPage} 
        onBack={() => {
          setView("list");
          setSelectedPage(null);
          fetchPages();
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Legal Pages</h1>
          <p className="text-gray-400 mt-2">Manage terms, privacy policy, and other legal documents.</p>
        </div>
        <button
          onClick={() => {
            setSelectedPage(null);
            setView("edit");
          }}
          className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New Page
        </button>
      </div>

      <div className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Legal Pages Data</h2>
        </div>

        <div className="p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">No pages found</h3>
              <p className="text-gray-400 mt-2">Create your first legal page to get started.</p>
            </div>
          ) : (
            pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center gap-4 p-3 bg-[#0A0E17] hover:bg-white/5 rounded-xl transition-colors"
              >
                <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center shrink-0 text-blue-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {page.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500 truncate">/{page.slug}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${page.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {page.isActive ? "Active" : "Draft"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedPage(page);
                      setView("edit");
                    }}
                    className="btn btn-ghost btn-square btn-sm hover:bg-white/10 text-gray-400 hover:text-white"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="btn btn-ghost btn-square btn-sm hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
