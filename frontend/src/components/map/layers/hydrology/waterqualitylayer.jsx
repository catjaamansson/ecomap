import { useEffect, useRef , useState} from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function WaterQualityLayer({ showWaterQuality }) {
    const map = useMap()
    const layerRef = useRef(null)
    const [geojson, setGeojson] = useState(null)

    useEffect(() => {
        
        if (!showWaterQuality) {
            return
        }

        console.log('Fetching water quality data')
        fetch('http://127.0.0.1:5000/water_quality')
            .then(res => res.json())
            .then(data => {
                console.log('Fetched water quality data:', data)
                setGeojson(data)
            })
            .catch(err => console.error("Fetch water quality error:", err))
    }, [showWaterQuality])

    useEffect(() => {
        // remove existing layer
        if (layerRef.current) {
            map.removeLayer(layerRef.current)
        }

        // if showWaterQuality is false, don't add layer
        if (!showWaterQuality) {
            return
        }

        // safety check for geojson data
        if (!geojson || !geojson.features || geojson.features.length === 0) {
            return
        }

        // color function based on water quality value
        const getColor = (waterQualityValue) => {
            // classification based on water quality value
            
            if (waterQualityValue >= 1 && waterQualityValue <= 20) return '#1B1777' // Good (green)
            if (waterQualityValue >= 20 && waterQualityValue <= 40) return '#3465BA' // Acceptable (yellow)
            if (waterQualityValue >= 40 && waterQualityValue <= 60) return '#3D89D8' // Fair (orange)
            if (waterQualityValue >= 60 && waterQualityValue <= 80) return '#3CD0C2' // Poor (red)
            if (waterQualityValue >= 80 && waterQualityValue <= 100) return '#45CA84' // Very Poor (dark red)
            return 'transparent' 
        }

        // create new GeoJSON layer
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

        // Cleanup - remove layer when showWaterQuality becomes false
        return () => {
            if (layerRef.current) {
                map.removeLayer(layerRef.current)
            }
        }
    }, [geojson, showWaterQuality, map])

    // if showWaterQuality is false, return null to avoid rendering anything
    return null
}

export default WaterQualityLayer
