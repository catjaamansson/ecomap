import { useEffect, useState } from 'react'
import ForestLayer from './forestlayer'
import SoilMoistureLayer from './soilmoisturelayers'

function EcologyLayers() {
  const [forestGeojson, setForestGeojson] = useState(null)
  const [soilMoistureGeojson, setSoilMoistureGeojson] = useState(null)

  useEffect(() => {
    console.log('Fetching forest data')
    fetch('http://127.0.0.1:5000/forest')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched forest data:', data)
        setForestGeojson(data)
      })
      .catch(err => console.error("Fetch forest error:", err))
  }, [])

  useEffect(() => {
    if (!showWaterQuality) return
    
    console.log('Fetching soil moisture data')
    fetch('http://127.0.0.1:5000/soil_moisture')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched soil moisture data:', data)
        setSoilMoistureGeojson(data)
      })
      .catch(err => console.error("Fetch soil moisture error:", err))
  }, [])

  return (
    <>
        {forestGeojson && <ForestLayer geojson={forestGeojson} />}
        {soilMoistureGeojson && <SoilMoistureLayer geojson={soilMoistureGeojson} />}
    </>
  )
}

export default EcologyLayers
