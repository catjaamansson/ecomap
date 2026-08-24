import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

// import pages
import Frontpage from './pages/frontpage.jsx'
import Hydrology from './pages/hydrology.jsx'
import Ecology from './pages/ecology.jsx'
import FieldStudy from './pages/field_study.jsx'
import Custom from './pages/custom.jsx'
import Datasources from './pages/datasources.jsx'
import Contact from './pages/contact&feedback.jsx'
import PrivacyPolicy from './pages/privacypolicy.jsx'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route path ='/hydrology' element={<Hydrology />} />
        <Route path ='/ecology' element={<Ecology />} />
        <Route path ='/field_study' element={<FieldStudy />} />
        <Route path ='/custom' element={<Custom />} />
        <Route path ='/datasources' element={<Datasources />} />
        <Route path ='/contact' element={<Contact />} />
        <Route path ='/privacypolicy' element={<PrivacyPolicy />} />
      </Routes>
  )
}

export default App
