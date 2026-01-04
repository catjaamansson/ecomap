import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function FieldStudyLayers() {
  const map = useMap()
  const layerRef = useRef(null)

  // Färger för olika markanvändningstyper
  const landUseColors = {
    "Tättbebyggda områden": "#b25858ff",
    "Bostadsområden": "#f0e68c",
    "Industriområden": "#daa520",
    "Vägar och järnvägar": "#583a29ff",
    "Kustområden": "#779a9aff",
    "Flygplatser": "#7c5dadff",
    "Mineralutvinningsplatser": "#779a9aff",
    "Sophanteringsplatser": "#556b2fff",
    "Byggarbetsplatser": "#8b7355",
    "Stadsnära områden": "#d9c1b0ff",
    "Sport- och fritidsanläggningar": "#cbafd5ff",
    "Åkermark": "#a6c33cff",
    "Fruktodling": "#ffb347",
    "Betesmarker": "#9cbe45ff",
    "Permanent odling": "#9acd32",
    "Jordbruk": "#b2d576ff",
    "Lövskog": "#71a771ff",
    "Barrskog": "#3d673dff",
    "Blandad skog": "#71a771ff",
    "Sjöar och vattendrag": "#6da3e0ff",
    "Vatten - bäck och å": "#6da3e0ff",
    "Torvmossar": "#5f9ea0",
    "Kustområden": "#6da3e0ff",
    "Våtmarker": "#5d9f97ff",
    "Bebyggelse - spridd": "#ff6b6b",
    "Bebyggelse - övrig": "#ff8c8c",
    "Bebyggelse - vägar och vägnät": "#3d7d1f",
    "Öppen mark - annan": "#c0c0c0",
    "Naturlig gräsmark": "#2e5f1eff",
    "Öppen mark - sandig mark": "#f5deb3",
    "Öppen mark - grus och sten": "#d3d3d3",
    "Havsområde": "#7196b1ff",
    "Jordbruk - fruktodling": "#ffb347",
    "Kustlagun": "#6da3e0ff",
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