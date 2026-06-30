import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import "./WorkshopsPage.css";

type TickerItem = { img: string; alt: string } | { label: string }
const tickerItems: TickerItem[] = [
    { img: "/images/company-logos/amnesty.png", alt: "Amnesty International" },
    { img: "/images/company-logos/goethe-institut.png", alt: "Goethe Institut" },
    { img: "/images/company-logos/vivaconagua.png", alt: "Viva con agua" },
    { img: "/images/company-logos/Microsoft-Logo.png", alt: "Microsoft" },
    { label: "IMMA" },
    { label: "Refugio" },
    { label: "Bellevue di Monaco" },
    { label: "Ya Basta" },
    { img: "/images/company-logos/ausArten-logo.svg", alt: "AusArten" },
    { img: "/images/company-logos/pwc.png", alt: "PWC" },
    { label: "PASCH Schulen" },
    { img: "/images/company-logos/eu.png", alt: "EU Delegation" },
    { img: "/images/company-logos/356femalemcs.png", alt: "356 Female Mcs" },
    { img: "/images/company-logos/voice-of-germany.jpg", alt: "The Voice of Germany" },
]

const workshopKeys = [
    "therapySession",
    "mentalHealth",
    "rapYoga",
    "selfAwareness",
    "businessSpecial",
] as const

