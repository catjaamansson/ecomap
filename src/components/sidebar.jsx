import { Link } from 'react-router-dom'

const Sidebar = ({ active }) => (
  <div 
    style={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      padding: '25px',
      backgroundColor: '#345742ff',
      width: '220px',
      borderRadius: '20px',        // rundad menycontainer
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
    }}
  >
  <Link to="/hydrology">
    <button 
      style={{
        width: '100%',
        padding: '15px',
        textAlign: 'center',
        backgroundColor: '#597D68',
        color: '#223D2D',
        border: active === 'hydrology' ? '2px solid #86DB90' : 'none',
        borderRadius: '12px',      // rundade symmetriska knappar
        cursor: 'pointer'
      }}>
      Hydrology
    </button>
    </Link>  

  <Link to="/ecology">
    <button 
      style={{
        width: '100%',
        padding: '15px',
        textAlign: 'center',
        backgroundColor: '#597D68',
        color: '#223D2D',
        border: active === 'ecology' ? '2px solid #86DB90' : 'none',
        borderRadius: '12px',
        cursor: 'pointer'
      }}>
      Ecology
    </button>
    </Link>

  <Link to="/field_study">
    <button 
      style={{
        width: '100%',
        padding: '15px',
        textAlign: 'center',
        backgroundColor: '#597D68',
        color: '#223D2D',
        border: active === 'field_study' ? '2px solid #86DB90' : 'none',
        borderRadius: '12px',
        cursor: 'pointer'
      }}>
      Field study
    </button>
    </Link>

  <Link to="/custom">
    <button 
      style={{
        width: '100%',
        padding: '15px',
        textAlign: 'center',
        backgroundColor: '#597D68',
        color: '#223D2D',
        border: active === 'custom' ? '2px solid #86DB90' : 'none',
        borderRadius: '12px',
        cursor: 'pointer'
      }}>
      Custom
    </button>
    </Link>

  </div>
);

export default Sidebar;