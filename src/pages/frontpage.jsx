import { useState } from 'react'
import { Link } from 'react-router-dom'

function Frontpage() {
  

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
      {<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', alignItems: 'center' }}>
      <Link to="/hydrology">
        <button style={{ width: '150px', padding: '15px', textAlign: 'center', backgroundColor: '#597D68' }}>Hydrology</button>
        </Link>  
      <Link to="/ecology">
        <button style={{ width: '150px', padding: '15px', textAlign: 'center', backgroundColor: '#597D68' }}>Ecology</button>
        </Link>  
      <Link to="/field_study">
        <button style={{ width: '150px', padding: '15px', textAlign: 'center', backgroundColor: '#597D68' }}>Field study</button>
        </Link>
      <Link to="/custom">
        <button style={{ width: '150px', padding: '15px', textAlign: 'center', backgroundColor: '#597D68' }}>Custom</button>
        </Link>
      </div>}

        

    </div>
  )
}

export default Frontpage;
