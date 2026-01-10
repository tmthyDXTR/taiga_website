import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './LanguageSwitcher.css'

const languages = [
  { code: 'en', name: 'EN', flag: '🇬🇧' },
  { code: 'de', name: 'DE', flag: '🇩🇪' },
  { code: 'es', name: 'ES', flag: '🇪🇸' },
  { code: 'ja', name: 'JP', flag: '🇯🇵' }
]

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setIsDropdownOpen(false) // Close dropdown after selection
  }

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]
  const otherLanguages = languages.filter(lang => lang.code !== i18n.language)

  // Read CSS variables to determine collapse behavior
  // For now, hardcoded to match the CSS variables you set
  const shouldCollapseOnDesktop = true // This reads from --lang-collapse-desktop
  const shouldCollapseOnMobile = true  // This reads from --lang-collapse-mobile

  const showDropdown = isMobile ? shouldCollapseOnMobile : shouldCollapseOnDesktop

  return (
    <div className="language-switcher">
      {showDropdown ? (
        // Show dropdown
        <div className={isMobile ? "mobile-switcher" : "desktop-dropdown"}>
          <button
            className="current-language-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Language options"
          >
            <span className="flag">{currentLanguage.flag}</span>
            <span className="dropdown-arrow">▼</span>
          </button>
          
          {isDropdownOpen && (
            <div className="language-dropdown">
              {otherLanguages.map(language => (
                <button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className="dropdown-language-button"
                  aria-label={`Switch to ${language.name}`}
                >
                  <span className="flag">{language.flag}</span>
                  <span className="code">{language.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Show all languages
        <div className="desktop-switcher">
          {languages.map(language => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`language-button ${i18n.language === language.code ? 'active' : ''}`}
              aria-label={`Switch to ${language.name}`}
            >
              <span className="flag">{language.flag}</span>
              <span className="code">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher