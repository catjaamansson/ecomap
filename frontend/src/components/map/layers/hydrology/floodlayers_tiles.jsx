import { TileLayer } from 'react-leaflet'

function Floodlayers({level=1}) {
  const tileUrl = `/tiles_flood/flood_${level}m_tiles_new2/{z}/{x}/{y}.png`;

  return (
    <TileLayer
      url={tileUrl}
      tms={true}
      minNativeZoom={6}
      maxNativeZoom={11}
      maxZoom={18}
      opacity={0.8}
      zIndex = {1000}
      attribution="Flood data"
    />
  )
}

export default Floodlayers