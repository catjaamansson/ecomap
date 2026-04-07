import { TileLayer } from 'react-leaflet'

function ForestLayer() {
  return (
    <TileLayer
      url="/tiles/{z}/{x}/{y}.png"
      tms={true}
      minNativeZoom={6}
      maxNativeZoom={11}
      maxZoom={18}
      opacity={1.0}
      zIndex = {1000}
      attribution="Forest data"
    />
  )
}

export default ForestLayer