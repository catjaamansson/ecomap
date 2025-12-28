import { useState } from 'react'

const FieldStudySidebar = ({ active, setActive }) => {
  const area1 = () => {
    setActive('area1')
  }

  const area2 = () => {
    setActive('area2')
  }

  const area3 = () => {
    setActive('area3')
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
        onClick={area1}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'area1' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'area1' ? 'bold' : 'normal'
        }}
      >
        Area 1
      </button>

      <button
        onClick={area2}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'area2' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'area2' ? 'bold' : 'normal'
        }}
      >
        Area 2
      </button>

      <button
        onClick={area3}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'area3' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'area3' ? 'bold' : 'normal'
        }}
      >
        Area 3
      </button>
    </div>
  )
}

export default FieldStudySidebar;