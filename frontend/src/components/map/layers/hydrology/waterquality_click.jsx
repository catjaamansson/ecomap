import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function WaterQualityClickPopup() {
  const map = useMap()

  useEffect(() => {
    const handleMapClick = async (event) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/water_quality?lat=${event.latlng.lat}&lng=${event.latlng.lng}`
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Could not load water quality data')
        }

        L.popup()
          .setLatLng(event.latlng)
          .setContent(`
            <div style="font-size: 12px;">
              <strong>Water Quality</strong><br/>
              Classification: ${data.water_quality_type}
            </div>
          `)
          .openOn(map)
      } catch (error) {
        console.error('Water quality popup error:', error)
      }
    }

    map.on('click', handleMapClick)
    return () => map.off('click', handleMapClick)
  }, [map])

  return null
}

export default WaterQualityClickPopup