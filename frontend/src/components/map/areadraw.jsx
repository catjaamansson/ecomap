import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import * as turf from '@turf/turf';

export function AreaDrawer({ onAreaCalculated, onDrawingChange}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !map.pm) return;

    // appearance of the drawn area
    map.pm.setPathOptions({
      color: '#2e6f40',
      fillColor: '#4caf50',
      fillOpacity: 0.35,
      weight: 3,
    });

    // activate drawing tools
    map.pm.addControls({
      position: 'topleft',
      drawFreehand: true,     // freehand drawing
      drawPolygon: true,      // click to draw polygon
      drawRectangle: false,
      drawText: false,   
      editMode: true,         // edit vertices
      dragMode: true,         // drag the entire shape
      removalMode: true,      // delete
      rotateMode: false,      // turn off rotation
      drawPolyline: false,
      drawCircle: false,
      drawCircleMarker: false,
      drawMarker: false,
      cutPolygon: false,
    });

    map.on('pm:drawstart', () => {
    onDrawingChange?.(true)
    })

    map.on('pm:drawend', () => {
    onDrawingChange?.(false)
    })

    // Calculation and popup
    const updateAreaPopup = (layer) => {
      const geojson = layer.toGeoJSON();
      const areaSqM = turf.area(geojson);

      let primaryArea = '';
      let secondaryArea = '';

      if (areaSqM >= 10000) {
        primaryArea = `${(areaSqM / 10000).toFixed(2)} ha`;
        secondaryArea = `${Math.round(areaSqM).toLocaleString('sv-SE')} m²`;
      } else {
        primaryArea = `${Math.round(areaSqM).toLocaleString('sv-SE')} m²`;
        secondaryArea = `${(areaSqM / 10000).toFixed(4)} ha`;
      }

      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px; min-width: 130px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #6b7280; font-weight: 700; margin-bottom: 2px;">
            SELECTED AREA
          </div>
          <div style="font-size: 18px; font-weight: 700; color: #1b432a; margin-bottom: 2px;">
            ${primaryArea}
          </div>
          <div style="font-size: 11px; color: #4b5563;">
            (${secondaryArea})
          </div>
        </div>
      `;

      layer.bindPopup(popupContent, { className: 'custom-area-popup' }).openPopup();

      if (onAreaCalculated) {
        onAreaCalculated({ sqMeters: areaSqM, geojson });
      }
    };

    const handleCreate = (e) => {
      const layer = e.layer;
      updateAreaPopup(layer);

      layer.on('pm:edit', (evt) => updateAreaPopup(evt.target));
      layer.on('pm:dragend', (evt) => updateAreaPopup(evt.target));
    };

    map.on('pm:create', handleCreate);

    return () => {
      map.off('pm:create', handleCreate);
      if (map.pm) {
        map.pm.removeControls();
      }
        map.off('pm:drawstart')
        map.off('pm:drawend')
    };
  }, [map, onAreaCalculated]);

  return null;
}