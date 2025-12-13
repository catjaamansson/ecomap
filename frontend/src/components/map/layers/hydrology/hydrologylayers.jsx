import { useEffect, useState } from 'react'
import FloodLayer from './floodlayer'

function HydrologyLayers() {
  const [level, setLevel] = useState(10)
  const [geojson, setGeojson] = useState(null)

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/flood?level=${level}`)
      .then(res => res.json())
      .then(setGeojson)
      .catch(console.error)
  }, [level])

  return (
    <>
      <FloodLayer geojson={geojson} />
    </>
  )
}

export default HydrologyLayers