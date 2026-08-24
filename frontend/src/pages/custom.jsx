import Navbar from '../components/navbar.jsx';
import Mapview from '../components/map/mapview.jsx';
import { useState } from 'react';
import {Marker, Popup} from 'react-leaflet';

import Customsidebar from '../components/sidebar/customsidebar.jsx';
import ForestLayer from '../components/map/layers/ecology/forestlayer.jsx';
import Soilmoisture from '../components/map/layers/ecology/soilmosturetiles.jsx';
import Landuselayers from '../components/map/layers/fieldstudy/landuselayer_tiles.jsx';
import Waterbodieslayers from '../components/map/layers/ecology/soilmosturetiles.jsx';
import Waterquality from '../components/map/layers/hydrology/waterquality_tiles.jsx';
import { useEffect } from 'react';
import Flooding from '../components/map/layers/hydrology/floodlayers_tiles.jsx';
import LandUseClickPopup from '../components/map/layers/fieldstudy/landuse_click.jsx';

const ProtectedAreasLayer = () => null;
const ThreatenedAnimalsLayer = () => null;

function Custom() {
    const [active, setActive] = useState(null);
    const [waterLevel, setWaterLevel] = useState(0);
    console.log('ecology.jsx - active state:', active);
    return (
      <div
            style={{
            backgroundImage: "url('/leaf.svg')",
            backgroundRepeat: 'repeat',
            backgroundSize: '200px',
        width: '100%',
        height: '100vh',
        margin: 0,
        padding: 0,
        backgroundColor: '#356d4f',
        display: 'flex',
        flexDirection: 'column'
      }}
      >
    <Navbar />
    
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '60px', padding: '30px', flex: "1"}}>
        
        <Customsidebar active={active} setActive={setActive} setWaterLevel={setWaterLevel} />

        <div style={{ marginTop: '0px', flex: 1, height: '100%', width: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Mapview center={[55.6229, 13.3486]} zoom={9.4}>
            {active === 'vegetation' && <ForestLayer key="vegetation" />}
            {active === 'soil_moisture' && <Soilmoisture key="soil_moisture" />}
            {active === 'protected_areas' && <ProtectedAreasLayer />}
            {active === 'threatened_animals' && <ThreatenedAnimalsLayer />}
            {active === 'landUse' && <Landuselayers />}
            {active === 'waterbodies' && <Waterbodieslayers />}
            {active === 'waterquality' && <Waterquality />}
            {waterLevel > 0 && <Flooding level={waterLevel} />}
            <Marker position={[55.6229, 13.3486]}>
            <Popup>Test popup</Popup>
            </Marker>
            <LandUseClickPopup />
          </Mapview>
        </div>
        </div>
    </div>  
    );
} 

export default Custom;