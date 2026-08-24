import { TileLayer } from 'react-leaflet'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'

function WaterQualityTiles() {
  const map = useMap()

  useEffect(() => {
    const handleMapClick = (e) => {
      // collect lat/lng and fetch water quality data from backend
      fetch(`http://127.0.0.1:5000/water_quality?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
        .then(async (res) => {
          const data = await res.json()

          if (!res.ok) {
            throw new Error(data.error || 'Could not load water quality data')
          }

          return data
        })
        .then(data => {
          // create popup content based on the water quality data
          const popupContent = `
            <div style="font-size: 12px;">
              <strong>Vattenkvalitet</strong><br/>
              Klassificering: ${data.water_quality_type}
            </div>
          `
          L.popup()
            .setLatLng(e.latlng)
            .setContent(popupContent)
            .openOn(map)
        })
        .catch(err => console.error("Popup error:", err))
    }

    // add click listener to the map
    map.on('click', handleMapClick)

    // Cleanup function to remove the click listener when the component unmounts
    return () => map.off('click', handleMapClick)
  }, [map])

  return (
    <TileLayer
      url="/waterquality_tiles4/{z}/{x}/{y}.png"
      tms={true}
      minNativeZoom={6}
      maxNativeZoom={11}
      maxZoom={18}
      opacity={0.7}
      zIndex = {1000}
      attribution="Water quality data"
    />
  )
}

export default WaterQualityTiles