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
      justifyContent: 'center',
      alignItems: 'center',
      padding: '6px 20px',
      backgroundImage: 'radial-gradient(circle at 20% 50%, #4a8262 0%, #396449 100%)',
      position: 'sticky',
      top: 0,
      zIndex: 2000,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
    }}>
      
      <div style={{ display: 'flex', gap: '42px', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1600px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexShrink: 0,
        }}>
          <img
            src="/ecomap_logo.svg"
            alt="EcoMap logo"
            style={{
              width: '68px',
              height: '48px',
              objectFit: 'contain',
            }}
          />
          <span style={{
            color: '#223D2D',
            fontFamily: 'Playfair Display, serif',
            fontSize: '24px',
            fontWeight: '700',
            letterSpacing: '2px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
          }}>
            EcoMap
          </span>
        </div>
        
        {tabs.map((tab) => (
          <Link key={tab.label} to={tab.path} style={{ textDecoration: 'none' }}>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontFamily: 'Playfair Display, serif',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                border: location.pathname === tab.path ? '2px solid #8edb97' : 'none',
                borderBottom: location.pathname === tab.path ? '3px solid #8edb97' : 'none',
                borderRadius: '15px',
                cursor: 'pointer',
                fontSize: '15px',
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