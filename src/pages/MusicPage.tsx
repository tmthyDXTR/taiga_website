import { useTranslation } from 'react-i18next'
import { useRef, useState } from 'react'
import LogoHeader from '../components/LogoHeader'
import './MusicPage.css'

function MusicPage() {
  const { t } = useTranslation()
  const menuLinkRef = useRef<HTMLAnchorElement>(null)
  const [bookletActive, setBookletActive] = useState(false)
  const [bookletClosing, setBookletClosing] = useState(false)

  const handleVinylClick = () => {
    menuLinkRef.current?.click()
  }

  const handleBookletHover = () => {
    setBookletActive(true)
    setBookletClosing(false)
  }

  const handleCloseBooklet = () => {
    setBookletClosing(true)
    setTimeout(() => {
      setBookletActive(false)
      setBookletClosing(false)
    }, 800) // match animation duration (now 800ms)
  }

  return (
    <div className="music-page">
      {/* TAIGA Logo - Unified component */}
      <LogoHeader />
      
      {/* Insert card - positioned behind, slides out to center on hover */}
      <div className={`insert-card${bookletActive ? ' active' : ''}${bookletClosing ? ' closing' : ''}`}>
        <button className="close-booklet" onClick={handleCloseBooklet}>×</button>
        <div className="insert-card-content">
          <p>
            Taiga Trece has been performing as a rapper on stages at home and abroad for years. 
            Born in Munich, she spent her teenage years in Mexico. With her lyrics in German and Spanish, 
            she brings street culture, poetry and attitude – raw, honest and independent of the mainstream. 
            As one of the first women in the Munich hip-hop scene, she has earned herself a permanent place. 
            Her albums, releases and live performances reflect an artist who builds bridges between ambivalences 
            and constantly creates something new – culturally, linguistically and musically.
          </p>
        </div>
      </div>
      
      {/* Vinyl record and album cover container */}
      <div className="vinyl-container">
        {/* Vinyl disc (slides out on hover) - triggers menu link click */}
        <div 
          className="vinyl-disc"
          onClick={handleVinylClick}
        ></div>
        
        {/* Album cover (stays in place) */}
        <img 
          src="/src/assets/images/taiga-gradient.png" 
          alt="Taiga" 
          className="album-cover"
        />
        
        {/* Desktop menu links inside box */}
        <nav className="vinyl-menu desktop-only">
          <a 
            ref={menuLinkRef}
            href="https://linktr.ee/taigatrece?utm_source=linktree_profile_share&ltsid=853313ff-f7a6-4be5-8093-7f009ada5692" 
            target="_blank"
            rel="noopener noreferrer"
            className="menu-link tracklist-link"
          >
            {t('music.trackList')}
          </a>
          <div className="track-names">
            <p>Side A</p>
            <p>Watch Out 3:39</p>
            <p>Bienvenidos 3:50</p>
            <p>Im Barrio 3:18</p>
            <p>Kündigung 2:51</p>
          </div>
          
          <a 
            href="#booklet" 
            className="menu-link booklet-link"
            onMouseEnter={handleBookletHover}
          >
            BOOKLET
          </a>
        </nav>
        
        {/* Hover trigger area - rightmost 20% */}
        <div className="vinyl-hover-trigger"></div>
      </div>
      
      {/* Main content - clean slate */}
      <main className="music-content">
        <p></p>
      </main>
    </div>
  )
}

export default MusicPage