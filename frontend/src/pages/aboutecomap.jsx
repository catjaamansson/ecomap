import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import { useEffect } from 'react';

function AboutEcomap() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{
            backgroundImage: "url('/leaf.svg')",
            backgroundRepeat: 'repeat',
            backgroundSize: '200px',
            width: '100%',
            minHeight: '100vh',
            margin: 0,
            padding: 0,
            backgroundColor: '#3E663A'
        }}>
            <Navbar />

            <div style={{
                padding: '40px',
                maxWidth: '800px',
                margin: '0 auto',
                color: 'white',
                minHeight: 'calc(100vh - 80px)'
            }}>
                <h1 style={{
                    fontSize: '32px',
                    marginBottom: '5px',
                    fontFamily: 'Playfair Display, serif'
                }}>
                    About EcoMap
                </h1>
                <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    EcoMap is an interactive platform for exploring environmental data and understanding how landscapes, water and ecosystems interact.
                </p>

                <div style={{ marginTop: '35px' }}>
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '0px', color: '#8edb97' }}>
                            Explore the Map
                        </h2>
                        <p style={{ fontSize: '16px', lineHeight: '1.8', marginTop: '3px' }}>
                            Draw an area on the map to compare flooding, land use, forest coverage, soil moisture, water bodies and water quality.
                        </p>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '0px', color: '#8edb97' }}>
                            Area Analysis
                        </h2>
                        <p style={{ fontSize: '16px', lineHeight: '1.8', marginTop: '3px' }}>
                            Switch between a compact summary and exact values to understand the most important characteristics of a selected area.
                        </p>
                    </div>

                    <div style={{ marginBottom: '0px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '0px', color: '#8edb97' }}>
                            Environmental Insight
                        </h2>
                        <p style={{ fontSize: '16px', lineHeight: '1.8', marginTop: '3px' }}>
                            EcoMap brings several environmental perspectives together to support informed decisions about habitats, water management and land use.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default AboutEcomap
