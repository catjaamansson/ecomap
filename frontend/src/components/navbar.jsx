import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

function Navbar() {
  const tabs = [
    { label: "Home", path: "/" },
    { label: "Map", path: "/hydrology" },
    { label: "About Ecomap", path: "/ecology" },
    { label: "Data sources", path: "/field_study" },
    { label: "Custom", path: "/custom" }
  ]
  
  const location = useLocation()

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '6px 20px',
      background: `
  linear-gradient(
    to bottom,
    rgba(25, 56, 25, 1.0) 0%,
    rgba(25, 56, 25, 0.8) 55%,
    rgba(25, 56, 25, 0.6) 100%
  )
`,
      position: 'sticky',
      top: 0,
      zIndex: 2000,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
    }}>
      
      <div className="navbar-content">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          flexShrink: 0,
        }}>
          <img
            src="/ecomap_logo.svg"
            alt="EcoMap logo"
            style={{
              width: '84px',
              height: '58px',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
            }}
          />
          <span style={{
            color: '#ffffff',
            fontFamily: 'Playfair Display, serif',
            fontSize: '27px',
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
                border: location.pathname === tab.path ? '2px solid #A6BB77' : 'none',
                borderBottom: location.pathname === tab.path ? '3px solid #A6BB77' : 'none',
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