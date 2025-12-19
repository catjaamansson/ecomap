import { useState } from 'react'

const Ecosidebar = ({ active, setActive, setThreatLevel }) => {

  const handleVulnerable = () => {
    setActive('vulnerable')
    setThreatLevel('VU')
  }

  const handleEndangered = () => {
    setActive('endangered')
    setThreatLevel('EN')
  }

  const handleCritical = () => {
    setActive('critical')
    setThreatLevel('CR')
  }

  return (
    <div 
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '25px',
        backgroundColor: '#345742ff',
        width: '220px',
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
      }}
    >
      <button
        onClick={handleVulnerable}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'vulnerable' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'vulnerable' ? 'bold' : 'normal'
        }}
      >
        Vulnerable (VU)
      </button>

      <button
        onClick={handleEndangered}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'endangered' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'endangered' ? 'bold' : 'normal'
        }}
      >
        Endangered (EN)
      </button>

      <button
        onClick={handleCritical}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'critical' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'critical' ? 'bold' : 'normal'
        }}
      >
        Critically Endangered (CR)
      </button>

    </div>
  )
}

export default Ecosidebar;