import { useState } from 'react'
import { Routes, Route} from 'react-router-dom'
import './App.css'

//import pages
import Frontpage from './pages/frontpage.jsx'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route path ='/map' element={<div>Map page</div>} />
      </Routes>
    </>
  )
}

export default App
