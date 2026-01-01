import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function FieldStudyLayers() {
  const map = useMap()
  const layerRef = useRef(null)

  // Färger för olika markanvändningstyper
  const landUseColors = {
    "Bebyggelse - tätt": "#ff0000",
    "Jordbruk - åkermark": "#f0e68c",
    "Jordbruk - permanent gräsmark": "#daa520",
    "Jordbruk - övrig jordbruksmark": "#bdb76b",
    "Skogsmark - tall": "#228b22",
    "Skogsmark - gran": "#1f6b1f",
    "Skogsmark - löv": "#32cd32",
    "Skogsmark - övrig skog": "#2d5016",
    "Skogsmark - blandad": "#3d7d1f",
    "Myr": "#8b7355",
    "Öppen fjällmark": "#d3d3d3",
    "Snötäckt fjäll": "#ffffff",
    "Vatten - sjö": "#4a90e2",
    "Vatten - bäck och å": "#87ceeb",
    "Vatten - kanal": "#5f9ea0",
    "Vatten - annan vattenarea": "#6495ed",
    "Våtmark": "#556b2f",
    "Bebyggelse - spridd": "#ff6b6b",
    "Bebyggelse - övrig": "#ff8c8c",
    "Bebyggelse - vägar och vägnät": "#808080",
    "Öppen mark - annan": "#c0c0c0",
    "Öppen mark - berg": "#a9a9a9",
    "Öppen mark - sandig mark": "#f5deb3",
    "Öppen mark - grus och sten": "#d3d3d3",
    "Jordbruk - fruktodling": "#ffb347",
    "Jordbruk - vingård": "#9932cc",
    "Jordbruk - annan permanent gröda": "#daa520",
    "Jordbruk - övrig": "#4692cfff",
    "Jordbruk - buskmark": "#8fbc8f",
    "Nodata/Okänd": "#070303ff"
  }

  useEffect(() => {
    if (!map) return

    // Ta bort gamla lagret om det finns
    if (layerRef.current) {
      map.removeLayer(layerRef.current)
    }

    // Hämta markanvändningsdata från backend
    fetch('http://127.0.0.1:5000/land_use')
      .then(res => res.json())
      .then(data => {
        console.log('Land use data loaded:', data)
        
        const geoJsonLayer = L.geoJSON(data, {
          style: (feature) => {
            const landUseType = feature.properties?.land_use_type
            const color = landUseColors[landUseType] || '#cccccc'
            
            return {
              color: color,
              fillColor: color,
              fillOpacity: 0.3,
              weight: 0.5
            }
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties?.land_use_type) {
              layer.bindPopup(`
                <strong>Markanvändning:</strong> ${feature.properties.land_use_type}<br>
                <strong>Värde:</strong> ${feature.properties.land_use_value}
              `)
            }
          }
        }).addTo(map)
        
        layerRef.current = geoJsonLayer
      })
      .catch(error => console.error('Error loading land use data:', error))

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
      }
    }
  }, [map])

  return null
}
export default FieldStudyLayers
