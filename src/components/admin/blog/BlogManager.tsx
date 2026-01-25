"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, X, Trash2, Globe, RefreshCw, Plus } from "lucide-react";
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

export function BlogManager({ posts, sources }: { posts: Post[]; sources: ScraperSource[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isScraping, setIsScraping] = useState(false);
    const [busy, setBusy] = useState(false);
    
    // Modal state
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const postDialogRef = useRef<HTMLDialogElement>(null);

    const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
    const sourceDialogRef = useRef<HTMLDialogElement>(null);
    const [editingSource, setEditingSource] = useState<ScraperSource | null>(null);

    // Check URL params for edit/create
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
            // Clean URL
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
                // Show toast?
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsScraping(false);
        }
    };

    const handleDeletePost = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
            router.refresh();
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteSource = async (id: string) => {
        if (!confirm("Delete this source?")) return;
        try {
            await fetch(`/api/admin/scraper?id=${id}`, { method: "DELETE" });
            router.refresh();
        } catch (e) {
            console.error(e);
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
        // Handle boolean checkbox
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
            <div className="card bg-base-100 shadow border border-base-200">
                <div className="card-body">
                    <h2 className="card-title flex justify-between">
                        <span>Auto-Scraper Sources</span>
                        <div className="flex gap-2">
                             <button 
                                onClick={() => setIsSourceModalOpen(true)}
                                className="btn btn-sm btn-outline gap-2"
                                disabled={sources.length >= 5}
                            >
                                <Plus className="h-4 w-4" /> Add Source ({sources.length}/5)
                            </button>
                            <button 
                                onClick={handleScrape}
                                disabled={isScraping || sources.length === 0}
                                className="btn btn-sm btn-primary gap-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${isScraping ? "animate-spin" : ""}`} />
                                {isScraping ? "Scraping..." : "Run Scraper Now"}
                            </button>
                        </div>
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Source Name / URL</th>
                                    <th>Interval</th>
                                    <th>Status</th>
                                    <th>Last Run</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sources.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center opacity-50">No sources configured. Add a URL like https://www.wowhead.com/news/rss</td>
                                    </tr>
                                )}
                                {sources.map(s => (
                                    <tr key={s.id}>
                                        <td>
                                            <div className="font-bold">{s.name}</div>
                                            <div className="text-xs opacity-50 truncate max-w-xs">{s.url}</div>
                                        </td>
                                        <td>
                                            <div className="text-sm">{s.scrapeInterval} min</div>
                                        </td>
                                        <td>
                                            <span className={`badge ${s.isActive ? "badge-success" : "badge-ghost"}`}>
                                                {s.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="text-xs opacity-70">
                                                {s.lastRunAt ? new Date(s.lastRunAt).toLocaleString() : "Never"}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button onClick={() => openEditSource(s)} className="btn btn-ghost btn-xs">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDeleteSource(s.id)} className="btn btn-ghost btn-xs text-error">
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
            <div className="card bg-base-100 shadow border border-base-200">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="card-title">Blog Posts</h2>
                        <button onClick={() => { setEditingPost(null); setIsPostModalOpen(true); }} className="btn btn-primary gap-2">
                            <Plus className="h-4 w-4" /> Create Manual Post
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Source</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map(post => (
                                    <tr key={post.id}>
                                        <td>
                                            <div className="font-bold">{post.title}</div>
                                            <div className="text-xs opacity-50">/{post.slug}</div>
                                        </td>
                                        <td>
                                            {post.sourceUrl ? (
                                                <a href={post.sourceUrl} target="_blank" className="flex items-center gap-1 text-xs text-blue-500 hover:underline">
                                                    <Globe className="h-3 w-3" /> Auto-Scraped
                                                </a>
                                            ) : (
                                                <span className="text-xs opacity-50">Manual</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge ${post.isPublished ? "badge-success" : "badge-warning"}`}>
                                                {post.isPublished ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="flex gap-2">
                                            <button onClick={() => { setEditingPost(post); setIsPostModalOpen(true); }} className="btn btn-ghost btn-xs">Edit</button>
                                            <button onClick={() => handleDeletePost(post.id)} className="btn btn-ghost btn-xs text-error"><Trash2 className="h-4 w-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                                {posts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 opacity-50">No posts found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
{editingSource ? "Edit Source" : ""}

            {/* Source Modal */}
            <dialog ref={sourceDialogRef} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add Scraper Source</h3>
                    <p className="py-2 text-sm opacity-70">Enter a valid RSS feed URL or website URL (e.g., https://www.wowhead.com/news/rss)</p>
                    <form onSubmit={handleAddSource} className="mt-4 space-y-4">
                        <input name="url" type="url" placeholder="https://..." required className="input input-bordered w-full" defaultValue={editingSource?.url ?? ""} />
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Scrape Interval</span>
                            </label>
                            <select name="interval" className="select select-bordered w-full" defaultValue={editingSource ? String(editingSource.scrapeInterval) : "60"}>
                                <option value="30">Every 30 minutes</option>
                                <option value="60">Every 1 hour</option>
                                <option value="180">Every 3 hours</option>
                                <option value="360">Every 6 hours</option>
                                <option value="720">Every 12 hours</option>
                                <option value="1440">Every 24 hours</option>
                            </select>
                        </div>

                        <div className="modal-action">
                             <button type="button" onClick={() => setIsSourceModalOpen(false)} className="btn btn-ghost">Cancel</button>
                             <button type="submit" className="btn btn-primary" disabled={busy}>Add Source</button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setIsSourceModalOpen(false)}>close</button>
                </form>
            </dialog>

            {/* Post Modal */}
            <dialog ref={postDialogRef} className="modal">
                <div className="modal-box w-11/12 max-w-5xl h-[90vh] overflow-hidden flex flex-col p-0 bg-base-100 rounded-2xl shadow-2xl">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-base-200 bg-base-100 sticky top-0 z-20">
                        <div>
                            <h3 className="font-bold text-2xl text-base-content">{editingPost ? "Edit Post" : "New Post"}</h3>
                            <p className="text-sm text-base-content/60 mt-1">
                                {editingPost ? "Make changes to your existing post." : "Create a new blog post to engage your audience."}
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsPostModalOpen(false)} 
                            className="btn btn-sm btn-circle btn-ghost hover:bg-base-200 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    
                    {/* Content - Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form id="post-form" onSubmit={handleSavePost} className="space-y-6">
                            {editingPost && <input type="hidden" name="id" value={editingPost.id} />}
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column: Main Content */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-base">Title</span>
                                        </label>
                                        <input 
                                            name="title" 
                                            type="text" 
                                            defaultValue={editingPost?.title} 
                                            required 
                                            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg placeholder:text-base-content/30" 
                                            placeholder="Enter an engaging title..." 
                                        />
                                    </div>

                                    <AutoSlugField name="slug" nameInputId="title" label="Slug" initialValue={editingPost?.slug ?? ""} />

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-base">Content</span>
                                        </label>
                                        <div className="border border-base-300 rounded-lg overflow-hidden min-h-[400px]">
                                            <RichTextEditor 
                                                name="content" 
                                                initialHtml={editingPost?.content ?? ""} 
                                                placeholder="Write your amazing content here..." 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Sidebar Settings */}
                                <div className="space-y-6">
                                    <div className="card bg-base-200/50 border border-base-200">
                                        <div className="card-body p-4 space-y-4">
                                            <h4 className="font-bold text-sm uppercase tracking-wider text-base-content/70">Publishing</h4>
                                            
                                            <div className="form-control">
                                                <label className="label cursor-pointer justify-between p-0">
                                                    <span className="label-text font-medium">Published</span>
                                                    <input 
                                                        type="checkbox" 
                                                        name="isPublished" 
                                                        className="toggle toggle-success toggle-sm" 
                                                        defaultChecked={editingPost?.isPublished ?? true} 
                                                    />
                                                </label>
                                                <span className="text-xs text-base-content/50 mt-2 block">
                                                    Toggle to make this post visible to the public immediately.
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card bg-base-200/50 border border-base-200">
                                        <div className="card-body p-4 space-y-4">
                                            <h4 className="font-bold text-sm uppercase tracking-wider text-base-content/70">Featured Image</h4>
                                            <div className="form-control w-full">
                                                <ImageUploadField id="post-image" name="imageUrl" label="" initialUrl={editingPost?.imageUrl} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card bg-base-200/50 border border-base-200">
                                        <div className="card-body p-4 space-y-4">
                                            <h4 className="font-bold text-sm uppercase tracking-wider text-base-content/70">Excerpt</h4>
                                            <div className="form-control">
                                                <textarea 
                                                    name="excerpt" 
                                                    className="textarea textarea-bordered h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm leading-relaxed" 
                                                    defaultValue={editingPost?.excerpt ?? ""} 
                                                    placeholder="Write a short summary (1-2 sentences) to appear in post previews..." 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer - Actions */}
                    <div className="p-4 border-t border-base-200 bg-base-100 flex justify-end gap-3 sticky bottom-0 z-20">
                         <button 
                            type="button" 
                            onClick={() => setIsPostModalOpen(false)} 
                            className="btn btn-ghost hover:bg-base-200"
                        >
                            Cancel
                        </button>
                         <button 
                            type="submit" 
                            form="post-form"
                            className="btn btn-primary min-w-[120px] shadow-lg shadow-primary/20" 
                            disabled={busy}
                        >
                            {busy ? <span className="loading loading-spinner loading-sm"></span> : <Save className="h-4 w-4" />}
                            {busy ? "Saving..." : "Save Post"}
                         </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setIsPostModalOpen(false)}>close</button>
                </form>
            </dialog>
        </div>
    );
}
