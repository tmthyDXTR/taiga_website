import { useRef, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { flushSync } from 'react-dom'
import MainNav from '../components/MainNav'
import './SubPageLayout.css'

function SubPageLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { pathname } = location
  const headerRef = useRef<HTMLDivElement>(null)

  const active: 'workshops' | 'music' | 'projects' | undefined =
    pathname === '/w' ? 'workshops' :
    pathname === '/m' ? 'music' :
    pathname === '/p' ? 'projects' :
    undefined

  // Keep --main-nav-h accurate so music-page height stays correct
  useEffect(() => {
    const update = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty(
          '--main-nav-h',
          `${headerRef.current.getBoundingClientRect().height}px`
        )
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const goHome = () => {
    if (!('startViewTransition' in document)) {
      navigate('/')
      return
    }
    const vt = (document as unknown as {
      startViewTransition(cb: () => void): { ready: Promise<void> }
    }).startViewTransition(() => { flushSync(() => navigate('/')) })
    vt.ready.then(() => {
      for (const anim of document.getAnimations()) {
        if (
          anim.effect instanceof KeyframeEffect &&
          (anim.effect.pseudoElement === '::view-transition-group(main-nav)' ||
           anim.effect.pseudoElement === '::view-transition-group(site-title)')
        ) {
          anim.effect.updateTiming({ duration: 600, easing: 'cubic-bezier(0.4,0,0.2,1)' })
        }
      }
    })
  }

  return (
    <>
      <div ref={headerRef} className="sub-page-header">
        <button
          className="sub-page-site-title"
          onClick={goHome}
          aria-label="Back to home"
        >
          TAIGA TRECE
        </button>
        <MainNav active={active} />
      </div>
      <Outlet />
    </>
  )
}

export default SubPageLayout
