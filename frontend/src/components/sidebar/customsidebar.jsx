import { useState } from 'react'

const Ecosidebar = ({ active, setActive, setThreatLevel }) => {

  const vegetation = () => {
    setActive('vegetation')
    setThreatLevel('veg')
  }

  const protected_areas = () => {
    setActive('protected_areas')
    setThreatLevel('pro')
  }

  const threatened_animals = () => {
    setActive('threatened_animals')
    setThreatLevel('tha')
  }

  const threatened_plants = () => {
    setActive('threatened_plants')
    setThreatLevel('thp')
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
        onClick={vegetation}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'vegetation' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'vegetation' ? 'bold' : 'normal'
        }}
      >
        blabla1
      </button>

      <button
        onClick={protected_areas}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'protected_areas' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'protected_areas' ? 'bold' : 'normal'
        }}
      >
        blabla2
      </button>

      <button
        onClick={threatened_animals}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'threatened_animals' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'threatened_animals' ? 'bold' : 'normal'
        }}
      >
        blabla3
      </button>
      
      <button
        onClick={threatened_plants}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'threatened_plants' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'threatened_plants' ? 'bold' : 'normal'
        }}
      >
        blabla4
      </button>

    </div>
  )
}

export default Ecosidebar;