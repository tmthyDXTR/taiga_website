import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MusicPage from './pages/MusicPage'
import WorkshopsPage from './pages/WorkshopsPage'
import './i18n' // Initialize i18n
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
      </Routes>
    </Router>
  )
}

export default App
