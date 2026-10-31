import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import "./ProjectsPage.css";
import "./AdminPage.css";
import "./BlogPage.css";

interface Post {
    id: number;
    title: string;
    content: string;
    published_at: string;
}

const PREVIEW_CHARS = 280;

function preview(html: string) {
    const text = new DOMParser()
        .parseFromString(html, "text/html")
        .body.textContent?.replace(/\s+/g, " ")
        .trim() ?? "";
    return text.length > PREVIEW_CHARS
        ? text.slice(0, PREVIEW_CHARS).trimEnd() + "…"
        : text;
}

function BlogPage() {
    const { i18n } = useTranslation();
    const [posts, setPosts] = useState<Post[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);

    const formatDate = (d: string) =>
        new Date(d.replace(" ", "T")).toLocaleDateString(i18n.language, {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    useEffect(() => {
        fetch("/api/posts.php")
            .then((r) => (r.ok ? r.json() : []))
            .then(setPosts)
            .catch(() => setPosts([]));
    }, []);

    useEffect(() => {
        if (openId === null) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [openId]);

    const open = posts.find((p) => p.id === openId);

    return (
        <div className="projects-page">
            <main className="projects-content">
                <div className="projects-list">
                    {posts.map((p) => (
                        <article className="project-card" key={p.id}>
                            <h2 className="project-title">
                                <span className="word-bg">{p.title}</span>
                            </h2>
                            <div className="blog-date">
                                {formatDate(p.published_at)}
                            </div>
                            <p className="project-text">{preview(p.content)}</p>
                            <button
                                className="blog-read-more"
                                onClick={() => setOpenId(p.id)}
                            >
                                READ MORE
                            </button>
                        </article>
                    ))}
                </div>
            </main>

            {open &&
                createPortal(
                    <div className="blog-overlay blog-view" role="dialog" aria-modal="true">
                        <div className="blog-overlay-bar">
                            <button
                                className="blog-read-more"
                                onClick={() => setOpenId(null)}
                            >
                                CLOSE ✕
                            </button>
                        </div>
                        <div className="blog-overlay-body">
                            <h2 className="project-title">
                                <span className="word-bg">{open.title}</span>
                            </h2>
                            <div className="blog-date">
                                {formatDate(open.published_at)}
                            </div>
                            <div
                                className="project-text blog-content"
                                dangerouslySetInnerHTML={{ __html: open.content }}
                            />
                        </div>
                    </div>,
                    document.body,
                )}
            <Footer />
        </div>
    );
}

export default BlogPage;
