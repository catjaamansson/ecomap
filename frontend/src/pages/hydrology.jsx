import { useState } from 'react';
import Hydrosidebar from '../components/sidebar/hydrosidebar.jsx';
import Mapview from '../components/map/mapview.jsx';
import Navbar from '../components/navbar.jsx'
import HydrologyLayers from '../components/map/layers/hydrology/hydrologylayers.jsx';

function Hydrology() {
    const [active, setActive] = useState(null);
    const [waterLevel, setWaterLevel] = useState(0);

    return (
      <div
            style={{
            backgroundImage: "url('/leaf.svg')",
            backgroundRepeat: 'repeat',
            backgroundSize: '200px',
        width: '100vw',
        margin: 0,
        padding: 0,
        backgroundColor: '#356d4fff',
      }}
      >
    <Navbar />
    
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '60px', padding: '40px'}}>

        <Hydrosidebar active={active} setActive={setActive} setWaterLevel={setWaterLevel} />

        <div style={{ marginTop: '20px', flex: 1, height: '80vh', width: '70vw', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Mapview center={[55.7047, 13.1910]} zoom={10}>
            <HydrologyLayers level={waterLevel} />
          </Mapview>
        </div>
        
      </div>
    </div>  
    );
} 

export default Hydrology;