import { useState } from 'react'

const CustomStudySidebar = ({ active, setActive, setWaterLevel }) => {
  const [sliderValue, setSliderValue] = useState(0)
  const selectLayer = (layer) => {
  setActive(active === layer ? null : layer)
  setSliderValue(0)
  setWaterLevel(0)
}
  const toggleLandUse = () => {
    selectLayer('landUse')
  }

  const soilmoisture = () => {
    selectLayer('soil_moisture')
  }

  const waterbodies = () => {
    selectLayer('waterbodies')
  }
  const vegetation = () => {
    selectLayer('vegetation')
  }
  const waterquality = () => {
    selectLayer('waterquality')
  }
  const handleSliderChange = (e) => {
    const value = Number(e.target.value)
    setSliderValue(value)
    setWaterLevel(value)
    setActive(null) // deselect buttons when slider is used
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
      {/* flooding slider */}
      <div style={{ paddingTop: '15px' }}>
        <label style={{ color: '#86DB90', fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '10px' }}>
          Water level: {sliderValue} m
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

      {/* waterquality button */}
      <button
        onClick={waterquality}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'waterquality' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'waterquality' ? 'bold' : 'normal'
        }}
      >
        Water Quality
      </button>

      {/* vegetation button */}
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

      {/* land use button */}
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

      {/* water bodies button */}
      <button
        onClick={waterbodies}
        style={{
          width: '100%',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#597D68',
          color: '#223D2D',
          border: active === 'waterbodies' ? '3px solid #86DB90' : 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: active === 'waterbodies' ? 'bold' : 'normal'
        }}
      >
        Water Bodies
      </button>

      {/* soil moisture button */}
      <button
        onClick={soilmoisture}
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

    </div>
  )
}

export default CustomStudySidebar;