import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

//import pages
import Frontpage from './pages/frontpage.jsx'
import Hydrology from './pages/hydrology.jsx'
import Ecology from './pages/ecology.jsx'
import FieldStudy from './pages/field_study.jsx'
import Custom from './pages/custom.jsx'


function App() {

  return (
      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route path ='/hydrology' element={<Hydrology />} />
        <Route path ='/ecology' element={<Ecology />} />
        <Route path ='/field_study' element={<FieldStudy />} />
        <Route path ='/custom' element={<Custom />} />
      </Routes>
  )
}

export default App
