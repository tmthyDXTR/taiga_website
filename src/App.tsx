import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MusicPage from './pages/MusicPage'
import WorkshopsPage from './pages/WorkshopsPage'
import ImpressumPage from './pages/ImpressumPage'
import './i18n' // Initialize i18n for localization
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/impressum" element={<ImpressumPage />} />
      </Routes>
    </Router>
  )
}

export default App
