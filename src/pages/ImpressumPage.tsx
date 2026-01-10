import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LogoHeader from '../components/LogoHeader'
import './ImpressumPage.css'

function ImpressumPage() {
  const { t } = useTranslation()

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
    document.documentElement.style.fontFamily = font
  }, [])

  return (
    <div className="impressum-page">
      <LogoHeader />

      <header className="impressum-header">
        <Link to="/" className="back-link">
          <div className="back-button">
            {t('navigation.backToTriangle')}
          </div>
        </Link>
      </header>

      <main className="impressum-content">
        <h1>{t('impressum.title')}</h1>
        
        <section className="impressum-section">
          <h2>{t('impressum.responsibleTitle')}</h2>
          <p>Taiga Trece</p>
          <p>München, Germany</p>
        </section>

        <section className="impressum-section">
          <h2>{t('impressum.contactTitle')}</h2>
          <p>Email: info@taigatrece.com</p>
        </section>

        <section className="impressum-section">
          <h2>{t('impressum.disclaimerTitle')}</h2>
          <p>{t('impressum.disclaimerText')}</p>
        </section>
      </main>
    </div>
  )
}

export default ImpressumPage
