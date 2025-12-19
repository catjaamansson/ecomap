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
    
    <h1 className="font-bold" style={{ fontFamily: 'serif', letterSpacing: '0.05em', color: '#223D2D', fontSize: '120px', margin: 0, padding: '40px', textAlign: 'center' }}>EcoMap</h1>
    
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '60px', padding: '40px' }}>
        <Ecosidebar active={active} setActive={setActive} />

        <div style={{ marginTop: '20px', flex: 1, height: '80vh', width: '70vw'}}>
          <Mapview center={[55.7047, 13.1910]} zoom={10}>
          </Mapview>
        </div>
    </div>
    </div>  
    );
} 

export default Ecology;