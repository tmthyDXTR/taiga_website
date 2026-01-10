import { useTranslation } from 'react-i18next'
import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoHeader from '../components/LogoHeader'
import LanguageSwitcher from '../components/LanguageSwitcher'
import Footer from '../components/Footer'
import './MusicPage.css'

function MusicPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  // const menuLinkRef = useRef<HTMLAnchorElement>(null)
  const floatingNavRef = useRef<HTMLDivElement>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showFloatingNav, setShowFloatingNav] = useState(false)
  const [floatingNavOpen, setFloatingNavOpen] = useState(false)
  const [showAllVideos, setShowAllVideos] = useState(false)

  // inject Stack Sans Text font and expose it globally
  useEffect(() => {
    const id = 'stack-sans-text-font'
    if (!document.getElementById(id)) {
      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Stack+Sans+Text:wght@300;400;600;700&display=swap'
      document.head.appendChild(link)
    }
    const font = "'Stack Sans Text', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    document.documentElement.style.setProperty('--stack-font', font)
    // also set font-family directly so this page picks it up immediately
    document.documentElement.style.fontFamily = font
  }, [])

  // Show/hide back to top button and floating nav based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      setShowBackToTop(scrolled > 400)
      // Show floating nav at the same time as back to top
      setShowFloatingNav(scrolled > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close floating nav when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (floatingNavOpen && floatingNavRef.current && !floatingNavRef.current.contains(event.target as Node)) {
        setFloatingNavOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [floatingNavOpen])

  // const handleVinylClick = () => {
  //   menuLinkRef.current?.click()
  // }

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'home') {
      navigate('/')
      return
    }
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setFloatingNavOpen(false) // close floating nav after clicking
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goHome = () => {
    navigate('/')
  }

  // Navigation links data
  const navLinks = [
    { id: 'home', labelKey: 'navigation.backToTriangle', isBack: true },
    { id: 'about', labelKey: 'music.nav.about' },
    { id: 'videos', labelKey: 'music.nav.videos' },
    { id: 'gallery', labelKey: 'music.nav.gallery' },
    { id: 'book', labelKey: 'music.nav.book' },
    { id: 'collab', labelKey: 'music.nav.collab' },
    { id: 'tickets', labelKey: 'music.nav.tickets' },
    // { id: 'shop', labelKey: 'music.nav.shop' },
  ]

  return (
    <div className="music-page">
      {/* TAIGA Logo - Unified component */}
      <LogoHeader clickable onClick={goHome} />
      
      {/* Floating collapsed nav - shows after scrolling past hero */}
      <div ref={floatingNavRef} className={`floating-nav ${showFloatingNav ? 'visible' : ''}`}>
        <button 
          className="floating-nav-toggle"
          onClick={() => setFloatingNavOpen(!floatingNavOpen)}
          aria-label="Toggle navigation"
        >
          {floatingNavOpen ? '✕' : '☰'}
        </button>
        <nav className={`floating-nav-menu ${floatingNavOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <button
              key={link.id}
              className={`floating-nav-link ${link.id === 'book' ? 'book-link' : ''} ${link.isBack ? 'back-link' : ''}`}
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
      
      {/* Hero section with vinyl */}
      <section className="music-hero">
        {/* Section navigation - above vinyl */}
        <nav className="section-nav">
          {navLinks.map(link => (
            <button
              key={link.id}
              className={`nav-link ${link.id === 'book' ? 'book-link' : ''} ${link.isBack ? 'back-link' : ''}`}
              onClick={() => scrollToSection(link.id)}
            >
              {t(link.labelKey)}
            </button>
          ))}
        </nav>
        
        {/* Social icons beneath nav */}
        <div className="social-icons">
          <a href="https://open.spotify.com/album/7i9bv2pwRWZ2qUwWE7cR6c" target="_blank" rel="noopener noreferrer" title="Spotify" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          </a>
          <a href="https://www.instagram.com/taiga_trece/" target="_blank" rel="noopener noreferrer" title="Instagram" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://www.facebook.com/lacholemana/" target="_blank" rel="noopener noreferrer" title="Facebook" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://taiga13.bandcamp.com/track/manege-frei" target="_blank" rel="noopener noreferrer" title="Bandcamp" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 18.75l7.437-13.5H24l-7.438 13.5H0z"/></svg>
          </a>
          <a href="https://www.youtube.com/user/taigatrece" target="_blank" rel="noopener noreferrer" title="YouTube" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>

        {/* Vinyl record and album cover container */}
        <div className="vinyl-container">
          {/* Vinyl disc (slides out on hover) - triggers menu link click */}
          {/* <div 
            className="vinyl-disc"
            onClick={handleVinylClick}
          ></div> */}
          
          {/* Album cover (stays in place) */}
          <img 
            src="./taiga-transp.png" 
            alt="Taiga" 
            className="album-cover"
          />
          
          {/* Hover trigger area - rightmost 20% */}
          <div className="vinyl-hover-trigger"></div>
        </div>
      </section>
      <main className="music-content">
        {/* About Section */}
        <section id="about" className="music-section about-section">
          <div className="section-container">
            <h2 className="section-title">{t('music.aboutTitle')}</h2>
            <div className="about-content">
              <p className="about-text" style={{ whiteSpace: 'pre-line' }}>
                {t('music.aboutText')}
              </p>
            </div>
          </div>
        </section>

        {/* Videos Section */}
        <section id="videos" className="music-section videos-section">
          <div className="section-container">
            <h2 className="section-title">{t('music.nav.videos')}</h2>
            <div className="videos-grid">
              {[
                { id: 'RSzLTIsTkkM', title: 'Lass die Hexe brennen' },
                { id: 'sGi7dlfZp-I', title: 'Mein Weg' },
                { id: 'NO0oa8WHxMA', title: 'Im Barrio' },
                { id: 'xrYtZUFB4QE', title: 'Image (Official Video)' },
                { id: 'Lt7W_Mu1EXE', title: 'The Voice of Germany' },
                { id: 'fKfno6LTPZM', title: 'Gangstarap Reportage' },
                { id: 'A09m4Y_bJKc', title: 'Welcome to Mexico City' }
              ]
              .slice(0, showAllVideos ? undefined : 3)
              .map(video => (
                <div className="video-item" key={video.id}>
                  <div className="video-wrapper">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <h3 className="video-title">{video.title}</h3>
                  <a
                    className="video-link"
                    href={`https://youtu.be/${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open on YouTube
                  </a>
                </div>
              ))}
            </div>
            {!showAllVideos && (
              <button 
                className="watch-more-btn"
                onClick={() => setShowAllVideos(true)}
              >
                Watch More
              </button>
            )}
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="music-section gallery-section">
          <div className="section-container">
            <h2 className="section-title">{t('music.nav.gallery')}</h2>
            <div className="gallery-grid">
              <div className="gallery-img-wrapper"><img src="/images/gallery/Taiga_Trece_Presse©Nils_Schwarz.jpg" alt="Taiga Trece Press Photo" className="gallery-img" /></div>
              <div className="gallery-img-wrapper"><img src="/images/gallery/PREVIEW_Taiga-Trece__A2A9948.jpg" alt="Taiga Trece" className="gallery-img" /></div>
              <div className="gallery-img-wrapper"><img src="/images/gallery/Taiga-Trece_Nils-Schwarz_MG_6445.jpg" alt="Taiga Trece" className="gallery-img" /></div>
              <div className="gallery-img-wrapper"><img src="/images/gallery/_MG_9330_1.jpg" alt="Taiga Trece" className="gallery-img" /></div>
              <div className="gallery-img-wrapper"><img src="/images/gallery/_MG_9353.jpg" alt="Taiga Trece" className="gallery-img" /></div>
              <div className="gallery-img-wrapper"><img src="/images/gallery/_MG_9429_1.jpg" alt="Taiga Trece" className="gallery-img" /></div>
              <div className="gallery-img-wrapper"><img src="/images/gallery/image00018.jpeg" alt="Taiga Trece" className="gallery-img" /></div>
              <div className="gallery-img-wrapper"><img src="/images/gallery/25626765_1819050951501950_8608751094007917596_o.jpg" alt="Taiga Trece" className="gallery-img" /></div>
              <div className="gallery-img-wrapper"><img src="/images/gallery/36440799_2072379706168542_3790810668857294848_o.jpg" alt="Taiga Trece" className="gallery-img" /></div>
              <div className="gallery-img-wrapper"><img src="/images/gallery/37943277_2154280364645672_79177215295619072_n.jpg" alt="Taiga Trece" className="gallery-img" /></div>
            </div>
          </div>
        </section>

        {/* Book Now Section */}
        <section id="book" className="music-section book-section">
          <div className="section-container">
            <h2 className="section-title">{t('music.nav.book')}</h2>
            <div className="book-content">
              <p className="book-text">{t('music.bookDescription')}</p>
              <a 
                href="mailto:andre.lang@bavarian-caps.de?subject=Booking%20Inquiry%20-%20Taiga%20Trece"
                className="book-button"
              >
                {t('music.bookButton')}
              </a>
            </div>
          </div>
        </section>

        {/* Creator Collab Section */}
        <section id="collab" className="music-section collab-section">
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

        {/* Tickets Section */}
        <section id="tickets" className="music-section tickets-section">
          <div className="section-container">
            <h2 className="section-title">{t('music.nav.tickets')}</h2>
            <div className="coming-soon">
              <p>{t('music.ticketsComingSoon')}</p>
            </div>
          </div>
        </section>

        {/* Shop Section */}
        {/* <section id="shop" className="music-section shop-section">
          <div className="section-container">
            <h2 className="section-title">{t('music.nav.shop')}</h2>
            <div className="coming-soon">
              <p>{t('music.shopComingSoon')}</p>
            </div>
          </div>
        </section> */}
      </main>

      {/* Floating Spotify Player */}
      <div className="spotify-player-floating">
        <iframe
          src="https://open.spotify.com/embed/artist/30YZrNRYrOWRuTxoRwvXT4?utm_source=generator&theme=0"
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Player - Taiga Trece"
        ></iframe>
      </div>

      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        ↑
      </button>

      <Footer />
    </div>
  )
}

export default MusicPage