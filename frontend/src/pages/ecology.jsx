import Navbar from '../components/navbar.jsx';
import Mapview from '../components/map/mapview.jsx';
import { useState } from 'react';
import Ecosidebar from '../components/sidebar/ecosidebar.jsx';

function Ecology() {
    const [active, setActive] = useState(null);

    
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
    
    
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '60px', padding: '40px' }}>
        <Ecosidebar active={active} setActive={setActive} />

        <div style={{ marginTop: '0px', flex: 1, height: '74vh', width: '70vw', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Mapview center={[55.5543, 13.2428]} zoom={10}>
          </Mapview>
        </div>
    </div>
    </div>  
    );
} 

export default Ecology;