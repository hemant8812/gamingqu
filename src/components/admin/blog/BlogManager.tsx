"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Save, X, Trash2, Globe, RefreshCw, Plus, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { AutoSlugField } from "@/components/shared/AutoSlugField";

type Post = {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content?: string | null;
    imageUrl?: string | null;
    isPublished: boolean;
    sourceUrl?: string | null;
};

type ScraperSource = {
    id: string;
    name: string;
    url: string;
    isActive: boolean;
    scrapeInterval: number;
    lastRunAt?: Date | string | null;
};

export function BlogManager({ posts, sources, page, totalPages }: { posts: Post[]; sources: ScraperSource[]; page: number; totalPages: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isScraping, setIsScraping] = useState(false);
    const [busy, setBusy] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const postDialogRef = useRef<HTMLDialogElement>(null);

    const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
    const sourceDialogRef = useRef<HTMLDialogElement>(null);
    const [editingSource, setEditingSource] = useState<ScraperSource | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const confirmDialogRef = useRef<HTMLDialogElement>(null);
    const [confirmTarget, setConfirmTarget] = useState<{ id: string; kind: "post" | "source" } | null>(null);

    useEffect(() => {
        const editId = searchParams.get("edit");
        const create = searchParams.get("create");

        if (editId) {
            const post = posts.find(p => p.id === editId);
            if (post) {
                setEditingPost(post);
                setIsPostModalOpen(true);
            }
        } else if (create) {
            setEditingPost(null);
            setIsPostModalOpen(true);
        }
    }, [searchParams, posts]);

    useEffect(() => {
        if (isPostModalOpen) {
            postDialogRef.current?.showModal();
        } else {
            postDialogRef.current?.close();
            if (searchParams.has("edit") || searchParams.has("create")) {
                const url = new URL(window.location.href);
                url.searchParams.delete("edit");
                url.searchParams.delete("create");
                window.history.replaceState(null, "", url.toString());
            }
        }
    }, [isPostModalOpen, searchParams]);

    useEffect(() => {
        if (isSourceModalOpen) {
            sourceDialogRef.current?.showModal();
        } else {
            sourceDialogRef.current?.close();
            setEditingSource(null);
        }
    }, [isSourceModalOpen]);
    useEffect(() => {
        if (isConfirmOpen) {
            confirmDialogRef.current?.showModal();
        } else {
            confirmDialogRef.current?.close();
            setConfirmTarget(null);
        }
    }, [isConfirmOpen]);

    const openEditSource = (s: ScraperSource) => {
        setEditingSource(s);
        setIsSourceModalOpen(true);
    };

    const handleScrape = async () => {
        if (isScraping) return;
        setIsScraping(true);
        try {
            const res = await fetch("/api/admin/scraper", { method: "PUT" });
            const data = await res.json();
            if (data.success) {
                router.refresh();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsScraping(false);
        }
    };

    const handleImportBlizzard = async () => {
        if (isImporting) return;
        setIsImporting(true);
        try {
            const res = await fetch("/api/admin/blizzard/import", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                router.refresh();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsImporting(false);
        }
    };
    const handleDeletePost = (id: string) => {
        setConfirmTarget({ id, kind: "post" });
        setIsConfirmOpen(true);
    };

    const handleDeleteSource = (id: string) => {
        setConfirmTarget({ id, kind: "source" });
        setIsConfirmOpen(true);
    };
    const confirmDelete = async () => {
        if (!confirmTarget) return;
        try {
            if (confirmTarget.kind === "post") {
                await fetch(`/api/admin/blog?id=${confirmTarget.id}`, { method: "DELETE" });
            } else {
                await fetch(`/api/admin/scraper?id=${confirmTarget.id}`, { method: "DELETE" });
            }
            router.refresh();
        } catch {
        } finally {
            setIsConfirmOpen(false);
            setConfirmTarget(null);
        }
    };

    const handleAddSource = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBusy(true);
        const fd = new FormData(e.currentTarget);
        const url = fd.get("url") as string;
        const interval = parseInt(fd.get("interval") as string) || 60;

        try {
            await fetch("/api/admin/scraper", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, interval })
            });
            router.refresh();
            setIsSourceModalOpen(false);
            e.currentTarget.reset();
        } catch (e) {
            console.error(e);
        } finally {
            setBusy(false);
        }
    };

    const handleSavePost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBusy(true);
        const fd = new FormData(e.currentTarget);
        if (!fd.has("isPublished")) fd.set("isPublished", "false");
        else fd.set("isPublished", "true");

        try {
            const method = editingPost ? "PUT" : "POST";
            await fetch("/api/admin/blog", { method, body: fd });
            router.refresh();
            setIsPostModalOpen(false);
        } catch (e) {
            console.error(e);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Scraper Control Panel */}
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <h2 className="text-lg font-bold text-white">Auto-Scraper Sources</h2>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setIsSourceModalOpen(true)}
                                className="h-9 px-3 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                                disabled={sources.length >= 5}
                            >
                                <Plus className="h-4 w-4" /> Add Source ({sources.length}/5)
                            </button>
                            <button
                                onClick={handleScrape}
                                disabled={isScraping || sources.length === 0}
                                className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`h-4 w-4 ${isScraping ? "animate-spin" : ""}`} />
                                {isScraping ? "Scraping..." : "Run Scraper"}
                            </button>
                            <button
                                onClick={handleImportBlizzard}
                                disabled={isImporting}
                                className="h-9 px-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Globe className={`h-4 w-4 ${isImporting ? "animate-spin" : ""}`} />
                                {isImporting ? "Importing..." : "Import Blizzard"}
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase">Source</th>
                                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase">Interval</th>
                                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase">Status</th>
                                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase">Last Run</th>
                                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sources.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-500">No sources configured</td>
                                    </tr>
                                )}
                                {sources.map(s => (
                                    <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-3 px-2">
                                            <div className="font-semibold text-white">{s.name}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-xs">{s.url}</div>
                                        </td>
                                        <td className="py-3 px-2 text-sm text-gray-300">{s.scrapeInterval} min</td>
                                        <td className="py-3 px-2">
                                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-md ${s.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>
                                                {s.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-xs text-gray-500">
                                            {s.lastRunAt ? new Date(s.lastRunAt).toLocaleString() : "Never"}
                                        </td>
                                        <td className="py-3 px-2">
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => openEditSource(s)} className="text-xs text-gray-400 hover:text-white transition-colors">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDeleteSource(s.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Blog Posts Management */}
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Blog Posts</h2>
                    <button onClick={() => { setEditingPost(null); setIsPostModalOpen(true); }} className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-colors">
                        <Plus className="h-4 w-4" /> Create Post
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Title</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Source</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="py-3 px-4">
                                        <div className="font-semibold text-white">{post.title}</div>
                                        <div className="text-xs text-gray-500">/{post.slug}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {post.sourceUrl ? (
                                            <a href={post.sourceUrl} target="_blank" className="flex items-center gap-1 text-xs text-blue-400 hover:underline">
                                                <Globe className="h-3 w-3" /> Auto-Scraped
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-500">Manual</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-md ${post.isPublished ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                            {post.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => { setEditingPost(post); setIsPostModalOpen(true); }} className="text-xs text-gray-400 hover:text-white transition-colors">Edit</button>
                                            <button onClick={() => handleDeletePost(post.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-gray-500">No posts found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="p-4 flex items-center justify-end gap-2 border-t border-white/10">
                        <Link
                            href={`/admin/blog?page=${Math.max(1, page - 1)}`}
                            prefetch={false}
                            className={`h-9 px-3 text-sm font-medium rounded-lg flex items-center gap-1 transition-colors ${page > 1 ? "bg-white/5 hover:bg-white/10 text-gray-300" : "bg-white/5 text-gray-600 cursor-not-allowed"}`}
                            aria-disabled={page <= 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Prev</span>
                        </Link>
                        <span className="text-xs text-gray-500">
                            Page {page} of {totalPages}
                        </span>
                        <Link
                            href={`/admin/blog?page=${Math.min(totalPages, page + 1)}`}
                            prefetch={false}
                            className={`h-9 px-3 text-sm font-medium rounded-lg flex items-center gap-1 transition-colors ${page < totalPages ? "bg-white/5 hover:bg-white/10 text-gray-300" : "bg-white/5 text-gray-600 cursor-not-allowed"}`}
                            aria-disabled={page >= totalPages}
                        >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
            {editingSource ? "Edit Source" : ""}

            {/* Source Modal */}
            <dialog ref={sourceDialogRef} className="modal">
                <div className="modal-box bg-[#0F172A] border-0 text-white rounded-2xl">
                    <h3 className="font-bold text-lg">Add Scraper Source</h3>
                    <p className="py-2 text-sm text-gray-400">Enter a valid RSS feed URL or website URL</p>
                    <form onSubmit={handleAddSource} className="mt-4 space-y-4">
                        <input name="url" type="url" placeholder="https://..." required className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" defaultValue={editingSource?.url ?? ""} />
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Scrape Interval</label>
                            <select name="interval" className="w-full h-11 px-4 bg-[#0A0E17] border-0 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer" defaultValue={editingSource ? String(editingSource.scrapeInterval) : "60"}>
                                <option value="30">Every 30 minutes</option>
                                <option value="60">Every 1 hour</option>
                                <option value="180">Every 3 hours</option>
                                <option value="360">Every 6 hours</option>
                                <option value="720">Every 12 hours</option>
                                <option value="1440">Every 24 hours</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <button type="button" onClick={() => setIsSourceModalOpen(false)} className="h-10 px-4 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors">Cancel</button>
                            <button type="submit" className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50" disabled={busy}>Add Source</button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop bg-black/60">
                    <button onClick={() => setIsSourceModalOpen(false)}>close</button>
                </form>
            </dialog>

            {/* Post Modal */}
            <dialog ref={postDialogRef} className="modal">
                <div className="modal-box w-11/12 max-w-5xl h-[90vh] overflow-hidden flex flex-col p-0 bg-[#0F172A] rounded-2xl border-0">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 sticky top-0 z-20 bg-[#0F172A]">
                        <div>
                            <h3 className="font-bold text-2xl text-white">{editingPost ? "Edit Post" : "New Post"}</h3>
                            <p className="text-sm text-gray-400 mt-1">
                                {editingPost ? "Make changes to your existing post." : "Create a new blog post."}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsPostModalOpen(false)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form id="post-form" onSubmit={handleSavePost} className="space-y-6">
                            {editingPost && <input type="hidden" name="id" value={editingPost.id} />}

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                        <input
                                            name="title"
                                            type="text"
                                            defaultValue={editingPost?.title}
                                            required
                                            className="w-full h-12 px-4 bg-[#0A0E17] border-0 rounded-xl text-white text-lg placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Enter an engaging title..."
                                        />
                                    </div>

                                    <AutoSlugField name="slug" nameInputId="title" label="Slug" initialValue={editingPost?.slug ?? ""} />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                                        <div className="rounded-xl overflow-hidden border border-white/10 min-h-[400px]">
                                            <RichTextEditor
                                                name="content"
                                                initialHtml={editingPost?.content ?? ""}
                                                placeholder="Write your content here..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    <div className="bg-[#0A0E17] rounded-xl p-4 space-y-4">
                                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Publishing</h4>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-300">Published</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="isPublished"
                                                    className="sr-only peer"
                                                    defaultChecked={editingPost?.isPublished ?? true}
                                                />
                                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                            </label>
                                        </div>
                                        <span className="text-xs text-gray-500 block">
                                            Toggle to make this post visible immediately.
                                        </span>
                                    </div>

                                    <div className="bg-[#0A0E17] rounded-xl p-4 space-y-4">
                                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Featured Image</h4>
                                        <ImageUploadField id="post-image" name="imageUrl" label="" initialUrl={editingPost?.imageUrl} />
                                    </div>

                                    <div className="bg-[#0A0E17] rounded-xl p-4 space-y-4">
                                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Excerpt</h4>
                                        <textarea
                                            name="excerpt"
                                            className="w-full px-4 py-3 bg-[#0F172A] border-0 rounded-xl text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-32"
                                            defaultValue={editingPost?.excerpt ?? ""}
                                            placeholder="Write a short summary..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-[#0F172A]">
                        <button
                            type="button"
                            onClick={() => setIsPostModalOpen(false)}
                            className="h-11 px-5 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="post-form"
                            className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
                            disabled={busy}
                        >
                            {busy ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="h-4 w-4" />}
                            {busy ? "Saving..." : "Save Post"}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop bg-black/60">
                    <button onClick={() => setIsPostModalOpen(false)}>close</button>
                </form>
            </dialog>
            <dialog ref={confirmDialogRef} className="modal">
                <div className="modal-box bg-[#0F172A] border-0 text-white rounded-2xl">
                    <div className="flex flex-col items-center text-center gap-2 mb-4">
                        <AlertTriangle className="h-10 w-10 text-yellow-400" />
                        <h3 className="font-bold text-xl">Confirm Deletion</h3>
                        <p className="text-sm text-gray-400">
                            {confirmTarget?.kind === "post" ? "Are you sure you want to delete this post?" : "Delete this source?"}
                        </p>
                    </div>
                    <div className="flex justify-center gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={() => setIsConfirmOpen(false)}
                            className="h-10 px-4 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors inline-flex items-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            <span>Cancel</span>
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop bg-black/60">
                    <button onClick={() => setIsConfirmOpen(false)}>close</button>
                </form>
            </dialog>
        </div>
    );
}
