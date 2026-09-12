import { TileLayer } from 'react-leaflet'

function WaterQualityTiles() {
  return (
    <TileLayer
      url="/waterquality_tiles4/{z}/{x}/{y}.png"
      tms={true}
      minNativeZoom={6}
      maxNativeZoom={11}
      maxZoom={18}
      opacity={0.7}
      zIndex = {1000}
      attribution="Water quality data"
    />
  )
}

export default WaterQualityTiles