import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function ForestLayer() {
  const map = useMap()
  const layerRef = useRef(null)

  // Färger för olika skogstyper
  const forestColors = {
    "Öppen mark / Ingen skog": "#f5f5f5",
    "Öppen mark / Gles vegetation": "#fffacd",
    
    "Barrskog - tät": "#1a5c1a",
    "Barrskog - glest": "#2d7a2d",
    
    "Lövskog - tät": "#6ba346",
    "Lövskog - glest": "#85c94a",
    
    "Blandad skog - tät": "#2d5a2d",
    "Blandad skog - glest": "#4a7a4a",
    
    "Ungskog - barrskog": "#4a9a4a",
    "Ungskog - lövskog": "#7aaa7a",
    
    "Myr/Torvmark": "#8b7355",
    "Myr - bewuxen": "#a0826d",
    
    "Nodata/Okänd": "#ffffff"
  }

  useEffect(() => {
    if (!map) return

    // Ta bort gamla lagret om det finns
    if (layerRef.current) {
      map.removeLayer(layerRef.current)
    }

    // Hämta skogsdata från backend
    fetch('http://127.0.0.1:5000/forest')
      .then(res => res.json())
      .then(data => {
        console.log('Forest data loaded:', data)
        
        const geoJsonLayer = L.geoJSON(data, {
          style: (feature) => {
            const forestType = feature.properties?.forest_type
            const color = forestColors[forestType] || '#90ee90'
            
            return {
              color: color,
              fillColor: color,
              fillOpacity: 0.6,
              weight: 0.5
            }
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties?.forest_type) {
              layer.bindPopup(`
                <strong>Skogstyp:</strong> ${feature.properties.forest_type}<br>
                <strong>Värde:</strong> ${feature.properties.forest_value}
              `)
            }
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