function WorkshopsPage() {
    const { t } = useTranslation();
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [moreInfoOpen, setMoreInfoOpen] = useState(false);
    const moreInfoRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const wsStartX = useRef<number>(0);
    const [workshopIndex, setWorkshopIndex] = useState(0);

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

    // Show/hide back to top button based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            setShowBackToTop(scrolled > 400);
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
        }, 5000);
        return () => clearInterval(id);
    }, [carouselPaused, carouselImages.length]);

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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Navigation links for workshops page
    const heroParagraphs = [
        { titleKey: "workshops.about.visionImpact.title", descKey: "workshops.about.visionImpact.description" },
        { titleKey: "workshops.about.approachMethod.title", descKey: "workshops.about.approachMethod.description" },
        { titleKey: "workshops.about.professionalBackground.title", descKey: "workshops.about.professionalBackground.description" },
        { titleKey: "workshops.about.experiencePartnerships.title", descKey: "workshops.about.experiencePartnerships.description" },
    ];

    return (
        <div className="workshops-page">
            {/* Back to top button */}
            <button
                className={`back-to-top ${showBackToTop ? "visible" : ""}`}
                onClick={scrollToTop}
                aria-label="Back to top"
            >
                ↑
            </button>

            {/* Full-screen hero carousel with text overlays */}
            <section
                id="about"
                className="workshops-hero-full"
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
                onTouchStart={(e) => {
                    touchStartX.current = e.changedTouches[0].clientX;
                }}
                onTouchEnd={(e) => {
                    const diff =
                        touchStartX.current - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 40) {
                        if (diff > 0)
                            setCarouselIndex(
                                (i) => (i + 1) % carouselImages.length,
                            );
                        else
                            setCarouselIndex(
                                (i) =>
                                    (i - 1 + carouselImages.length) %
                                    carouselImages.length,
                            );
                    }
                }}
            >
                {/* Auto-scrolling references ticker */}
                <div className="references-ticker" aria-hidden="true">
                    <div className="ticker-track">
                        {[...tickerItems, ...tickerItems].map((item, idx) => (
                            <div key={idx} className="ticker-item">
                                {"img" in item ? (
                                    <img src={item.img} alt={item.alt} />
                                ) : (
                                    <span>{item.label}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className="slides-hero"
                    style={{
                        transform: `translateX(-${carouselIndex * 100}%)`,
                    }}
                >
                    {carouselImages.map((file, i) => (
                        <div
                            className="slide-hero"
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
                                loading={i === 0 ? "eager" : "lazy"}
                            />
                            {i < heroParagraphs.length && (
                                <div className="slide-text-overlay">
                                    <h4>
                                        <span className="word-bg">
                                            {t(heroParagraphs[i].titleKey)}
                                        </span>
                                    </h4>
                                    <p>{t(heroParagraphs[i].descKey)}</p>
                                </div>
                            )}
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
            </section>

            {/* Full-screen workshops carousel */}
            <section
                id="workshops"
                className="workshops-carousel-section"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "ArrowLeft")
                        setWorkshopIndex(
                            (i) =>
                                (i - 1 + workshopKeys.length) %
                                workshopKeys.length,
                        );
                    if (e.key === "ArrowRight")
                        setWorkshopIndex(
                            (i) => (i + 1) % workshopKeys.length,
                        );
                }}
                onTouchStart={(e) => {
                    wsStartX.current = e.changedTouches[0].clientX;
                }}
                onTouchEnd={(e) => {
                    const diff =
                        wsStartX.current - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 40) {
                        if (diff > 0)
                            setWorkshopIndex(
                                (i) => (i + 1) % workshopKeys.length,
                            );
                        else
                            setWorkshopIndex(
                                (i) =>
                                    (i - 1 + workshopKeys.length) %
                                    workshopKeys.length,
                            );
                    }
                }}
            >
                <div
                    className="workshops-slides-track"
                    style={{
                        transform: `translateX(-${workshopIndex * 100}%)`,
                    }}
                >
                    {workshopKeys.map((key, i) => (
                        <div className="workshop-slide" key={key}>
                            <div className="workshop-slide-content">
                                <div className="ws-slide-number">
                                    {String(i + 1).padStart(2, "0")} /{" "}
                                    {String(workshopKeys.length).padStart(
                                        2,
                                        "0",
                                    )}
                                </div>
                                <h4>
                                    <span className="word-bg">
                                        {t(
                                            `workshops.workshops.${key}.title`,
                                        )}
                                    </span>
                                </h4>
                                <div className="ws-duration">
                                    {t(
                                        `workshops.workshops.${key}.duration`,
                                    )}
                                </div>
                                {t(
                                    `workshops.workshops.${key}.description`,
                                ) && (
                                    <p className="ws-description">
                                        {t(
                                            `workshops.workshops.${key}.description`,
                                        )}
                                    </p>
                                )}
                                {key === "therapySession" && (
                                    <>
                                        <div className="ws-price">
                                            {t(
                                                "workshops.workshops.therapySession.price",
                                            )}
                                        </div>
                                        <div className="ws-location">
                                            {t(
                                                "workshops.workshops.therapySession.location",
                                            )}
                                        </div>
                                        <div className="ws-note">
                                            {t(
                                                "workshops.workshops.therapySession.note",
                                            )}
                                        </div>
                                    </>
                                )}
                                {key !== "therapySession" && (
                                    <div className="ws-level">
                                        {t(
                                            `workshops.workshops.${key}.level`,
                                        )}
                                    </div>
                                )}
                                <div className="ws-actions">
                                    {key === "businessSpecial" && (
                                        <button
                                            type="button"
                                            className="more-info-button"
                                            onClick={() =>
                                                setMoreInfoOpen(true)
                                            }
                                        >
                                            {t(
                                                "workshops.workshops.businessSpecial.moreInfoButton",
                                            )}
                                        </button>
                                    )}
                                    <a
                                        href="mailto:workshops@taigatrece.com"
                                        className="register-button"
                                    >
                                        {t("workshops.inquireButton")}
                                    </a>
                                </div>
                            </div>
                            <div className="ws-bg-number" aria-hidden="true">
                                {String(i + 1).padStart(2, "0")}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="carousel-prev"
                    onClick={() =>
                        setWorkshopIndex(
                            (i) =>
                                (i - 1 + workshopKeys.length) %
                                workshopKeys.length,
                        )
                    }
                    aria-label="Vorheriger Workshop"
                >
                    ‹
                </button>
                <button
                    className="carousel-next"
                    onClick={() =>
                        setWorkshopIndex(
                            (i) => (i + 1) % workshopKeys.length,
                        )
                    }
                    aria-label="Nächster Workshop"
                >
                    ›
                </button>

                <div
                    className="carousel-dots"
                    role="tablist"
                    aria-label="Workshop-Navigation"
                >
                    {workshopKeys.map((_, i) => (
                        <button
                            key={i}
                            className={`dot ${
                                i === workshopIndex ? "active" : ""
                            }`}
                            onClick={() => setWorkshopIndex(i)}
                            aria-label={`Gehe zu Workshop ${i + 1}`}
                            aria-selected={i === workshopIndex}
                            role="tab"
                        />
                    ))}
                </div>
            </section>

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
