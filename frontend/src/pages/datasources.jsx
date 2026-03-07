import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import { useEffect } from 'react';

function Datasources() {
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
            backgroundColor: '#356d4f'
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
                    Data Sources
                </h1>
                <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    This application uses the following data sources:
                </p>
                <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '0px', color: '#8edb97' }}>
                            Map
                        </h2>
                        <ul style={{ fontSize: '16px', lineHeight: '1.0', listStyle: 'none', paddingLeft: 0 , marginTop: '10px' , marginBottom: '0px' }}>
                            <li><strong>Leaflet</strong> - Interactive maps</li>
                        </ul>
                </div>
                <div style={{ marginTop: '35px' }}>
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '0px', color: '#8edb97' }}>
                            Hydrology Data
                        </h2>
                        <ul style={{ fontSize: '16px', lineHeight: '2', listStyle: 'none', paddingLeft: 0 , marginTop: '3px' , marginBottom: '0px' }}>
                            <li><strong>DEM</strong> - Radar imagery</li>
                            <li><strong>Sentinel-2</strong> - Multispectral imagery</li>
                            <li><strong>Sentinel-3</strong> - Ocean and land color data</li>
                            <li><strong>Sentinel-5P</strong> - Atmospheric composition</li>
                        </ul>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '0px', color: '#8edb97' }}>
                            Ecology Data
                        </h2>
                        <ul style={{ fontSize: '16px', lineHeight: '2', listStyle: 'none', paddingLeft: 0 , marginTop: '3px' , marginBottom: '0px' }}>
                            <li><strong>SMHI</strong> - Temperature and precipitation</li>
                            <li><strong>ERA5</strong> - Atmospheric reanalysis</li>
                            <li><strong>SMOS</strong> - Soil moisture</li>
                        </ul>
                    </div>

                    <div style={{ marginBottom: '0px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '0px', color: '#8edb97' }}>
                            Field Study Data
                        </h2>
                        <ul style={{ fontSize: '16px', lineHeight: '2', listStyle: 'none', paddingLeft: 0 , marginTop: '3px' , marginBottom: '0px' }}>
                            <li><strong>Lantmäteriet</strong> - Land use and elevation</li>
                            <li><strong>Artdatabanken</strong> - Species and habitats</li>
                            <li><strong>CORINE</strong> - Land cover classification</li>
                        </ul>
                    </div>

                </div>
            </div>
            
            <Footer />
        </div>
    )
}

export default Datasources

