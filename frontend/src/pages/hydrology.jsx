import Sidebar from '../components/sidebar.jsx';
import Mapview from '../components/map/mapview.jsx';
import HydrologyLayers from '../components/map/layers/hydrology/hydrologylayers.jsx';

function Hydrology() {
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
      }}
      >
    
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '60px', padding: '40px' }}>

        <Sidebar active="hydrology" />

        <h1 className="font-bold" style={{ fontFamily: 'serif', letterSpacing: '0.05em', color: '#223D2D', fontSize: '120px', margin: 0, padding: 0 }}>EcoMap</h1>
        
        <div style={{ marginTop: '20px', flex: 1, height: '80vh'  }}>
          <Mapview center={[55.7047, 13.1910]} zoom={13}>
            <HydrologyLayers />
          </Mapview>
        </div>
        </div>
    </div>  
    );
} 

export default Hydrology;