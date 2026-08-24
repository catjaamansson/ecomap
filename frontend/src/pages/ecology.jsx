import Navbar from '../components/navbar.jsx';
import Mapview from '../components/map/mapview.jsx';
import { useState } from 'react';
import Ecosidebar from '../components/sidebar/ecosidebar.jsx';
import ForestLayer from '../components/map/layers/ecology/forestlayer.jsx';
import Soilmoisture from '../components/map/layers/ecology/soilmosturetiles.jsx';
import Footer from '../components/footer.jsx';

const ProtectedAreasLayer = () => null;
const ThreatenedAnimalsLayer = () => null;

function Ecology() {
    const [active, setActive] = useState(null);
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
  
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '60px', padding: '30px', flex:"1" }}>
        <Ecosidebar active={active} setActive={setActive} />

        <div style={{ marginTop: '0px', flex: 1, height: '100%', width: '70vw', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Mapview center={[55.6229, 13.3486]} zoom={9.4}>
            {active === 'vegetation' && <ForestLayer key="vegetation" />}
            {active === 'soil_moisture' && <Soilmoisture key="soil_moisture" />}
            {active === 'protected_areas' && <ProtectedAreasLayer />}
            {active === 'threatened_animals' && <ThreatenedAnimalsLayer />}
          </Mapview>
        </div>
    </div>
    <Footer />
    </div>  
    );
} 

export default Ecology;