import Sidebar from '../components/sidebar/hydrosidebar.jsx';
import { useState } from 'react';
import Navbar from '../components/navbar.jsx';
import Mapview from '../components/map/mapview.jsx';

function FieldStudy() {

    
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

        <Sidebar active="field_study" />

        <div style={{ marginTop: '20px', flex: 1, height: '80vh', width: '70vw'}}>
          <Mapview center={[55.7047, 13.1910]} zoom={10}>
          </Mapview>
        </div>

        
        </div>
    </div>  
    );
} 

export default FieldStudy;