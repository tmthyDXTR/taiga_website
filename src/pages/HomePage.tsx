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
  const [rainbowIndex, setRainbowIndex] = useState<number | null>(null)

  // Rainbow colors - full saturation HSL spectrum
  const rainbowColors = [
    'hsl(0, 100%, 50%)',    // Red
    'hsl(30, 100%, 50%)',   // Orange
    'hsl(60, 100%, 50%)',   // Yellow
    'hsl(120, 100%, 50%)',  // Green
    'hsl(180, 100%, 50%)',  // Cyan
    'hsl(240, 100%, 50%)',  // Blue
    'hsl(270, 100%, 50%)',  // Purple
    'hsl(300, 100%, 50%)',  // Magenta
  ]

  const handleChameleonClick = () => {
    setRainbowIndex(prev => prev === null ? 0 : (prev + 1) % rainbowColors.length)
  }

  const handleChameleonMouseLeave = () => {
    setRainbowIndex(null)
    setLinkHover(null) // Also reset hover state
  }

  useEffect(() => {
    if (rainbowIndex !== null) {
      document.documentElement.style.setProperty('--rainbow-color', rainbowColors[rainbowIndex])
      setLinkHover('c1') // Trigger color change state
    }
  }, [rainbowIndex, rainbowColors])

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

  // Device orientation for mobile tilt effect
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (!isMobile) return

    let lastGamma: number | null = null

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma // Left/right tilt (-90 to 90)
      
      if (gamma === null) return

      // If in rainbow mode, only exit if tilt changes significantly (>20 degrees)
      if (rainbowIndex !== null) {
        if (lastGamma === null) {
          lastGamma = gamma
          return
        }
        const tiltChange = Math.abs(gamma - lastGamma)
        if (tiltChange > 20) {
          // Significant tilt detected, exit rainbow mode
          setRainbowIndex(null)
          lastGamma = gamma
        }
        return // Don't apply tilt colors while in rainbow mode
      }

      lastGamma = gamma

      // Map tilt to color interpolation (0 = lime-green, 1 = pink-magenta)
      // Normalize gamma from -45 to 45 degrees for sensitivity
      const clampedGamma = Math.max(-45, Math.min(45, gamma))
      const normalizedTilt = (clampedGamma + 45) / 90 // 0 to 1
      
      // Interpolate between lime-green (#d0ff00) and pink-magenta (#ff00dd)
      const r = Math.round(208 + (255 - 208) * normalizedTilt)
      const g = Math.round(255 - (255 - 0) * normalizedTilt)
      const b = Math.round(0 + (221 - 0) * normalizedTilt)
      
      const interpolatedColor = `rgb(${r}, ${g}, ${b})`
      
      // Apply the color to CSS custom property
      document.documentElement.style.setProperty('--tilt-color', interpolatedColor)
      
      // Trigger the tilt class for smooth transitions
      if (Math.abs(gamma) > 3) {
        setLinkHover('c1') // Use c1 as the tilt state trigger
      } else {
        setLinkHover(null)
      }
    }

    // Request permission for iOS 13+
    interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission === 'function') {
      (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission!()
        .then((permissionState: 'granted' | 'denied') => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation)
          }
        })
        .catch(console.error)
    } else {
      // Non-iOS or older iOS
      window.addEventListener('deviceorientation', handleOrientation)
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [rainbowIndex])

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
          className="menu-link workshops-link"
          href="/w"
          onMouseEnter={() => setLinkHover('c2')}
          onMouseLeave={() => setLinkHover(null)}
        >
          {t('navigation.workshops')}
        </a>
        <p>·</p>
        <a
          className="menu-link music-link"
          href="/m"
          onMouseEnter={() => setLinkHover('c1')}
          onMouseLeave={() => setLinkHover(null)}
        >
          {t('navigation.theArtist')}
        </a>
        <p>·</p>
        <a
          className="menu-link tbd-link"
          href="/p"
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
              className={`chameleon ${linkHover ? `is-hovered-${linkHover}` : ''} ${rainbowIndex !== null ? 'rainbow-mode' : ''}`}
              aria-hidden="true"
              onClick={handleChameleonClick}
              onMouseLeave={handleChameleonMouseLeave}
              style={{ cursor: 'pointer' }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <img
              src={chUrl}
              alt="chameleon"
              className={`chameleon ${linkHover ? `is-hovered-${linkHover}` : ''} ${rainbowIndex !== null ? 'rainbow-mode' : ''}`}
              aria-hidden="true"
              onClick={handleChameleonClick}
              onMouseLeave={handleChameleonMouseLeave}
              style={{ cursor: 'pointer' }}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default HomePage