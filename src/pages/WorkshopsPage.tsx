import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'
import Footer from '../components/Footer'
import './WorkshopsPage.css'

function WorkshopsPage() {
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
    <div className="workshops-page">
      {/* TAIGA TRECE text header - cleaner homepage style */}
      <h1 className="site-title">TAIGA TRECE</h1>
      
      {/* language switcher */}
      <div className="language-menu" aria-label="Select language">
        <LanguageSwitcher />
      </div>

      {/* Header with back navigation */}
      <header className="workshops-header">
        <Link to="/" className="back-link">
          <div className="back-button">
            {t('navigation.backToTriangle')}
          </div>
        </Link>
      </header>

      {/* Main content */}
      <main className="workshops-content">
        {/* Hero section */}
        <section className="workshops-hero">
          <div className="hero-content">
            <h2>{t('workshops.heroTitle')}</h2>
            <p className="hero-description">
              {t('workshops.heroDescription')}
            </p>
          </div>
          <div className="hero-image-container">
            <img 
              src="/images/hero/triangle-hero-workshop.jpg" 
              alt="Workshop Environment" 
              className="hero-image"
            />
          </div>
        </section>

        {/* Partners/Collaborators Section */}
        <section className="partners-section">
          <h3>{t('workshops.partnersTitle')}</h3>
          <div className="partners-grid">
            <div className="partner-logo">Amnesty International</div>
            <div className="partner-logo">Goethe Institut</div>
            <div className="partner-logo">Viva con agua</div>
            <div className="partner-logo">Microsoft</div>
            <div className="partner-logo">IMMA</div>
            <div className="partner-logo">Refugio</div>
            <div className="partner-logo">Bellevue di Monaco</div>
            <div className="partner-logo">Ya Basta</div>
            <div className="partner-logo">AusArten</div>
            <div className="partner-logo">Bavarian Caps</div>
            <div className="partner-logo">PWC</div>
            <div className="partner-logo">PASCH Schulen</div>
            <div className="partner-logo">EU Delegation</div>
            <div className="partner-logo">356 Female Mcs</div>
            <div className="partner-logo">The Voice of Germany</div>
          </div>
        </section>

        {/* Available workshops */}
        <section className="workshops-listing">
          <h3>{t('workshops.focusAreasTitle')}</h3>
          <div className="workshops-grid">
            <div className="workshop-item">
              <div className="workshop-header">
                <h4>{t('workshops.workshops.rapSongwriting.title')}</h4>
                <div className="workshop-duration">{t('workshops.workshops.rapSongwriting.duration')}</div>
              </div>
              <div className="workshop-description">
                <p>
                  {t('workshops.workshops.rapSongwriting.description')}
                </p>
              </div>
              <div className="workshop-details">
                <div className="workshop-level">{t('workshops.workshops.rapSongwriting.level')}</div>
                <div className="workshop-price">{t('workshops.contact')}</div>
              </div>
              <div className="workshop-action">
                <a href="mailto:workshops@taigatrece.com" className="register-button">{t('workshops.inquireButton')}</a>
              </div>
            </div>

            <div className="workshop-item">
              <div className="workshop-header">
                <h4>{t('workshops.workshops.femaleEmpowerment.title')}</h4>
                <div className="workshop-duration">{t('workshops.workshops.femaleEmpowerment.duration')}</div>
              </div>
              <div className="workshop-description">
                <p>
                  {t('workshops.workshops.femaleEmpowerment.description')}
                </p>
              </div>
              <div className="workshop-details">
                <div className="workshop-level">{t('workshops.workshops.femaleEmpowerment.level')}</div>
                <div className="workshop-price">{t('workshops.contact')}</div>
              </div>
              <div className="workshop-action">
                <a href="mailto:workshops@taigatrece.com" className="register-button">{t('workshops.inquireButton')}</a>
              </div>
            </div>

            <div className="workshop-item">
              <div className="workshop-header">
                <h4>{t('workshops.workshops.deutschRap.title')}</h4>
                <div className="workshop-duration">{t('workshops.workshops.deutschRap.duration')}</div>
              </div>
              <div className="workshop-description">
                <p>
                  {t('workshops.workshops.deutschRap.description')}
                </p>
              </div>
              <div className="workshop-details">
                <div className="workshop-level">{t('workshops.workshops.deutschRap.level')}</div>
                <div className="workshop-price">{t('workshops.contact')}</div>
              </div>
              <div className="workshop-action">
                <a href="mailto:workshops@taigatrece.com" className="register-button">{t('workshops.inquireButton')}</a>
              </div>
            </div>

            <div className="workshop-item">
              <div className="workshop-header">
                <h4>{t('workshops.workshops.selfAwareness.title')}</h4>
                <div className="workshop-duration">{t('workshops.workshops.selfAwareness.duration')}</div>
              </div>
              <div className="workshop-description">
                <p>
                  {t('workshops.workshops.selfAwareness.description')}
                </p>
              </div>
              <div className="workshop-details">
                <div className="workshop-level">{t('workshops.workshops.selfAwareness.level')}</div>
                <div className="workshop-price">{t('workshops.contact')}</div>
              </div>
              <div className="workshop-action">
                <a href="mailto:workshops@taigatrece.com" className="register-button">{t('workshops.inquireButton')}</a>
              </div>
            </div>

            <div className="workshop-item">
              <div className="workshop-header">
                <h4>{t('workshops.workshops.femaleHealth.title')}</h4>
                <div className="workshop-duration">{t('workshops.workshops.femaleHealth.duration')}</div>
              </div>
              <div className="workshop-description">
                <p>
                  {t('workshops.workshops.femaleHealth.description')}
                </p>
              </div>
              <div className="workshop-details">
                <div className="workshop-level">{t('workshops.workshops.femaleHealth.level')}</div>
                <div className="workshop-price">{t('workshops.contact')}</div>
              </div>
              <div className="workshop-action">
                <a href="mailto:workshops@taigatrece.com" className="register-button">{t('workshops.inquireButton')}</a>
              </div>
            </div>

            <div className="workshop-item">
              <div className="workshop-header">
                <h4>{t('workshops.workshops.rapYoga.title')}</h4>
                <div className="workshop-duration">{t('workshops.workshops.rapYoga.duration')}</div>
              </div>
              <div className="workshop-description">
                <p>
                  {t('workshops.workshops.rapYoga.description')}
                </p>
              </div>
              <div className="workshop-details">
                <div className="workshop-level">{t('workshops.workshops.rapYoga.level')}</div>
                <div className="workshop-price">{t('workshops.contact')}</div>
              </div>
              <div className="workshop-action">
                <a href="mailto:workshops@taigatrece.com" className="register-button">{t('workshops.inquireButton')}</a>
              </div>
            </div>
          </div>
        </section>

        {/* Workshop info */}
        <section className="workshop-info">
          <h3>{t('workshops.aboutTitle')}</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>{t('workshops.about.professionalBackground.title')}</h4>
              <p>
                {t('workshops.about.professionalBackground.description')}
              </p>
            </div>
            <div className="info-item">
              <h4>{t('workshops.about.experiencePartnerships.title')}</h4>
              <p>
                {t('workshops.about.experiencePartnerships.description')}
              </p>
            </div>
            <div className="info-item">
              <h4>{t('workshops.about.approachMethod.title')}</h4>
              <p>
                {t('workshops.about.approachMethod.description')}
              </p>
            </div>
            <div className="info-item">
              <h4>{t('workshops.about.visionImpact.title')}</h4>
              <p>
                {t('workshops.about.visionImpact.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="workshop-contact">
          <h3>{t('workshops.contactTitle')}</h3>
          <p>
            {t('workshops.contactDescription')}
          </p>
          <div className="contact-actions">
            <a href="mailto:info@taigatrece.com" className="contact-button">
              {t('workshops.emailButton')}
            </a>
            <a href="https://www.taigatrece.com" className="contact-button" target="_blank" rel="noopener noreferrer">
              {t('workshops.websiteButton')}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default WorkshopsPage