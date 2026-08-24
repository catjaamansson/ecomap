import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import { useEffect } from 'react'

function PrivacyPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

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
                maxWidth: '900px', 
                margin: '0 auto 20px', 
                color: 'white'
            }}>
                <h1 style={{ 
                    fontSize: '32px', 
                    marginBottom: '20px', 
                    fontFamily: 'Playfair Display, serif' 
                }}>
                    Privacy Policy
                </h1>

                <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '30px' }}>
                    <strong>Last updated: August 2026</strong>
                </p>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#8edb97' }}>
                        1. Introduction
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                        EcoMap is committed to protecting your privacy. This Privacy Policy explains our practices regarding data collection and how we handle your information when you use our application.
                    </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#8edb97' }}>
                        2. Data Collection
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '15px' }}>
                        <strong>We do NOT collect or store any personal data.</strong>
                    </p>
                    <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                        EcoMap operates entirely in your browser. We do not:
                    </p>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '15px' }}>
                        • Collect names, email addresses, or personal information<br/>
                        • Store user interactions or sessions<br/>
                        • Create user accounts or profiles<br/>
                        • Track individual users across sessions<br/>
                        • Use cookies for tracking purposes
                    </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#8edb97' }}>
                        3. Data Sources
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '15px' }}>
                        EcoMap displays environmental and geographical data from third-party sources:
                    </p>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '15px' }}>
                        • <strong>Copernicus</strong> - Satellite imagery and environmental data<br/>
                        • <strong>SMHI</strong> - Swedish Meteorological and Hydrological Institute data<br/>
                        • <strong>Lantmäteriet</strong> - Swedish National Land Survey data<br/>
                        • <strong>Artdatabanken</strong> - Species and habitat information<br/>
                        • <strong>Leaflet</strong> - Map rendering library (OpenStreetMap)
                    </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#8edb97' }}>
                        4. Browser Storage
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                        Any data generated while using EcoMap is stored only on your device in your browser's local storage. This data:
                    </p>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '15px' }}>
                        • Is never sent to our servers<br/>
                        • Remains under your complete control<br/>
                        • Can be deleted by clearing your browser cache<br/>
                        • Is not accessible to us or any third parties
                    </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#8edb97' }}>
                        5. Third-Party Services
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                        EcoMap may use third-party services for map rendering and data visualization. These services may collect technical information such as:
                    </p>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '15px' }}>
                        • IP addresses<br/>
                        • Browser type and version<br/>
                        • Approximate geographic location (via IP)
                    </p>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', marginTop: '15px' }}>
                        Please review the privacy policies of Leaflet, OpenStreetMap, and Copernicus for more information.
                    </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#8edb97' }}>
                        6. Your Rights
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                        Since we do not collect or store personal data, there is no personal information to access, modify, or delete. However, you have full control over any data stored locally on your device.
                    </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#8edb97' }}>
                        7. Security
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                        EcoMap is designed with privacy-first principles. All processing occurs locally in your browser, minimizing data exposure. However, no system is 100% secure. We recommend using HTTPS connections and keeping your browser updated.
                    </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#8edb97' }}>
                        8. Changes to This Policy
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. Your continued use of EcoMap constitutes your acceptance of any changes.
                    </p>
                </div>

                <div style={{ marginBottom: '0px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '0px', color: '#8edb97' }}>
                        9. Contact Us
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                        If you have questions about this Privacy Policy or our privacy practices, please contact us:
                    </p>
                    <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                        • <a href="mailto:ecomap@gmail.com" style={{ color: '#8edb97', textDecoration: 'none' }}>Email: ecomap@gmail.com</a><br/>
                        • <a href="https://github.com/catjaamansson" target="_blank" rel="noopener noreferrer" style={{ color: '#8edb97', textDecoration: 'none' }}>GitHub: github.com/catjaamansson</a>
                    </p>
                </div>
            </div>
            
            <Footer />
        </div>
    )
}

export default PrivacyPolicy
