import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function FieldStudyLayers() {
  const map = useMap()
  const layerRef = useRef(null)

  useEffect(() => {
    if (!map) return

    // Ta bort gamla lagret om det finns
    if (layerRef.current) {
      map.removeLayer(layerRef.current)
    }

    // Markanvändning WMS Layer från Kartverket
    const wmsLayer = L.tileLayer.wms(
      "https://wms.gis.nyc/image/wmts/1.0.0/NYCImagery2019/default/GoogleMapsCompatible_Level21/{z}/{x}/{y}.jpg",
      {
        attribution: "Markanvändning"
      }
    ).addTo(map)

    layerRef.current = wmsLayer

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
      }
    }
  }, [map])

  return null
}

export default FieldStudyLayers
