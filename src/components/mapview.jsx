import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Mapview() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer
        center={[59.3293, 18.0686]}  // Stockholm
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
      </MapContainer>
    </div>
  );
}

export default Mapview;