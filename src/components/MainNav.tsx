import { useNavigate } from 'react-router-dom'
import { flushSync } from 'react-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import './MainNav.css'

interface MainNavProps {
  active?: 'workshops' | 'music' | 'projects'
}

// Cross-fade the content area when navigating between sub-pages.
// Falls back to a plain navigate() in browsers without View Transitions.
function transitionTo(navigate: (p: string) => void, path: string) {
  if ('startViewTransition' in document) {
    ;(document as Document & { startViewTransition(cb: () => void): void })
      .startViewTransition(() => { flushSync(() => navigate(path)) })
  } else {
    navigate(path)
  }
}

function MainNav({ active }: MainNavProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <nav className="main-nav" aria-label="Primary navigation">
      <div className="main-nav-links">
        <button
          className={`main-nav-link workshops${active === 'workshops' ? ' active' : ''}`}
          onClick={() => transitionTo(navigate, '/w')}
        >
          {t('navigation.workshops')}
        </button>
        <span className="main-nav-sep">·</span>
        <button
          className={`main-nav-link music${active === 'music' ? ' active' : ''}`}
          onClick={() => transitionTo(navigate, '/m')}
        >
          {t('navigation.theArtist')}
        </button>
        <span className="main-nav-sep">·</span>
        <button
          className={`main-nav-link projects${active === 'projects' ? ' active' : ''}`}
          onClick={() => transitionTo(navigate, '/p')}
        >
          {t('navigation.tbd')}
        </button>
      </div>
      <div className="main-nav-lang">
        <a href="mailto:workshops@taigatrece.com" className="book-now-btn">
          {t('navigation.bookNow')}
        </a>
        <LanguageSwitcher />
      </div>
    </nav>
  )
}

export default MainNav
