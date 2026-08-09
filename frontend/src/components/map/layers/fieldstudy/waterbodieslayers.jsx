import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function WaterBodiesLayer() {
  const map = useMap()
  const layerRef = useRef(null)

  console.log('WaterBodiesLayer mounted, map:', map)

  // color mapping for different water body types
  const waterColors = {
    "Sjöar": "#1e90ff",           // Djup blå
    "Vattendrag": "#4169e1",      // Blå
    "Våtmarker": "#87ceeb",       // Ljus blå
    "Grundvatten": "#00bfff",     // Cyan
    "Nodata/Okänd": "#ffffff"
  }

  useEffect(() => {
    console.log('WaterBodiesLayer useEffect, map:', map)
    if (!map) {
      console.log('Map not available, returning')
      return
    }

    // remove existing layer if it exists
    if (layerRef.current) {
      map.removeLayer(layerRef.current)
    }

    // fetch water bodies data from backend
    console.log('Fetching waterbodies data...')
    fetch('http://127.0.0.1:5000/waterbodies')
      .then(res => res.json())
      .then(data => {
        console.log('Waterbodies data loaded:', data)
        
        // filter out features with "Ingen vattencykel" and create new GeoJSON layer  
        const waterFeatures = {
          ...data,
          features: data.features.filter(
            feature => feature.properties?.water_bodies_type !== "Ingen vattencykel"
          )
        }
        
        const geoJsonLayer = L.geoJSON(waterFeatures, {
          style: (feature) => {
            const waterType = feature.properties?.water_bodies_type
            const color = waterColors[waterType] || '#1e90ff'
            
            return {
              color: color,
              fillColor: color,
              fillOpacity: 0.7,
              weight: 1
            }
          },
          onEachFeature: (feature, layer) => {
            const type = feature.properties?.water_bodies_type
            const value = feature.properties?.water_bodies_value
            layer.bindPopup(`
              <strong>Vattentyp:</strong> ${type}<br>
              <strong>Värde:</strong> ${value}
            `)
          }
        }).addTo(map)
        
        layerRef.current = geoJsonLayer
      })
      .catch(error => console.error('Error loading waterbodies data:', error))

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
      }
    }
  }, [map])

  return null
}

export default WaterBodiesLayer
