import { TileLayer } from 'react-leaflet'

function Soilmoisture() {
  return (
    <TileLayer
      url="/soilmoisturetiles/{z}/{x}/{y}.png"
      tms={true}
      minNativeZoom={6}
      maxNativeZoom={11}
      maxZoom={18}
      opacity={0.7}
      zIndex = {1000}
      attribution="Soil Moisture data"
    />
  )
}

export default Soilmoisture