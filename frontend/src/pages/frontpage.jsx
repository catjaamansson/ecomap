import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'

function Frontpage() {
  const pages = [
    { name: 'Hydrology', path: '/hydrology', image: '/images/hydrology.png' },
    { name: 'Ecology', path: '/ecology', image: '/images/ecology.png' },
    { name: 'Field study', path: '/field_study', image: '/images/fieldstudy.png' },
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
        width: '100%',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        backgroundColor: 'rgb(53, 109, 79)',
      }}
    >
      <Navbar />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', paddingLeft: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginTop: '40px' }}>
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
                fontFamily: 'Playfair Display, serif',
                transition: 'transform 0.3s ease',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <h2
                style={{
                  backgroundColor: 'rgba(34, 61, 45, 0.3)',
                  backdropFilter: 'blur(1px)',
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

        {/* Title Between */}
        <h2 style={{ 
          marginTop: '40px', 
          marginBottom: '20px', 
          color: 'white', 
          fontSize: '28px', 
          fontFamily: 'Playfair Display, serif',
          textAlign: 'center' 
        }}>
          Explore features
        </h2>

        {/* Text Input Boxes Container */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px', marginBottom: '40px', justifyContent: 'center' }}>
          {/* First Text Input */}
          <div
            contentEditable="true"
            suppressContentEditableWarning={true}
            style={{
              width: '300px',
              minHeight: '150px',
              padding: '15px',
              borderRadius: '10px',
              border: '2px solid #8edb97',
              backgroundColor: 'rgba(34, 61, 45, 0.5)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              fontFamily: 'Playfair Display, serif',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              outline: 'none',
              cursor: "pointer",
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ fontSize: '24px', margin: '0 0 10px 0', fontWeight: 'bold', color: 'white' }}>
              Hydrology
            </h3>
            <p style={{ fontSize: '14px', margin: '0', lineHeight: '1.6', color: 'white' }}>
              Explore water levels, water quality and potential flooding areas.
            </p>
          </div>
          
          {/* Second Text Input */}
          <div
            contentEditable="true"
            suppressContentEditableWarning={true}
            style={{
              width: '300px',
              minHeight: '150px',
              padding: '15px',
              borderRadius: '10px',
              border: '2px solid #8edb97',
              backgroundColor: 'rgba(34, 61, 45, 0.5)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              fontFamily: 'Playfair Display, serif',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              outline: 'none',
              cursor: "pointer",
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ fontSize: '24px', margin: '0 0 10px 0', fontWeight: 'bold', color: 'white' }}>
              Ecology
            </h3>
            <p style={{ fontSize: '14px', margin: '0', lineHeight: '1.6', color: 'white' }}>
              Explore vegetation types, habitats and threatened species in the area.
            </p>
          </div>
        </div>

        {/* Second Row Text Input Boxes Container */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px', marginBottom: '40px', justifyContent: 'center' }}>
          {/* Third Text Input */}
          <div
            contentEditable="true"
            suppressContentEditableWarning={true}
            style={{
              width: '300px',
              minHeight: '150px',
              padding: '15px',
              borderRadius: '10px',
              border: '2px solid #8edb97',
              backgroundColor: 'rgba(34, 61, 45, 0.5)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              fontFamily: 'Playfair Display, serif',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              outline: 'none',
              cursor: "pointer",
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ fontSize: '24px', margin: '0 0 10px 0', fontWeight: 'bold', color: 'white' }}>
              Field Study
            </h3>
            <p style={{ fontSize: '14px', margin: '0', lineHeight: '1.6', color: 'white' }}>
              Explore landuse, buffert zones and on-site environmental observations.
            </p>
          </div>
          
          {/* Fourth Text Input */}
          <div
            contentEditable="true"
            suppressContentEditableWarning={true}
            style={{
              width: '300px',
              minHeight: '150px',
              padding: '15px',
              borderRadius: '10px',
              border: '2px solid #8edb97',
              backgroundColor: 'rgba(34, 61, 45, 0.5)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              fontFamily: 'Playfair Display, serif',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              outline: 'none',
              cursor: "pointer",
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ fontSize: '24px', margin: '0 0 10px 0', fontWeight: 'bold', color: 'white' }}>
              Custom
            </h3>
            <p style={{ fontSize: '14px', margin: '0', lineHeight: '1.6', color: 'white' }}>
              Explore hydrology, ecology, and field study data combined into a single map.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Frontpage;
