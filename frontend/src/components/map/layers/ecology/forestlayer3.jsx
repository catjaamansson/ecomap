import { TileLayer } from 'react-leaflet'

function ForestLayer() {
  return (
    <TileLayer
      url="/tiles/{z}/{x}/{y}.png"
      minZoom={6}
      maxZoom={10}
      opacity={0.8}
      attribution="Forest data"
    />
  )
}

export default ForestLayer