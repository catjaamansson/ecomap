import { useState } from 'react'

const Hydrosidebar = ({ active, setActive, setWaterLevel, showWaterQuality, setShowWaterQuality }) => {
  const [sliderValue, setSliderValue] = useState(0)

  const handleLowEmissions = () => {
    console.log('Low emissions clicked')
    setActive('low')
    setWaterLevel(1)
    setSliderValue(1)
  }

  const handleMediumEmissions = () => {
    setActive('medium')
    setWaterLevel(2)
    setSliderValue(2)
  }

  const handleHighEmissions = () => {
    setActive('high')
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
          border: active === 'low' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'low' ? 'bold' : 'normal'
        }}
      >
        Low (1 m)
      </button>

      <button
        onClick={handleMediumEmissions}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'medium' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'medium' ? 'bold' : 'normal'
        }}
      >
        Medium (2 m)
      </button>

      <button
        onClick={handleHighEmissions}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'high' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'high' ? 'bold' : 'normal'
        }}
      >
        High (3 m)
      </button>

      <div style={{ borderTop: '2px solid #597D68', paddingTop: '15px', marginTop: '10px' }}>
        <label style={{ color: '#86DB90', fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '10px' }}>
          Vattennivå: {sliderValue} m
        </label>
        <input 
          type="range" 
          min="0" 
          max="10" 
          step="0.5"
          value={sliderValue}
          onChange={handleSliderChange}
          style={{
            width: '100%',
            cursor: 'pointer',
            accentColor: '#86DB90'
          }}
        />
      </div>

      <div style={{ borderTop: '2px solid #597D68', paddingTop: '15px', marginTop: '10px' }}>
        <label style={{ 
          color: '#86DB90', 
          fontWeight: 'bold', 
          fontSize: '14px', 
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer'
        }}>
          <input 
            type="checkbox" 
            checked={showWaterQuality}
            onChange={(e) => setShowWaterQuality(e.target.checked)}
            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
          />
          Visa vattenkvalitet
        </label>
      </div>
    </div>
  )
}

export default Hydrosidebar;