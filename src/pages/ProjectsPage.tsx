import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import LanguageSwitcher from '../components/LanguageSwitcher'
import Footer from '../components/Footer'
import './ProjectsPage.css'

function ProjectsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

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

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'home') {
      navigate('/')
      return
    }
    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const navLinks = [
    { id: 'home', labelKey: 'navigation.backToTriangle', isBack: true },
    { id: 'projects', labelKey: 'projects.pageTitle' },
  ]

  return (
    <div className="projects-page">
      {/* TAIGA site title (matches other pages) */}
      <h1 className="site-title">TAIGA</h1>

      {/* language switcher positioned like other pages */}
      <div className="language-menu" aria-label="Select language">
        <LanguageSwitcher />
      </div>

      <header className="projects-header workshops-header">
        <nav className="section-nav">
          {navLinks.map(link => (
            <button
              key={link.id}
              className={`nav-link ${link.isBack ? 'back-link' : ''}`}
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
            <h2 className="project-title"><span className="word-bg">{t('projects.project1.title')}</span></h2>
            <p className="project-text">{t('projects.project1.body')}</p>
            {/* <div className="project-action">
              <a className="project-link" href="#" aria-hidden>
                {t('projects.readMore')}
              </a>
            </div> */}
          </article>

          <article className="project-card">
            <h2 className="project-title"><span className="word-bg">{t('projects.project2.title')}</span></h2>
            <p className="project-text">{t('projects.project2.body')}</p>
            {/* <div className="project-action">
              <a className="project-link" href="#" aria-hidden>
                {t('projects.readMore')}
              </a>
            </div> */}
          </article>

          <article className="project-card">
            <h2 className="project-title"><span className="word-bg">{t('projects.project3.title')}</span></h2>
            <p className="project-text" dangerouslySetInnerHTML={{ __html: t('projects.project3.bodyHTML') }} />
            <div className="videos-grid">
              {[
                { id: 'zw7kGcapbPw', title: 'Gangsterrap' },
                { id: 'ToGCaJnkHgo', title: 'Mezcal' },
                { id: 'A09m4Y_bJKc', title: 'Welcome to Mexico City' }
              ].map(v => (
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
            <h2 className="project-title"><span className="word-bg">{t('projects.project4.title')}</span></h2>
            <p className="project-text" dangerouslySetInnerHTML={{ __html: t('projects.project4.bodyHTML') }} />
            <div className="videos-grid small">
              {[
                { id: 'CXHvvG-CE3Q', title: 'Artist Talk 1' },
                { id: 'pFVJosqAaCM', title: 'Artist Talk 2' }
              ].map(v => (
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

      <Footer />
    </div>
  )
}

export default ProjectsPage
