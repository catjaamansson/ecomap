import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import { useEffect } from 'react';

function Contact() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div style={{
            backgroundImage: "url('/leaf.svg')",
            backgroundRepeat: 'repeat',
            backgroundSize: '200px',
            width: '100%',
            margin: 0,
            padding: 0,
            backgroundColor: '#356d4f'
        }}>
            <Navbar />
            
            <div style={{ 
                padding: '40px', 
                maxWidth: '800px', 
                margin: '0 auto', 
                color: 'white'
            }}>
                <h1 style={{ 
                    fontSize: '32px', 
                    marginBottom: '0px', 
                    fontFamily: 'Playfair Display, serif' 
                }}>
                    Contact & Feedback
                </h1>
                <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    Thanks for using EcoMap! 
                </p>
                
                <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    We would love to hear your feedback and suggestions for improvement, please feel free to contact us:
                </ul>
                <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    <a href="mailto:ecomap@gmail.com" style={{ 
    color: '#ffffff', 
    textDecoration: 'none',
    fontSize: '16px', 
    fontWeight: 'bold'
}}>
    Email: ecomap@gmail.com
</a>
                </ul>
                <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    <a href="https://github.com/catjaamansson" target="_blank" rel="noopener noreferrer" style={{
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '16px', 
    fontWeight: 'bold'
}}>
    GitHub: catjaamansson
</a>
                </ul>
                <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    <a href="https://www.linkedin.com/in/catja-m%C3%A5nsson-076736345/" target="_blank" rel="noopener noreferrer" style={{
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold'
}}>
    LinkedIn: Catja Månsson
</a>
                </ul>
            </div>
            
            <Footer />
        </div>
    )
}

export default Contact

