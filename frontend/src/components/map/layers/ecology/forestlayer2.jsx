import { useEffect, useRef, useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function ForestLayer() {
    const map = useMap()
    const layerRef = useRef(null)
    const [geojson, setGeojson] = useState(null)

    useEffect(() => {
    console.log('Fetching forest data')
        fetch('http://127.0.0.1:5000/forest2')
            .then(res => res.json())
            .then(data => {
                console.log('Fetched forest data:', data)
                setGeojson(data)
            })
            .catch(err => console.error("Fetch forest error:", err))
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

        // Färgklassificering baserat på skogsvärde
        const getColor = (forestValue) => {
            // Klassificera skogsvärde
            
            if (forestValue = 2) return '#205137' // barrskog
            if (forestValue = 1) return '#1b6c46' // lövskog
        }

        // Skapa nytt lager och lägg till på kartan
        const newLayer = L.geoJSON(geojson, {
            style: (feature) => {
                const value = feature.properties.forest_value || 0
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
                        <strong>Skogstyp</strong><br/>
                        Klassificering: ${props.forest_type}
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

export default ForestLayer
