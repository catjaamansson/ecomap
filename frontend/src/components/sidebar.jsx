import { useState } from 'react'

const Sidebar = ({ active, setActive, setWaterLevel }) => {
  const [sliderValue, setSliderValue] = useState(0)

  const handleLowEmissions = () => {
    console.log('Low emissions clicked')
    setActive('low_emissions')
    setWaterLevel(1)
    setSliderValue(1)
  }

  const handleMediumEmissions = () => {
    setActive('medium_emissions')
    setWaterLevel(2)
    setSliderValue(2)
  }

  const handleHighEmissions = () => {
    setActive('high_emissions')
    setWaterLevel(3)
    setSliderValue(3)
  }

  const handleSliderChange = (e) => {
    const value = Number(e.target.value)
    setSliderValue(value)
    setWaterLevel(value)
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
        onClick={handleLowEmissions}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'low_emissions' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'low_emissions' ? 'bold' : 'normal'
        }}
      >
        Low emissions
      </button>

      <button
        onClick={handleMediumEmissions}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'medium_emissions' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'medium_emissions' ? 'bold' : 'normal'
        }}
      >
        Medium emissions
      </button>

      <button
        onClick={handleHighEmissions}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'high_emissions' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'high_emissions' ? 'bold' : 'normal'
        }}
      >
        High emissions
      </button>

      <div style={{ borderTop: '2px solid #597D68', paddingTop: '15px', marginTop: '10px' }}>
        <label style={{ color: '#86DB90', fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '10px' }}>
          Vattennivå: {sliderValue} m
        </label>
        <input 
          type="range" 
          min="0" 
          max="10" 
          value={sliderValue}
          onChange={handleSliderChange}
          style={{
            width: '100%',
            cursor: 'pointer',
            accentColor: '#86DB90'
          }}
        />
      </div>
    </div>
  )
}

export default Sidebar;