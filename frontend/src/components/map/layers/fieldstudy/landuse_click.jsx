import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function LandUseClickPopup() {
  console.log('LandUseClickPopup mounted')
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const handleMapClick = (e) => {
      console.log('clicked landuse map', e.latlng)

      fetch(`http://127.0.0.1:5000/api/land_use?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
        .then(async (res) => {
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Could not load land use data')
          return data
        })
        .then((data) => {
          // Robust utläsning oavsett om land_use_type är ett objekt eller en sträng
          const typeName = 
            data.land_use_type?.name || 
            (typeof data.land_use_type === 'string' ? data.land_use_type : null) ||
            data.type ||
            data.name ||
            `Code ${data.land_use_value}`

          const description = 
            data.land_use_type?.description || 
            data.description || 
            'N/A'

          L.popup()
            .setLatLng(e.latlng)
            .setContent(`
              <div style="font-size: 12px; font-family: sans-serif;">
                <strong>Land Use</strong><br/>
                Type: ${typeName}<br/>
                Description: ${description}<br/>
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

export default LandUseClickPopup