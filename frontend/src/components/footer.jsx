import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={{
      backgroundColor: 'rgba(25, 56, 25, 0.6)',
      color: 'white',
      padding: '20px 10px 20px',
      marginTop: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Main Footer Content */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', maxWidth: '1200px', margin: '0 auto 40px' }}>
        {/* Logo */}
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            fontFamily: 'Playfair Display, serif',
            fontSize: '28px', 
            margin: '0 0 10px 0',
            color: '#ffffff',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
          }}>EcoMap</h2>
        </div>

        {/* Features Column */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>FEATURES</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{marginBottom: '10px' }}>
              <Link to="/hydrology" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px' }}>Hydrology</Link>
            </li>
            <li style={{marginBottom: '10px' }}>
              <Link to="/ecology" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px' }}>Ecology</Link>
            </li>
            <li style={{marginBottom: '10px' }}>
              <Link to="/field_study" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px' }}>Field Study</Link>
            </li>
            <li>
              <Link to="/custom" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px' }}>Custom</Link>
            </li>
          </ul>
        </div>

        {/* Project Column */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>PROJECT</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style = {{ marginBottom: '10px' }}>
              <Link to="/datasources" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px' }}>Data sources</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/contact" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px' }}>Contact & Feedback</Link>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>LEGAL</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/privacypolicy" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '10px', paddingBottom: "10px", display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', fontSize: '14px', color: '#ffffff' }}>
        <div>© Sweden - Catja Månsson - 2026</div>
        <div style={{ display: 'flex', gap: '10px' }}>
        </div>
      </div>
    </footer>
  )
}

export default Footer