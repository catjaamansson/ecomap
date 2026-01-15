import { useState } from 'react';
import Hydrosidebar from '../components/sidebar/hydrosidebar.jsx';
import Mapview from '../components/map/mapview.jsx';
import Navbar from '../components/navbar.jsx'
import HydrologyLayers from '../components/map/layers/hydrology/hydrologylayers.jsx';

function Hydrology() {
    const [active, setActive] = useState(null);
    const [waterLevel, setWaterLevel] = useState(0);
    const [showWaterQuality, setShowWaterQuality] = useState(false);

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

        <Hydrosidebar active={active} setActive={setActive} setWaterLevel={setWaterLevel} showWaterQuality={showWaterQuality} setShowWaterQuality={setShowWaterQuality} />

        <div style={{ marginTop: '0px', flex: 1, height: '74vh', width: '70vw', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Mapview center={[55.5543, 13.2428]} zoom={10}>
            <HydrologyLayers level={waterLevel} showWaterQuality={showWaterQuality} />
          </Mapview>
        </div>
        
      </div>
    </div>  
    );
} 

export default Hydrology;