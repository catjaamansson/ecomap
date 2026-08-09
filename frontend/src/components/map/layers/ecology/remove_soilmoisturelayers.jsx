import { useEffect, useRef, useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function SoilMoistureLayer() {
    const map = useMap()
    const layerRef = useRef(null)
    const [geojson, setGeojson] = useState(null)

    useEffect(() => {
    console.log('Fetching soil moisture data')
        fetch('http://127.0.0.1:5000/soil_moisture')
            .then(res => res.json())
            .then(data => {
                console.log('Fetched soil moisture data:', data)
                setGeojson(data)
            })
            .catch(err => console.error("Fetch soil moisture error:", err))
    }, [])
    useEffect(() => {
        // Ta bort gamla lagret
        if (layerRef.current) {
            map.removeLayer(layerRef.current)
        }

        // Om data inte visas, sluta här
        if (!geojson) {
            return
        }

        // Om ingen data, sluta här
        if (!geojson || !geojson.features || geojson.features.length === 0) {
            return
        }

        // Färgklassificering baserat på jordfuktighet
        const getColor = (soilMoistureValue) => {
            // Klassificera jordfuktighet värden
            
            if (soilMoistureValue >= 1 && soilMoistureValue <= 20) return '#1B1777' // Bra (grön)
            if (soilMoistureValue >= 20 && soilMoistureValue <= 40) return '#3465BA' // Acceptabel (gul)
            if (soilMoistureValue >= 40 && soilMoistureValue <= 60) return '#3D89D8' // Måttlig (orange)
            if (soilMoistureValue >= 60 && soilMoistureValue <= 80) return '#3CD0C2' // Dålig (röd)
            if (soilMoistureValue >= 80 && soilMoistureValue <= 100) return '#45CA84' // Mycket dålig (mörkröd)
            return '#8fd2cd' // Okänd (grå)
        }

        // Skapa nytt lager och lägg till på kartan
        const newLayer = L.geoJSON(geojson, {
            style: (feature) => {
                const value = feature.properties.soil_moisture_value || 0
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
                        <strong>Jordfuktighet</strong><br/>
                        Klassificering: ${props.soil_moisture_type}
                    </div>
                `
                layer.bindPopup(popupContent)
            }
        }).addTo(map)

        layerRef.current = newLayer

        // Rensa upp vid avmontering
        return () => {
            if (layerRef.current) {
                map.removeLayer(layerRef.current)
            }
        }
    }, [geojson, map])

    // Denna komponent renderar ingenting själv, bara Leaflet direkt
    return null
}

export default SoilMoistureLayer
