import Sidebar from '../components/sidebar/fieldstudysidebar.jsx';
import { useState } from 'react';
import Navbar from '../components/navbar.jsx';
import Mapview from '../components/map/mapview.jsx';
import FieldStudyLayers from '../components/map/layers/fieldstudy/fieldstudylayers.jsx';

function FieldStudy() {
  const [active, setActive] = useState(null);

    
    return (
      <div
            style={{
            backgroundImage: "url('/leaf.svg')",
            backgroundRepeat: 'repeat',
            backgroundSize: '200px',
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        backgroundColor: '#356d4fff',
        display: 'flex',
        flexDirection: 'column'
      }}
      >
    <Navbar />
    
    
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '60px', padding: '40px', flex: 1, overflow: 'auto' }}>

        <Sidebar active={active} setActive={setActive} />

        <div style={{ marginTop: '0px', flex: 1, height: '100%', width: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Mapview center={[55.5543, 13.2428]} zoom={10}>
            {active === 'landUse' && <FieldStudyLayers />}
          </Mapview>
        </div>

        
        </div>
    </div>  
    );
} 

export default FieldStudy;