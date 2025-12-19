import { useEffect, useState } from 'react'
import FloodLayer from './floodlayer'

function HydrologyLayers({ level }) {
  const [geojson, setGeojson] = useState(null)

  useEffect(() => {
    console.log('Fetching with level:', level)
    fetch(`http://127.0.0.1:5000/flood?level=${level}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data)
        setGeojson(data)
      })
      .catch(err => console.error("Fetch error:", err))
  }, [level])

  return (
    <>
        {geojson && <FloodLayer level={level} geojson={geojson} />}
    </>
  )
}

export default HydrologyLayers