import { GeoJSON } from 'react-leaflet'

function FloodLayer({ geojson }) {
  if (!geojson) return null

  return (
    <GeoJSON
      data={geojson}
      style={{
        fillColor: '#2c7be5',
        fillOpacity: 0.4,
        color: '#2c7be5',
        weight: 0,
      }}
    />
  )
}

export default FloodLayer