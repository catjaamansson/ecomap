import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function WaterQualityLayer({ geojson, showWaterQuality }) {
    const map = useMap()
    const layerRef = useRef(null)

    useEffect(() => {
        // Ta bort gamla lagret
        if (layerRef.current) {
            map.removeLayer(layerRef.current)
        }

        // Om data inte visas, sluta här
        if (!showWaterQuality) {
            return
        }

        // Om ingen data, sluta här
        if (!geojson || !geojson.features || geojson.features.length === 0) {
            return
        }

        // Färgklassificering baserat på vattenkvalitet
        const getColor = (waterQualityValue) => {
            // Klassificera vattenkvalitet värden
            
            if (waterQualityValue >= 1 && waterQualityValue <= 20) return '#1B1777' // Bra (grön)
            if (waterQualityValue >= 20 && waterQualityValue <= 40) return '#3465BA' // Acceptabel (gul)
            if (waterQualityValue >= 40 && waterQualityValue <= 60) return '#3D89D8' // Måttlig (orange)
            if (waterQualityValue >= 60 && waterQualityValue <= 80) return '#3CD0C2' // Dålig (röd)
            if (waterQualityValue >= 80 && waterQualityValue <= 100) return '#45CA84' // Mycket dålig (mörkröd)
            return '#8fd2cd' // Okänd (grå)
        }

        // Skapa nytt lager och lägg till på kartan
        const newLayer = L.geoJSON(geojson, {
            style: (feature) => {
                const value = feature.properties.water_quality_value || 0
                return {
                    fillColor: getColor(value),
                    fillOpacity: 0.6, 
                    color: getColor(value),
                    weight: 1,
                }
            },
            onEachFeature: (feature, layer) => {
                const props = feature.properties
                const popupContent = `
                    <div style="font-size: 12px;">
                        <strong>Vattenkvalitet</strong><br/>
                        Klassificering: ${props.water_quality_type}
                    </div>
                `
                layer.bindPopup(popupContent)
            }
        }).addTo(map)

        layerRef.current = newLayer
    }, [geojson, showWaterQuality, map])

    // Denna komponent renderar ingenting själv, bara Leaflet direkt
    return null
}

export default WaterQualityLayer
