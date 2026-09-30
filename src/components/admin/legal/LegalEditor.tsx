"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ChevronLeft } from "lucide-react";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { toast } from "sonner";

type Page = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  isActive: boolean;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function LegalEditor({ page, onBack }: { page: Page | null; onBack: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Page>>({
    title: "",
    slug: "",
    content: "",
    isActive: true,
  });

  // Track if slug has been manually edited
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (page) {
      setFormData(page);
      // If editing existing page, assume slug is already set/customized
      setSlugManuallyEdited(true);
    } else {
        setFormData({
            title: "",
            slug: "",
            content: "",
            isActive: true,
        });
        setSlugManuallyEdited(false);
    }
  }, [page]);

  // Auto-generate slug when title changes, unless manually edited
  useEffect(() => {
    if (!slugManuallyEdited && formData.title) {
        setFormData(prev => ({
            ...prev,
            slug: slugify(prev.title || "")
        }));
    }
  }, [formData.title, slugManuallyEdited]);

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
      toast.error("Title and Slug are required");
      return;
    }
    setLoading(true);
    try {
      const url = page ? `/api/admin/pages/${page.id}` : "/api/admin/pages";
      const method = page ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");
      
      toast.success("Page saved successfully");
      router.refresh();
      onBack();
    } catch (error) {
      console.error(error);
      toast.error("Error saving page");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to List
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="h-10 px-5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
          <Save className="h-4 w-4" />
          <span>{loading ? "Saving..." : "Save Page"}</span>
        </button>
      </div>

      <div className="bg-ink-800 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. Terms and Conditions"
              className="w-full rounded-md bg-ink-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slug
            </label>
            <input
              type="text"
              placeholder="e.g. terms-and-conditions"
              className="w-full rounded-md bg-ink-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
              value={formData.slug}
              onChange={(e) => {
                  setFormData({ ...formData, slug: e.target.value });
                  setSlugManuallyEdited(true);
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-ink-900 rounded-xl border border-white/5">
          <span className="text-sm font-medium text-gray-300">Active Status</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Content
          </label>
          <div className="bg-white rounded-xl overflow-hidden text-black">
             <RichTextEditor
                name="content"
                initialHtml={formData.content || ""}
                placeholder="Write your page content here..."
                onChange={(html) => setFormData({ ...formData, content: html })}
             />
          </div>
        </div>
      </div>
    </div>
  );
}
