import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import { AreaDrawer } from './areadraw.jsx';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function MapView({ 
  center, 
  zoom, 
  children, 
  onAreaCreated, 
  onAreaDeleted, 
  onAreaSelected,
  clearTrigger,
  activeAreaId 
}) {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AreaDrawer 
          onAreaCreated={onAreaCreated} 
          onAreaDeleted={onAreaDeleted} 
          onAreaSelected={onAreaSelected}
          clearTrigger={clearTrigger}
          activeAreaId={activeAreaId}
        />

        {children}
      </MapContainer>
    </div>
  )
}

export default MapView;

