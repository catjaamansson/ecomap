import { useEffect, useState } from 'react'
// import ForestLayer from './forestlayer'  // TODO: optimera forest

function EcologyLayers({ threatLevel }) {
  const [species, setSpecies] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`http://127.0.0.1:5000/species?threat=${threatLevel}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched species:', data)
        setSpecies(data.species || [])
      })
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false))
  }, [threatLevel])

  if (loading) {
    return (
      <>
        {/* <ForestLayer /> */}
        <div>Laddar arter...</div>
      </>
    )
  }

  return (
    <>
      {/* <ForestLayer /> */}
      <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      padding: '15px',
      backgroundColor: 'white',
      borderRadius: '8px',
      maxHeight: '250px',
      maxWidth: '250px',
      overflowY: 'auto',
      fontSize: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 1000
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#223D2D' }}>
        {threatLevel}: {species.length} arter
      </h3>
      {species.length > 0 ? (
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {species.slice(0, 10).map((sp, idx) => (
            <li key={idx} style={{ marginBottom: '6px', lineHeight: '1.2' }}>
              <strong>{sp.swedish_name}</strong>
            </li>
          ))}
          {species.length > 10 && <li>... och {species.length - 10} fler</li>}
        </ul>
      ) : (
        <p>Inga arter funna.</p>
      )}
      </div>
    </>
  )
}

export default EcologyLayers
