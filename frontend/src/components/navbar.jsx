import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

function Navbar() {
  const tabs = [
    { label: "Home", path: "/" },
    { label: "Hydrology", path: "/hydrology" },
    { label: "Ecology", path: "/ecology" },
    { label: "Field Study", path: "/field_study" },
    { label: "Custom", path: "/custom" }
  ]
  
  const location = useLocation()

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '15px 20px',
      backgroundColor: '#35664A',
      borderBottom: '2px solid #2f573eff',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-around', width: '100%' }}>
        <h1 className="font-bold" style={{ 
          fontFamily: 'serif', 
          letterSpacing: '0.08em', 
          color: '#223D2D', 
          fontSize: '28px', 
          margin: 0, 
          padding: '0 20px',
          fontWeight: '700',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          letterSpacing: '2px'
        }}>EcoMap</h1>
        {tabs.map((tab) => (
          <Link key={tab.label} to={tab.path} style={{ textDecoration: 'none' }}>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: location.pathname === tab.path ? '2px solid #86DB90' : 'none',
                borderBottom: location.pathname === tab.path ? '3px solid #86DB90' : 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: location.pathname === tab.path ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navbar