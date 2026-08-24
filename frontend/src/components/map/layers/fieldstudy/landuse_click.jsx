import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function LandUseClickPopup() {
  console.log('LandUseClickPopup mounted')
  const map = useMap() // LÄGG TILL: Hämta kartinstansen

  useEffect(() => {
    if (!map) return

    // LÄGG TILL: Funktion för vad som händer vid klick
    const handleMapClick = (e) => {
      console.log('clicked landuse map', e.latlng)

      fetch(`http://127.0.0.1:5000/api/land_use?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
        .then(async (res) => {
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Could not load land use data')
          return data
        })
        .then((data) => {
          L.popup()
            .setLatLng(e.latlng)
            .setContent(`
              <div style="font-size: 12px;">
                <strong>Land Use</strong><br/>
                Type: ${data.land_use_type?.name || data.land_use_value}<br/>
                Description: ${data.land_use_type?.description || 'N/A'}<br/>
              </div>
            `)
            .openOn(map)
        })
        .catch((err) => console.error('Popup error:', err))
    }

    map.on('click', handleMapClick)

    // LÄGG TILL (NYCKELRADERNA): Stänger popupen när man byter lager
    return () => {
      map.off('click', handleMapClick)
      map.closePopup() // <-- Denna stänger popupen automatiskt
    }
  }, [map])

  return null
}

export default LandUseClickPopup