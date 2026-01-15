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
            if (waterQualityValue >= 1 && waterQualityValue <= 2) return '#00AA00' // Bra (grön)
            if (waterQualityValue >= 3 && waterQualityValue <= 4) return '#FFFF00' // Medel (gul)
            if (waterQualityValue >= 5 && waterQualityValue <= 6) return '#FFA500' // Dålig (orange)
            if (waterQualityValue >= 7) return '#FF0000' // Mycket dålig (röd)
            return '#808080' // Okänd (grå)
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
                        Värde: ${props.water_quality_value}<br/>
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
