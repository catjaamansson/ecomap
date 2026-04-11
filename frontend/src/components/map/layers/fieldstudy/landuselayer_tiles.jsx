import { TileLayer } from 'react-leaflet'

function Landuselayer() {
  return (
    <TileLayer
      url="/tiles_land_use/{z}/{x}/{y}.png"
      tms={true}
      minNativeZoom={6}
      maxNativeZoom={11}
      maxZoom={18}
      opacity={0.7}
      zIndex = {1000}
      attribution="Land use data"
    />
  )
}

export default Landuselayer