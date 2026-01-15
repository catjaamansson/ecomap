import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function ForestLayer() {
  const map = useMap()
  const layerRef = useRef(null)

  console.log('ForestLayer mounted, map:', map)

  // Funktion för att få färg baserat på värde (0-255)
  // Gradient: blå → grön → gult → rött
  const getColorFromValue = (value) => {
    if (value === 255 || value === undefined) return '#ffffff'
    
    const normalized = Math.min(Math.max(value / 255, 0), 1)
    
    // Gradient från blå (0) → grön (0.33) → gult (0.66) → rött (1)
    if (normalized < 0.33) {
      // Blå → Grön
      const t = normalized / 0.33
      const r = Math.round(0 + (100 - 0) * t)
      const g = Math.round(50 + (200 - 50) * t)
      const b = Math.round(255 + (0 - 255) * t)
      return `rgb(${r}, ${g}, ${b})`
    } else if (normalized < 0.66) {
      // Grön → Gult
      const t = (normalized - 0.33) / 0.33
      const r = Math.round(100 + (255 - 100) * t)
      const g = Math.round(200 + (255 - 200) * t)
      const b = Math.round(0 + (0 - 0) * t)
      return `rgb(${r}, ${g}, ${b})`
    } else {
      // Gult → Rött
      const t = (normalized - 0.66) / 0.34
      const r = Math.round(255)
      const g = Math.round(255 + (100 - 255) * t)
      const b = Math.round(0)
      return `rgb(${r}, ${g}, ${b})`
    }
  }

  useEffect(() => {
    console.log('ForestLayer useEffect, map:', map)
    if (!map) {
      console.log('Map not available, returning')
      return
    }

    // Ta bort gamla lagret om det finns
    if (layerRef.current) {
      map.removeLayer(layerRef.current)
    }

    // Hämta skogsdata från backend
    console.log('Fetching forest data...')
    fetch('http://127.0.0.1:5000/forest')
      .then(res => res.json())
      .then(data => {
        console.log('Forest data loaded:', data)
        
        const geoJsonLayer = L.geoJSON(data, {
          style: (feature) => {
            const value = feature.properties?.forest_value
            const color = getColorFromValue(value)
            
            return {
              color: color,
              fillColor: color,
              fillOpacity: 0.7,
              weight: 0.5
            }
          },
          onEachFeature: (feature, layer) => {
            const type = feature.properties?.forest_type
            const value = feature.properties?.forest_value
            layer.bindPopup(`
              <strong>Skogstyp:</strong> ${type}<br>
              <strong>Värde:</strong> ${value}
            `)
          }
        }).addTo(map)
        
        layerRef.current = geoJsonLayer
      })
      .catch(error => console.error('Error loading forest data:', error))

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
      }
    }
  }, [map])

  return null
}

export default ForestLayer
