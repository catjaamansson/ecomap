import React, { useState } from 'react'

const layerGroups = [
  { title: 'Hydrology', layers: [['waterquality', 'Water Quality'], ['waterbodies', 'Water Bodies']] },
  { title: 'Ecology', layers: [['vegetation', 'Vegetation'], ['soil_moisture', 'Soil Moisture']] },
  { title: 'Field Study', layers: [['landUse', 'Land Use']] }
]

const CustomStudySidebar = ({ active = [], setActive, waterLevel, setWaterLevel }) => {
  const [openGroups, setOpenGroups] = useState({ Hydrology: true, Ecology: true, Land: true })

  const toggleLayer = (layer) => {
    setActive((currentLayers) => currentLayers.includes(layer)
      ? currentLayers.filter((currentLayer) => currentLayer !== layer)
      : [...currentLayers, layer]
    )
  }

  const toggleGroup = (title) => {
    setOpenGroups((groups) => ({ ...groups, [title]: !groups[title] }))
  }

  const handleWaterLevelChange = (event) => {
    const value = Number(event.target.value)
    setWaterLevel(value)
    setActive((currentLayers) => value > 0
      ? currentLayers.includes('flooding')
        ? currentLayers
        : [...currentLayers, 'flooding']
      : currentLayers.filter((layer) => layer !== 'flooding')
    )
  }

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '18px', backgroundColor: 'rgba(25, 56, 25, 0.6)', width: '220px', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }}>
      {layerGroups.map(({ title, layers }) => (
        <section key={title}>
          <button type="button" onClick={() => toggleGroup(title)} style={{ width: '100%', padding: '7px 2px', border: 'none', background: 'transparent', color: '#D8E7D5', textAlign: 'left', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
            {title} <span style={{ float: 'right' }}>{openGroups[title] ? '−' : '+'}</span>
          </button>
          {openGroups[title] && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {title === 'Hydrology' && (
                <div style={{ padding: '4px 0 6px' }}>
                  <label style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                    Flood level: {waterLevel} m
                  </label>
                  <input type="range" min="0" max="10" step="0.5" value={waterLevel} onChange={handleWaterLevelChange} style={{ width: '100%', cursor: 'pointer', accentColor: '#A6BB77' }} />
                </div>
              )}
              {layers.map(([layer, label]) => {
                const isActive = active.includes(layer)
                return (
                  <button key={layer} type="button" onClick={() => toggleLayer(layer)} style={{ width: '100%', padding: '11px 10px', textAlign: 'left', backgroundColor: isActive ? '#87A98A' : '#6F967C', color: '#ffffff', border: isActive ? '2px solid #A6BB77' : '2px solid transparent', borderRadius: '10px', cursor: 'pointer', fontWeight: isActive ? '700' : 'normal' }}>
                    {label}
                  </button>
                )
              })}
            </div>
          )}
        </section>
      ))}
    </aside>
  )
}

export default CustomStudySidebar
