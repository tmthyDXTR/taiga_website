import LanguageSwitcher from './LanguageSwitcher'
import './LogoHeader.css'

function LogoHeader() {
  return (
    <div className="logo-container">
      <div className="logo-box">
        <img 
          src="/images/taiga_logo_white.png" 
          alt="TAIGA" 
          className="logo"
        />
        <div className="header-controls">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}

export default LogoHeader