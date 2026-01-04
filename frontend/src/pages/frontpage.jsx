import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/navbar.jsx'

function Frontpage() {
  const pages = [
    { name: 'Hydrology', path: '/hydrology', image: '/images/hydrology.png' },
    { name: 'Ecology', path: '/ecology', image: '/images/ecology.png' },
    { name: 'Field study', path: '/field_study', image: '/images/field_study.png' },
    { name: 'Custom', path: '/custom', image: '/images/custom.png' }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? pages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === pages.length - 1 ? 0 : prev + 1))
  }

  const currentPage = pages[currentIndex]

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
      <Navbar />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 80px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            style={{
              fontSize: '28px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#223D2D',
              padding: '10px'
            }}
          >
            ❮
          </button>

          {/* Image/Card */}
          <Link to={currentPage.path} style={{ textDecoration: 'none' }}>
            <div
              style={{
                width: '600px',
                height: '400px',
                backgroundImage: `url(${currentPage.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'left',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <h2
                style={{
                  backgroundColor: 'rgba(34, 61, 45, 0.7)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '32px',
                  textAlign: 'center',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
                }}
              >
                {currentPage.name}
              </h2>

            </div>
          </Link>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            style={{
              fontSize: '28px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#223D2D',
              padding: '10px'
            }}
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  )
}

export default Frontpage;
