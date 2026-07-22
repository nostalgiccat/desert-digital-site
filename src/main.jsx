import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import StudyLogin from './StudyLogin.jsx'
import SecurityPlusCurriculum from './SecurityPlusCurriculum.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/study" element={<StudyLogin />} />
        <Route
          path="/study/curriculum"
          element={
            <ProtectedRoute>
              <SecurityPlusCurriculum />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
