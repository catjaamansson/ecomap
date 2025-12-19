import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function FloodLayer({ geojson, level }) {
    const map = useMap()
    const layerRef = useRef(null)

    useEffect(() => {
        // Ta bort gamla lagret
        if (layerRef.current) {
            map.removeLayer(layerRef.current)
        }

        // Om ingen data, sluta här
        if (!geojson || !geojson.features || geojson.features.length === 0) {
            return
        }

        // Skapa nytt lager och lägg till på kartan
        const newLayer = L.geoJSON(geojson, {
            style: {
                fillColor: '#2c7be5',
                fillOpacity: 0.4, 
                color: '#2c7be5',
                weight: 0,
            }
        }).addTo(map)

        layerRef.current = newLayer
    }, [geojson, level, map])

    // Denna komponent renderar ingenting själv, bara Leaflet direkt
    return null
}

export default FloodLayer