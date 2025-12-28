import Sidebar from '../components/sidebar/fieldstudysidebar.jsx';
import { useState } from 'react';
import Navbar from '../components/navbar.jsx';
import Mapview from '../components/map/mapview.jsx';
import FieldStudyLayers from '../components/map/layers/fieldstudylayers.jsx';

function FieldStudy() {

    
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

        <Sidebar active="field_study" />

        <div style={{ marginTop: '0px', flex: 1, height: '100%', width: '100%'}}>
          <Mapview center={[55.7047, 13.1910]} zoom={10}>
            <FieldStudyLayers />
          </Mapview>
        </div>

        
        </div>
    </div>  
    );
} 

export default FieldStudy;