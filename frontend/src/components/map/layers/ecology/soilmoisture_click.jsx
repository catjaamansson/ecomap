import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function SoilmoistureClickPopup() {
  console.log('SoilmoistureClickPopup mounted')
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const handleMapClick = (e) => {
      console.log('clicked soil moisture map', e.latlng)

      fetch(`http://127.0.0.1:5000/api/soil_moisture_point?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
        .then(async (res) => {
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Could not load soil moisture data')
          return data
        })
        .then((data) => {
          // Säker utläsning som hanterar både label, saknade värden och undefined
          let displayText = 'No Data Available'

          if (data.label) {
            displayText = data.label
          } else if (data.value !== undefined && data.value !== null) {
            displayText = `Soil Moisture: ${data.value}%`
          }

          L.popup()
            .setLatLng(e.latlng)
            .setContent(`
              <div style="font-size: 13px; font-family: sans-serif; color: #223D2D; padding: 2px;">
                <strong style="font-size: 14px; display: block; margin-bottom: 4px;">Soil Moisture</strong>
                <span>${displayText}</span>
              </div>
            `)
            .openOn(map)
        })
        .catch((err) => console.error('Popup error:', err))
    }

    map.on('click', handleMapClick)

    return () => {
      map.off('click', handleMapClick)
      map.closePopup()
    }
  }, [map])

  return null
}

export default SoilmoistureClickPopup