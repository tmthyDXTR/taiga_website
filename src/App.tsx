import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MusicPage from './pages/MusicPage'
import WorkshopsPage from './pages/WorkshopsPage'
import ImpressumPage from './pages/ImpressumPage'
import ProjectsPage from './pages/ProjectsPage'
import SubPageLayout from './layouts/SubPageLayout'
import './i18n' // Initialize i18n for localization
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<SubPageLayout />}>
          <Route path="/m" element={<MusicPage />} />
          <Route path="/w" element={<WorkshopsPage />} />
          <Route path="/p" element={<ProjectsPage />} />
        </Route>
        <Route path="/impressum" element={<ImpressumPage />} />
      </Routes>
    </Router>
  )
}

export default App
