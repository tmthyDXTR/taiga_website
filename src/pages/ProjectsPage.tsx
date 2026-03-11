import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import LogoHeader from "../components/LogoHeader";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Footer from "../components/Footer";
import "./ProjectsPage.css";

function ProjectsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const floatingNavRef = useRef<HTMLDivElement>(null);
    const [showFloatingNav, setShowFloatingNav] = useState(false);
    const [floatingNavOpen, setFloatingNavOpen] = useState(false);

    useEffect(() => {
        const id = "stack-sans-text-font";
        if (!document.getElementById(id)) {
            const link = document.createElement("link");
            link.id = id;
            link.rel = "stylesheet";
            link.href =
                "https://fonts.googleapis.com/css2?family=Stack+Sans+Text:wght@300;400;600;700&display=swap";
            document.head.appendChild(link);
        }
        document.documentElement.style.setProperty(
            "--stack-font",
            "'Stack Sans Text', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        );
    }, []);

    // Show/hide floating nav on scroll and close when clicking outside
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            setShowFloatingNav(scrolled > 400);
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                floatingNavOpen &&
                floatingNavRef.current &&
                !floatingNavRef.current.contains(event.target as Node)
            ) {
                setFloatingNavOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [floatingNavOpen]);

    // Position floating nav so it sits exactly where the header language switcher is
    useEffect(() => {
        const updatePosition = () => {
            const headerControls = document.querySelector('.logo-container .header-controls') as HTMLElement | null;
            const btn = floatingNavRef.current;
            if (!btn) return;
            if (headerControls) {
                const rect = headerControls.getBoundingClientRect();
                const top = Math.max(8, rect.top + rect.height / 2 - btn.offsetHeight / 2);
                const right = Math.max(8, Math.round(window.innerWidth - rect.right));
                const maxTop = Math.max(8, window.innerHeight - btn.offsetHeight - 8);
                const clampedTop = Math.min(top, maxTop);
                btn.style.top = `${clampedTop}px`;
                btn.style.right = `${right}px`;
                btn.style.left = 'auto';
            } else {
                btn.style.top = '';
                btn.style.right = '';
                btn.style.left = '';
            }
        };
        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, { passive: true });
        const timeout = setTimeout(updatePosition, 300);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
            clearTimeout(timeout);
        };
    }, [floatingNavRef]);

    const scrollToSection = (sectionId: string) => {
        if (sectionId === "home") {
            navigate("/");
            return;
        }
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    const navLinks = [
        { id: "home", labelKey: "navigation.backToTriangle", isBack: true },
        { id: "projects", labelKey: "projects.pageTitle" },
        { id: "collab", labelKey: "music.nav.collab" },
    ];

    return (
        <div className={`projects-page ${showFloatingNav ? 'floating-visible' : ''}`}>
            <LogoHeader text="TAIGA PROJECTS" />
            <div ref={floatingNavRef} className={`floating-nav ${showFloatingNav ? 'visible' : ''}`}>
              <button 
                className="floating-nav-toggle"
                onClick={() => setFloatingNavOpen(!floatingNavOpen)}
                aria-label="Toggle navigation"
              >
                {floatingNavOpen ? '✕' : '☰'}
              </button>
              <nav className={`floating-nav-menu ${floatingNavOpen ? 'open' : ''}`}>
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    className={`floating-nav-link ${link.isBack ? 'back-link' : ''}`}
                    onClick={() => scrollToSection(link.id)}
                  >
                    {t(link.labelKey)}
                  </button>
                ))}
                <div className="floating-nav-divider"></div>
                <div className="floating-nav-language">
                  <LanguageSwitcher />
                </div>
              </nav>
            </div>

            <header className="projects-header workshops-header">
                <nav className="section-nav">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            className={`nav-link ${link.isBack ? "back-link" : ""}`}
                            onClick={() => scrollToSection(link.id)}
                        >
                            {t(link.labelKey)}
                        </button>
                    ))}
                </nav>
            </header>

            <main className="projects-content">
                <div className="projects-list">
                    <article className="project-card">
                        <h2 className="project-title">
                            <span className="word-bg">
                                {t("projects.project1.title")}
                            </span>
                        </h2>
                        <p className="project-text">
                            {t("projects.project1.body")}
                        </p>
                        {/* <div className="project-action">
              <a className="project-link" href="#" aria-hidden>
                {t('projects.readMore')}
              </a>
            </div> */}
                    </article>

                    <article className="project-card">
                        <h2 className="project-title">
                            <span className="word-bg">
                                {t("projects.project2.title")}
                            </span>
                        </h2>
                        <p className="project-text">
                            {t("projects.project2.body")}
                        </p>
                        {/* <div className="project-action">
              <a className="project-link" href="#" aria-hidden>
                {t('projects.readMore')}
              </a>
            </div> */}
                    </article>

                    <article className="project-card">
                        <h2 className="project-title">
                            <span className="word-bg">
                                {t("projects.project3.title")}
                            </span>
                        </h2>
                        <p
                            className="project-text"
                            dangerouslySetInnerHTML={{
                                __html: t("projects.project3.bodyHTML"),
                            }}
                        />
                        <div className="videos-grid">
                            {[
                                { id: "zw7kGcapbPw", title: "Gangsterrap" },
                                { id: "ToGCaJnkHgo", title: "Mezcal" },
                                {
                                    id: "A09m4Y_bJKc",
                                    title: "Welcome to Mexico City",
                                },
                            ].map((v) => (
                                <div className="video-item" key={v.id}>
                                    <div className="video-wrapper">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${v.id}`}
                                            title={v.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                    <div className="video-title">{v.title}</div>
                                </div>
                            ))}
                        </div>
                    </article>

                    <article className="project-card">
                        <h2 className="project-title">
                            <span className="word-bg">
                                {t("projects.project4.title")}
                            </span>
                        </h2>
                        <p
                            className="project-text"
                            dangerouslySetInnerHTML={{
                                __html: t("projects.project4.bodyHTML"),
                            }}
                        />
                        <div className="videos-grid small">
                            {[
                                { id: "CXHvvG-CE3Q", title: "Artist Talk 1" },
                                { id: "pFVJosqAaCM", title: "Artist Talk 2" },
                            ].map((v) => (
                                <div className="video-item" key={v.id}>
                                    <div className="video-wrapper">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${v.id}`}
                                            title={v.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                    <div className="video-title">{v.title}</div>
                                </div>
                            ))}
                        </div>
                    </article>
                </div>
            </main>

            {/* Creator Collab Section */}
            <section id="collab" className="collab-section">
              <div className="section-container">
                <h2 className="section-title">{t('music.nav.collab')}</h2>
                <div className="collab-content">
                  <p className="collab-text">{t('music.collabDescription')}</p>
                  <a
                    href="mailto:andre.lang@bavarian-caps.de?subject=Creator%20Collaboration%20-%20Taiga%20Trece"
                    className="collab-button"
                  >
                    {t('music.collabButton')}
                  </a>
                </div>
              </div>
            </section>

            <Footer />
        </div>
    );
}

export default ProjectsPage;
