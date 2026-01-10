import LanguageSwitcher from './LanguageSwitcher'
import './LogoHeader.css'

interface LogoHeaderProps {
  onClick?: () => void
  clickable?: boolean
}

function LogoHeader({ onClick, clickable = false }: LogoHeaderProps) {
  return (
    <div className="logo-container">
      <div className="logo-box">
        <img 
          src="/images/taiga_logo_white.png" 
          alt="TAIGA" 
          className={`logo ${clickable ? 'logo-clickable' : ''}`}
          onClick={onClick}
          style={clickable ? { cursor: 'pointer' } : undefined}
        />
        <div className="header-controls">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}

export default LogoHeader