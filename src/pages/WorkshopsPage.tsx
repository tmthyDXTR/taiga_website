import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LogoHeader from "../components/LogoHeader";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Footer from "../components/Footer";
import "./WorkshopsPage.css";

function WorkshopsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const floatingNavRef = useRef<HTMLDivElement>(null);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [showFloatingNav, setShowFloatingNav] = useState(false);
    const [floatingNavOpen, setFloatingNavOpen] = useState(false);
    const [moreInfoOpen, setMoreInfoOpen] = useState(false);
    const moreInfoRef = useRef<HTMLDivElement>(null);

    // inject Stack Sans Text font and expose it globally
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
        const font =
            "'Stack Sans Text', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
        document.documentElement.style.setProperty("--stack-font", font);
        document.documentElement.style.fontFamily = font;
    }, []);

    // Show/hide back to top button and floating nav based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            setShowBackToTop(scrolled > 400);
            setShowFloatingNav(scrolled > 400);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Carousel state and auto-advance
    const carouselImages: string[] = [
        "Bildschirmfoto 2025-08-22 um 16.11.50.png",
        "Bildschirmfoto 2025-08-22 um 16.14.40 (1).png",
        "Bildschirmfoto 2025-08-22 um 16.15.09 (1).png",
        "Bildschirmfoto 2025-08-22 um 16.15.28.png",
        "Bildschirmfoto 2025-08-22 um 16.16.14.png",
    ];
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [carouselPaused, setCarouselPaused] = useState(false);

    useEffect(() => {
        if (carouselPaused) return undefined;
        const id = setInterval(() => {
            setCarouselIndex((i) => (i + 1) % carouselImages.length);
        }, 4000);
        return () => clearInterval(id);
    }, [carouselPaused, carouselImages.length]);

    // Close floating nav when clicking outside
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
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
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

    // Close more-info modal on Escape or clicking outside
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (moreInfoOpen && e.key === "Escape") setMoreInfoOpen(false);
        };
        const handleClick = (e: MouseEvent) => {
            if (
                moreInfoOpen &&
                moreInfoRef.current &&
                !moreInfoRef.current.contains(e.target as Node)
            ) {
                setMoreInfoOpen(false);
            }
        };
        document.addEventListener("keydown", handleKey);
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.removeEventListener("mousedown", handleClick);
        };
    }, [moreInfoOpen]);

    const scrollToSection = (sectionId: string) => {
        if (sectionId === "home") {
            navigate("/");
            return;
        }
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setFloatingNavOpen(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Navigation links for workshops page
    const navLinks = [
        { id: "home", labelKey: "navigation.backToTriangle", isBack: true },
        { id: "about", labelKey: "workshops.nav.about" },
        { id: "partners", labelKey: "workshops.nav.partners" },
        { id: "workshops", labelKey: "workshops.nav.workshops" },
    ];

    return (
        <div className={`workshops-page ${showFloatingNav ? 'floating-visible' : ''}`}>
            <LogoHeader text="TAIGA SESSIONS" />

            {/* Floating collapsed nav - shows after scrolling */}
            <div
                ref={floatingNavRef}
                className={`floating-nav ${showFloatingNav ? "visible" : ""}`}
            >
                <button
                    className="floating-nav-toggle"
                    onClick={() => setFloatingNavOpen(!floatingNavOpen)}
                    aria-label="Toggle navigation"
                >
                    {floatingNavOpen ? "✕" : "☰"}
                </button>
                <nav
                    className={`floating-nav-menu ${floatingNavOpen ? "open" : ""}`}
                >
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            className={`floating-nav-link ${link.isBack ? "back-link" : ""}`}
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

            {/* Back to top button */}
            <button
                className={`back-to-top ${showBackToTop ? "visible" : ""}`}
                onClick={scrollToTop}
                aria-label="Back to top"
            >
                ↑
            </button>

            {/* Header with stacked navigation (like Music page) */}
            <header className="workshops-header">
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

            {/* Main content */}
            <main className="workshops-content">
                {/* Hero section */}
                <section className="workshops-hero">
                    {/* Rotating carousel using gallery images */}
                    <div
                        className="hero-image-container hero-carousel"
                        onMouseEnter={() => setCarouselPaused(true)}
                        onMouseLeave={() => setCarouselPaused(false)}
                        onFocus={() => setCarouselPaused(true)}
                        onBlur={() => setCarouselPaused(false)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "ArrowLeft")
                                setCarouselIndex(
                                    (i) =>
                                        (i - 1 + carouselImages.length) %
                                        carouselImages.length,
                                );
                            if (e.key === "ArrowRight")
                                setCarouselIndex(
                                    (i) => (i + 1) % carouselImages.length,
                                );
                        }}
                    >
                        <div
                            className="slides"
                            style={{
                                transform: `translateX(-${carouselIndex * 100}%)`,
                            }}
                        >
                            {carouselImages.map((file) => (
                                <div
                                    className="slide"
                                    key={file}
                                    aria-hidden={
                                        carouselImages[carouselIndex] !== file
                                    }
                                >
                                    <img
                                        src={`/images/workshops-gallery/${encodeURIComponent(file)}`}
                                        alt={file.replace(
                                            /\.(png|jpg|jpeg)$/i,
                                            "",
                                        )}
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            className="carousel-prev"
                            onClick={() =>
                                setCarouselIndex(
                                    (i) =>
                                        (i - 1 + carouselImages.length) %
                                        carouselImages.length,
                                )
                            }
                            aria-label="Vorheriges Bild"
                        >
                            ‹
                        </button>
                        <button
                            className="carousel-next"
                            onClick={() =>
                                setCarouselIndex(
                                    (i) => (i + 1) % carouselImages.length,
                                )
                            }
                            aria-label="Nächstes Bild"
                        >
                            ›
                        </button>

                        <div
                            className="carousel-dots"
                            role="tablist"
                            aria-label="Bildnavigation"
                        >
                            {carouselImages.map((_, i) => (
                                <button
                                    key={i}
                                    className={`dot ${i === carouselIndex ? "active" : ""}`}
                                    onClick={() => setCarouselIndex(i)}
                                    aria-label={`Gehe zu Bild ${i + 1}`}
                                    aria-selected={i === carouselIndex}
                                    role="tab"
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Workshop info */}
                <section id="about" className="workshop-info">
                    <h3>
                        <span className="word-bg">
                            {t("workshops.aboutTitle")}
                        </span>
                    </h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <h4>
                                <span className="word-bg">
                                    {t(
                                        "workshops.about.professionalBackground.title",
                                    )}
                                </span>
                            </h4>
                            <p>
                                {t(
                                    "workshops.about.professionalBackground.description",
                                )}
                            </p>
                        </div>
                        <div className="info-item">
                            <h4>
                                <span className="word-bg">
                                    {t(
                                        "workshops.about.experiencePartnerships.title",
                                    )}
                                </span>
                            </h4>
                            <p>
                                {t(
                                    "workshops.about.experiencePartnerships.description",
                                )}
                            </p>
                        </div>
                        <div className="info-item">
                            <h4>
                                <span className="word-bg">
                                    {t("workshops.about.approachMethod.title")}
                                </span>
                            </h4>
                            <p>
                                {t(
                                    "workshops.about.approachMethod.description",
                                )}
                            </p>
                        </div>
                        <div className="info-item">
                            <h4>
                                <span className="word-bg">
                                    {t("workshops.about.visionImpact.title")}
                                </span>
                            </h4>
                            <p>
                                {t("workshops.about.visionImpact.description")}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Partners/Collaborators Section */}
                <section id="partners" className="partners-section">
                    <h3>
                        <span className="word-bg">
                            {t("workshops.partnersTitle")}
                        </span>
                    </h3>
                    <div className="partners-grid">
                        <div className="partner-logo">
                            <img
                                src="/images/company-logos/amnesty.png"
                                alt="Amnesty International"
                            />
                        </div>
                        <div className="partner-logo">
                            <img
                                src="/images/company-logos/goethe-institut.png"
                                alt="Goethe Institut"
                            />
                        </div>
                        <div className="partner-logo">
                            <img
                                src="/images/company-logos/vivaconagua.png"
                                alt="Viva con agua"
                            />
                        </div>
                        <div className="partner-logo">
                            <img
                                src="/images/company-logos/Microsoft-Logo.png"
                                alt="Microsoft"
                            />
                        </div>
                        <div className="partner-logo">IMMA</div>
                        <div className="partner-logo">Refugio</div>
                        <div className="partner-logo">Bellevue di Monaco</div>
                        <div className="partner-logo">Ya Basta</div>
                        <div className="partner-logo">
                            <img
                                src="/images/company-logos/ausArten-logo.svg"
                                alt="AusArten"
                            />
                        </div>
                        <div className="partner-logo">
                            <img
                                src="/images/company-logos/bavariancaps-logo.png"
                                alt="Bavarian Caps"
                            />
                        </div>

                        <div className="partner-logo">
                            <img
                                src="/images/company-logos/pwc.png"
                                alt="PWC"
                            />
                        </div>
                        <div className="partner-logo">PASCH Schulen</div>
                        <div className="partner-logo">
                            <img
                                src="/images/company-logos/eu.png"
                                alt="EU Delegation"
                            />
                        </div>
                        <div className="partner-logo">
                            <img
                                src="/images/company-logos/356femalemcs.png"
                                alt="356 Female Mcs"
                            />
                        </div>
                        <div className="partner-logo">
                            <img
                                src="/images/company-logos/voice-of-germany.jpg"
                                alt="The Voice of Germany"
                            />
                        </div>
                    </div>
                </section>

                {/* Available workshops */}
                <section id="workshops" className="workshops-listing">
                    <h3>
                        <span className="word-bg">
                            {t("workshops.focusAreasTitle")}
                        </span>
                    </h3>
                    <div className="workshops-grid">
                        <div className="workshop-item">
                            <div className="workshop-header">
                                <h4>
                                    <span className="word-bg">
                                        {t(
                                            "workshops.workshops.therapySession.title",
                                        )}
                                    </span>
                                </h4>
                                <div className="workshop-duration">
                                    {t(
                                        "workshops.workshops.therapySession.duration",
                                    )}
                                </div>
                            </div>
                            <div className="workshop-description">
                                <p>
                                    {t(
                                        "workshops.workshops.therapySession.description",
                                    )}
                                </p>
                            </div>
                            <div className="workshop-details">
                                <div className="workshop-price">
                                    {t(
                                        "workshops.workshops.therapySession.price",
                                    )}
                                </div>
                                <div className="workshop-location">
                                    {t(
                                        "workshops.workshops.therapySession.location",
                                    )}
                                </div>
                            </div>
                            <div className="workshop-note">
                                {t("workshops.workshops.therapySession.note")}
                            </div>
                            <div className="workshop-action">
                                <a
                                    href="mailto:workshops@taigatrece.com"
                                    className="register-button"
                                >
                                    {t("workshops.inquireButton")}
                                </a>
                            </div>
                        </div>

                        <div className="workshop-item">
                            <div className="workshop-header">
                                <h4>
                                    <span className="word-bg">
                                        {t(
                                            "workshops.workshops.mentalHealth.title",
                                        )}
                                    </span>
                                </h4>
                                <div className="workshop-duration">
                                    {t(
                                        "workshops.workshops.mentalHealth.duration",
                                    )}
                                </div>
                            </div>
                            <div className="workshop-description">
                                <p>
                                    {t(
                                        "workshops.workshops.mentalHealth.description",
                                    )}
                                </p>
                            </div>
                            <div className="workshop-details">
                                <div className="workshop-level">
                                    {t(
                                        "workshops.workshops.mentalHealth.level",
                                    )}
                                </div>
                            </div>
                            <div className="workshop-action">
                                <a
                                    href="mailto:workshops@taigatrece.com"
                                    className="register-button"
                                >
                                    {t("workshops.inquireButton")}
                                </a>
                            </div>
                        </div>

                        <div className="workshop-item">
                            <div className="workshop-header">
                                <h4>
                                    <span className="word-bg">
                                        {t("workshops.workshops.rapYoga.title")}
                                    </span>
                                </h4>
                                <div className="workshop-duration">
                                    {t("workshops.workshops.rapYoga.duration")}
                                </div>
                            </div>
                            <div className="workshop-description">
                                <p>
                                    {t(
                                        "workshops.workshops.rapYoga.description",
                                    )}
                                </p>
                            </div>
                            <div className="workshop-details">
                                <div className="workshop-level">
                                    {t("workshops.workshops.rapYoga.level")}
                                </div>
                            </div>
                            <div className="workshop-action">
                                <a
                                    href="mailto:workshops@taigatrece.com"
                                    className="register-button"
                                >
                                    {t("workshops.inquireButton")}
                                </a>
                            </div>
                        </div>

                        <div className="workshop-item">
                            <div className="workshop-header">
                                <h4>
                                    <span className="word-bg">
                                        {t(
                                            "workshops.workshops.selfAwareness.title",
                                        )}
                                    </span>
                                </h4>
                                <div className="workshop-duration">
                                    {t(
                                        "workshops.workshops.selfAwareness.duration",
                                    )}
                                </div>
                            </div>
                            <div className="workshop-description">
                                <p>
                                    {t(
                                        "workshops.workshops.selfAwareness.description",
                                    )}
                                </p>
                            </div>
                            <div className="workshop-details">
                                <div className="workshop-level">
                                    {t(
                                        "workshops.workshops.selfAwareness.level",
                                    )}
                                </div>
                            </div>
                            <div className="workshop-action">
                                <a
                                    href="mailto:workshops@taigatrece.com"
                                    className="register-button"
                                >
                                    {t("workshops.inquireButton")}
                                </a>
                            </div>
                        </div>

                        <div className="workshop-item">
                            <div className="workshop-header">
                                <h4>
                                    <span className="word-bg">
                                        {t(
                                            "workshops.workshops.businessSpecial.title",
                                        )}
                                    </span>
                                </h4>
                                <div className="workshop-duration">
                                    {t(
                                        "workshops.workshops.businessSpecial.duration",
                                    )}
                                </div>
                            </div>
                            <div className="workshop-description">
                                <p>
                                    {t(
                                        "workshops.workshops.businessSpecial.description",
                                    )}
                                </p>
                            </div>
                            <div className="workshop-details">
                                <div className="workshop-level">
                                    {t(
                                        "workshops.workshops.businessSpecial.level",
                                    )}
                                </div>
                            </div>
                            <div className="workshop-action">
                                <button
                                    type="button"
                                    className="more-info-button"
                                    onClick={() => setMoreInfoOpen(true)}
                                >
                                    {t(
                                        "workshops.workshops.businessSpecial.moreInfoButton",
                                    )}
                                </button>
                                <a
                                    href="mailto:workshops@taigatrece.com"
                                    className="register-button"
                                >
                                    {t("workshops.inquireButton")}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {moreInfoOpen && (
                <div
                    className="modal-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label={t(
                        "workshops.workshops.businessSpecial.moreInfoButton",
                    )}
                >
                    <div className="modal" ref={moreInfoRef}>
                        <button
                            className="modal-close"
                            aria-label="Schließen"
                            onClick={() => setMoreInfoOpen(false)}
                        >
                            ✕
                        </button>
                        <h3>
                            {t(
                                "workshops.workshops.businessSpecial.moreInfoButton",
                            )}
                        </h3>
                        <p>
                            {t(
                                "workshops.workshops.businessSpecial.moreInfoText",
                            )}
                        </p>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default WorkshopsPage;
