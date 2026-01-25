import LanguageSwitcher from './LanguageSwitcher'
import './LogoHeader.css'

interface LogoHeaderProps {
  onClick?: () => void
  clickable?: boolean
  text?: string
}

function LogoHeader({ onClick, clickable = false, text }: LogoHeaderProps) {
  return (
    <div className="logo-container">
      <div className="logo-box">
        {text ? (
          <div
            className={`logo-text ${clickable ? 'logo-clickable' : ''}`}
            onClick={onClick}
            aria-hidden={!clickable}
          >
            {text}
          </div>
        ) : (
          <img 
            src="/images/taiga_logo_white.png" 
            alt="TAIGA" 
            className={`logo ${clickable ? 'logo-clickable' : ''}`}
            onClick={onClick}
            style={clickable ? { cursor: 'pointer' } : undefined}
          />
        )}
        <div className="header-controls">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}

export default LogoHeader