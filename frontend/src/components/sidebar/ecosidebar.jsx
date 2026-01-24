import { useState } from 'react'

const Ecosidebar = ({ active, setActive}) => {

  const vegetation = () => {
    active === 'vegetation' ? setActive(null) : setActive('vegetation')
  }

  const soil_moisture = () => {
    active === 'soil_moisture' ? setActive(null) : setActive('soil_moisture')
  }

  const protected_areas = () => {
    active === 'protected_areas' ? setActive(null) : setActive('protected_areas')
  }

  const threatened_animals = () => {
    active === 'threatened_animals' ? setActive(null) : setActive('threatened_animals')
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
        Vegetation
      </button>

       <button
        onClick={soil_moisture}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'soil_moisture' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'soil_moisture' ? 'bold' : 'normal'
        }}
      >
        Soil Moisture
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
        Protected areas
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
        Threatened animals
      </button>
    </div>
  )
}

export default Ecosidebar;