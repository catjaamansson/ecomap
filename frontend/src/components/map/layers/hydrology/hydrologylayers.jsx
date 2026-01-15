import { useEffect, useState } from 'react'
import FloodLayer from './floodlayer'
import WaterQualityLayer from './waterqualitylayer'

function HydrologyLayers({ level, showWaterQuality }) {
  const [floodGeojson, setFloodGeojson] = useState(null)
  const [waterQualityGeojson, setWaterQualityGeojson] = useState(null)

  useEffect(() => {
    console.log('Fetching flood data with level:', level)
    fetch(`http://127.0.0.1:5000/flood?level=${level}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched flood data:', data)
        setFloodGeojson(data)
      })
      .catch(err => console.error("Fetch flood error:", err))
  }, [level])

  useEffect(() => {
    if (!showWaterQuality) return
    
    console.log('Fetching water quality data')
    fetch('http://127.0.0.1:5000/water_quality')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched water quality data:', data)
        setWaterQualityGeojson(data)
      })
      .catch(err => console.error("Fetch water quality error:", err))
  }, [showWaterQuality])

  return (
    <>
        {floodGeojson && <FloodLayer level={level} geojson={floodGeojson} />}
        {waterQualityGeojson && <WaterQualityLayer showWaterQuality={showWaterQuality} geojson={waterQualityGeojson} />}
    </>
  )
}

export default HydrologyLayers