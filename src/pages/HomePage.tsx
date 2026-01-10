import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './HomePage.css'
import LanguageSwitcher from '../components/LanguageSwitcher'
import Footer from '../components/Footer'
import chUrl from '../assets/images/chamaeleon.svg'

function HomePage() {
  const { t } = useTranslation()
  const [linkHover, setLinkHover] = useState<'c1' | 'c2' | 'c3' | null>(null)
  const [svgContent, setSvgContent] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetch(chUrl)
      .then(res => res.text())
      .then(text => {
        if (mounted) setSvgContent(text)
      })
      .catch(() => {
        if (mounted) setSvgContent(null)
      })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const id = 'stack-sans-text-font'
    if (!document.getElementById(id)) {
      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Stack+Sans+Text:wght@300;400;600;700&display=swap'
      document.head.appendChild(link)
    }
    document.documentElement.style.setProperty(
      '--stack-font',
      "'Stack Sans Text', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    )
  }, [])

  return (
    <div className={`home-page ${linkHover ? `hover-${linkHover}` : ''}`}>
      <h1 className={`site-title ${linkHover ? `is-hovered-${linkHover}` : ''}`}>TAIGA TRECE</h1>

      {/* language switcher sits top-right on desktop, above nav on mobile */}
      <div className="language-menu" aria-label="Select language">
        <LanguageSwitcher />
      </div>

      <nav className="top-nav" aria-label="Primary">
        <a
          className="menu-link music-link"
          href="/music"
          onMouseEnter={() => setLinkHover('c1')}
          onMouseLeave={() => setLinkHover(null)}
        >
          {t('navigation.theArtist')}
        </a>

        <a
          className="menu-link workshops-link"
          href="/workshops"
          onMouseEnter={() => setLinkHover('c2')}
          onMouseLeave={() => setLinkHover(null)}
        >
          {t('navigation.workshops')}
        </a>

        <a
          className="menu-link tbd-link"
          href="/"
          onMouseEnter={() => setLinkHover('c3')}
          onMouseLeave={() => setLinkHover(null)}
        >
          {t('navigation.tbd')}
        </a>
      </nav>

      <div className="home-vinyl-container">
        <div className="cham-wrapper">
          {svgContent ? (
            <div
              className={`chameleon ${linkHover ? `is-hovered-${linkHover}` : ''}`}
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <img
              src={chUrl}
              alt="chameleon"
              className={`chameleon ${linkHover ? `is-hovered-${linkHover}` : ''}`}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default HomePage