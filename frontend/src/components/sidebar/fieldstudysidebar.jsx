import { useState } from 'react'

const FieldStudySidebar = ({ active, setActive }) => {
  const toggleLandUse = () => {
    setActive(active === 'landUse' ? null : 'landUse')
  }

  const toggleBufferZone = () => {
    setActive(active === 'bufferZone' ? null : 'bufferZone')
  }

  const toggleSoilVegetation = () => {
    setActive(active === 'soilVegetation' ? null : 'soilVegetation')
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
        onClick={toggleLandUse}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'landUse' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'landUse' ? 'bold' : 'normal'
        }}
      >
        Land Use
      </button>

      <button
        onClick={toggleBufferZone}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'bufferZone' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'bufferZone' ? 'bold' : 'normal'
        }}
      >
        Buffert zone
      </button>

      <button
        onClick={toggleSoilVegetation}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'soilVegetation' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'soilVegetation' ? 'bold' : 'normal'
        }}
      >
        Soil/vegetation
      </button>
    </div>
  )
}

export default FieldStudySidebar;