import Sidebar from '../components/sidebar/customsidebar.jsx';
import { useState } from 'react';
import Navbar from '../components/navbar.jsx';
import Mapview from '../components/map/mapview.jsx';

function Custom() {

    
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

        <Sidebar active="custom" />

        <div style={{ marginTop: '0px', flex: 1, height: '100%', width: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Mapview center={[55.6229, 13.3486]} zoom={9.4}>
          </Mapview>
        </div>

        
        </div>
    </div>  
    );
} 

export default Custom;