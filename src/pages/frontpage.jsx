import { useState } from 'react'
import Sidebar from '../components/sidebar'

function App() {
  

  return (
    <div
      style={{
        backgroundImage: "url('/leaf.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        backgroundColor: '#356d4fff',
      }}
    >

      <h1 className="font-bold" style={{ fontFamily: 'serif', letterSpacing: '0.05em', color: '#223D2D', fontSize: '120px', margin: 0, padding: 0 }}>EcoMap</h1>
      {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', alignItems: 'center' }}>
        <button style={{ width: '150px', padding: '15px', textAlign: 'center', backgroundColor: '#597D68' }}>Hydrologi</button>
        <button style={{ width: '150px', padding: '15px', textAlign: 'center', backgroundColor: '#597D68' }}>Ekologi</button>
        <button style={{ width: '150px', padding: '15px', textAlign: 'center', backgroundColor: '#597D68' }}>Fältstudie</button>
        <button style={{ width: '150px', padding: '15px', textAlign: 'center', backgroundColor: '#597D68' }}>4</button>
      </div> */}

        

    </div>
  )
}

export default App
