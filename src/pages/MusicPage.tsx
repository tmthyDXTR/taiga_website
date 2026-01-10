import { useTranslation } from 'react-i18next'
import LogoHeader from '../components/LogoHeader'
import './MusicPage.css'

function MusicPage() {
  const { t } = useTranslation()

  return (
    <div className="music-page">
      {/* TAIGA Logo - Unified component */}
      <LogoHeader />
      
      {/* Main content - clean slate */}
      <main className="music-content">
        <h1>{t('music.title')}</h1>
        <p>Music page content will go here...</p>
      </main>
    </div>
  )
}

export default MusicPage