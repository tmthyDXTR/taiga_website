import { useCallback, useEffect, useRef, useState } from "react";
import "./AdminPage.css";
import "./ProjectsPage.css";
import "./BlogPage.css";

interface Post {
    id: number;
    title: string;
    content: string;
    published: number | boolean;
    published_at: string;
    created_at: string;
}

interface Draft {
    id?: number;
    title: string;
    content: string;
    published: boolean;
    published_at?: string;
}

const emptyDraft: Draft = { title: "", content: "", published: false };

async function api(url: string, init?: RequestInit) {
    const res = await fetch(url, { credentials: "same-origin", ...init });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
    return data;
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
});

function AdminPage() {
    const [admin, setAdmin] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");
    const [posts, setPosts] = useState<Post[]>([]);
    const [draft, setDraft] = useState<Draft | null>(null);
    const [error, setError] = useState("");
    const [importing, setImporting] = useState(false);
    const [importLog, setImportLog] = useState<string[]>([]);
    const [importPublish, setImportPublish] = useState(true);
    const textRef = useRef<HTMLTextAreaElement>(null);

    const loadPosts = useCallback(async () => {
        setPosts(await api("/api/posts.php?all=1"));
    }, []);

    useEffect(() => {
        api("/api/auth.php")
            .then((d) => setAdmin(d.admin))
            .catch(() => setAdmin(false));
    }, []);

    useEffect(() => {
        if (admin) loadPosts().catch((e) => setError(e.message));
    }, [admin, loadPosts]);

    const run = async (fn: () => Promise<void>) => {
        setError("");
        try {
            await fn();
        } catch (e) {
            setError((e as Error).message);
        }
    };

    const login = (e: React.FormEvent) => {
        e.preventDefault();
        run(async () => {
            await api("/api/auth.php", jsonInit("POST", { password }));
            setPassword("");
            setAdmin(true);
        });
    };

    const logout = () =>
        run(async () => {
            await api("/api/auth.php", { method: "DELETE" });
            setAdmin(false);
            setDraft(null);
        });

    const save = () =>
        run(async () => {
            if (!draft) return;
            await api(
                "/api/posts.php",
                jsonInit(draft.id ? "PUT" : "POST", draft),
            );
            setDraft(null);
            await loadPosts();
        });

    const remove = (p: Post) =>
        run(async () => {
            if (!confirm(`Delete "${p.title}"?`)) return;
            await api(`/api/posts.php?id=${p.id}`, { method: "DELETE" });
            await loadPosts();
        });

    const importFiles = async (files: FileList | null) => {
        if (!files?.length) return;
        setImporting(true);
        setImportLog([]);
        setError("");
        try {
            const all = Array.from(files).sort((a, b) =>
                a.name.localeCompare(b.name),
            );
            const counts: Record<string, number> = {};
            const failed: string[] = [];
            // Small batches keep each request under PHP's post_max_size.
            for (let i = 0; i < all.length; i += 5) {
                const batch = await Promise.all(
                    all.slice(i, i + 5).map(async (f) => ({
                        name: f.name,
                        html: await f.text(),
                    })),
                );
                const { results } = await api(
                    "/api/import.php",
                    jsonInit("POST", { files: batch, publish: importPublish }),
                );
                for (const r of results as { name: string; status: string }[]) {
                    counts[r.status] = (counts[r.status] ?? 0) + 1;
                    if (r.status === "error") failed.push(r.name);
                }
            }
            setImportLog([
                `Imported: ${counts.imported ?? 0}, skipped (already in DB): ${counts.skipped ?? 0}, failed: ${counts.error ?? 0}`,
                ...failed.map((n) => `Failed: ${n}`),
            ]);
            await loadPosts();
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setImporting(false);
        }
    };

    const wrap = (open: string, close: string) => {
        const el = textRef.current;
        if (!el || !draft) return;
        const { selectionStart: s, selectionEnd: e, value } = el;
        const content =
            value.slice(0, s) + open + value.slice(s, e) + close + value.slice(e);
        setDraft({ ...draft, content });
        requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(s + open.length, e + open.length);
        });
    };

    const link = () => {
        const url = prompt("URL (https://...)");
        if (url) wrap(`<a href="${url.replace(/"/g, "&quot;")}">`, "</a>");
    };

    const uploadImage = (file?: File) =>
        run(async () => {
            if (!file) return;
            const form = new FormData();
            form.append("image", file);
            const { url } = await api("/api/upload.php", {
                method: "POST",
                body: form,
            });
            wrap(`<img src="${url}" alt="" />`, "");
        });

    if (admin === null) return <div className="admin-page" />;

    if (!admin) {
        return (
            <div className="admin-page">
                <form className="admin-card admin-login" onSubmit={login}>
                    <h1>Admin</h1>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                    />
                    <button type="submit">Login</button>
                    {error && <p className="admin-error">{error}</p>}
                </form>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-card">
                <header className="admin-header">
                    <h1>Taiga Blog Editor</h1> 
                    <span>version 0.1 - 30.10.2026</span>
                    <div>
                        <button onClick={() => setDraft({ ...emptyDraft })}>
                            New post
                        </button>{" "}
                        <button onClick={logout}>Logout</button>
                    </div>
                </header>
                {error && <p className="admin-error">{error}</p>}

                {draft ? (
                    <div className="admin-editor">
                        <input
                            placeholder="Title"
                            value={draft.title}
                            onChange={(e) =>
                                setDraft({ ...draft, title: e.target.value })
                            }
                        />
                        <label>
                            Date{" "}
                            <input
                                type="datetime-local"
                                value={(draft.published_at ?? "").slice(0, 16).replace(" ", "T")}
                                onChange={(e) =>
                                    setDraft({ ...draft, published_at: e.target.value })
                                }
                            />
                        </label>
                        <div className="admin-toolbar">
                            <button type="button" onClick={() => wrap("<b>", "</b>")}>B</button>
                            <button type="button" onClick={() => wrap("<i>", "</i>")}>I</button>
                            <button type="button" onClick={() => wrap("<u>", "</u>")}>U</button>
                            <button type="button" onClick={() => wrap("<h2>", "</h2>")}>H2</button>
                            <button type="button" onClick={() => wrap("<p>", "</p>")}>P</button>
                            <button type="button" onClick={() => wrap("<ul>\n<li>", "</li>\n</ul>")}>List</button>
                            <button type="button" onClick={() => wrap("<blockquote>", "</blockquote>")}>Quote</button>
                            <button type="button" onClick={link}>Link</button>
                            <label className="admin-upload">
                                Image
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    hidden
                                    onChange={(e) => {
                                        uploadImage(e.target.files?.[0]);
                                        e.target.value = "";
                                    }}
                                />
                            </label>
                        </div>
                        <textarea
                            ref={textRef}
                            rows={14}
                            value={draft.content}
                            onChange={(e) =>
                                setDraft({ ...draft, content: e.target.value })
                            }
                        />
                        <div className="blog-view blog-preview">
                            <div className="blog-preview-inner">
                                <h2 className="project-title">
                                    <span className="word-bg">
                                        {draft.title || "Title"}
                                    </span>
                                </h2>
                                <div className="blog-date">
                                    {new Date(
                                        (draft.published_at || new Date().toISOString())
                                            .slice(0, 19)
                                            .replace(" ", "T"),
                                    ).toLocaleDateString(undefined, {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </div>
                                <div
                                    className="project-text blog-content"
                                    dangerouslySetInnerHTML={{ __html: draft.content }}
                                />
                            </div>
                        </div>
                        <label>
                            <input
                                type="checkbox"
                                checked={draft.published}
                                onChange={(e) =>
                                    setDraft({
                                        ...draft,
                                        published: e.target.checked,
                                    })
                                }
                            />{" "}
                            Published
                        </label>
                        <div>
                            <button onClick={save}>Save</button>{" "}
                            <button onClick={() => setDraft(null)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <>
                    <ul className="admin-list">
                        {posts.map((p) => (
                            <li key={p.id}>
                                <span>
                                    {p.title}{" "}
                                    <small>
                                        {Number(p.published) ? "published" : "draft"} ·{" "}
                                        {p.published_at.slice(0, 10)}
                                    </small>
                                </span>
                                <span>
                                    <button
                                        onClick={() =>
                                            setDraft({
                                                id: p.id,
                                                title: p.title,
                                                content: p.content,
                                                published: !!Number(p.published),
                                                published_at: p.published_at,
                                            })
                                        }
                                    >
                                        Edit
                                    </button>{" "}
                                    <button onClick={() => remove(p)}>Delete</button>
                                </span>
                            </li>
                        ))}
                        {posts.length === 0 && <li>No posts yet.</li>}
                    </ul>
                    
                    <div className="admin-import">
                        <h2>Import WordPress HTML files</h2>
                        <label className="admin-upload">
                            {importing ? "Importing…" : "Select files"}
                            <input
                                type="file"
                                accept=".html"
                                multiple
                                hidden
                                disabled={importing}
                                onChange={(e) => {
                                    importFiles(e.target.files);
                                    e.target.value = "";
                                }}
                            />
                        </label>{" "}
                        <label>
                            <input
                                type="checkbox"
                                checked={importPublish}
                                onChange={(e) => setImportPublish(e.target.checked)}
                            />{" "}
                            Publish imported posts
                        </label>
                        {importLog.map((l) => (
                            <p key={l}>{l}</p>
                        ))}
                    </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminPage;
