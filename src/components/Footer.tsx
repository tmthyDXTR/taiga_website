import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Footer.css'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="site-footer">
      <Link to="/impressum" className="footer-link">
        {t('footer.impressum')}
      </Link>
    </footer>
  )
}

export default Footer
