import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import * as turf from '@turf/turf';

export function AreaDrawer({ 
  onAreaCreated, 
  onAreaSelected, 
  onAreaDeleted, 
  onDrawingChange, 
  clearTrigger,
  activeAreaId 
}) {
  const map = useMap();

  // 1. Spara alla callbacks i refs för att förhindra att useEffect körs om vid varje ändring
  const callbacksRef = useRef({ onAreaCreated, onAreaSelected, onAreaDeleted, onDrawingChange });
  useEffect(() => {
    callbacksRef.current = { onAreaCreated, onAreaSelected, onAreaDeleted, onDrawingChange };
  }, [onAreaCreated, onAreaSelected, onAreaDeleted, onDrawingChange]);

  // Ta bort alla områden när radering triggas globalt
  useEffect(() => {
    if (!map || !map.pm) return;
    if (clearTrigger) {
      const geomanLayers = map.pm.getGeomanLayers();
      geomanLayers.forEach((layer) => {
        if (layer._areaId === activeAreaId) {
          map.removeLayer(layer);
        }
      });
    }
  }, [clearTrigger, map, activeAreaId]);

  useEffect(() => {
    if (!map || !map.pm) return;

    const defaultStyle = {
      color: '#2e6f40',
      fillColor: '#4caf50',
      fillOpacity: 0.35,
      weight: 3,
    };

    map.pm.setPathOptions(defaultStyle);

    map.pm.addControls({
      position: 'topleft',
      drawFreehand: true,
      drawPolygon: true,
      drawRectangle: false,
      drawText: false,   
      editMode: true,
      dragMode: true,
      removalMode: true,
      rotateMode: false,
      drawPolyline: false,
      drawCircle: false,
      drawCircleMarker: false,
      drawMarker: false,
      cutPolygon: false,
    });

    map.on('pm:drawstart', () => callbacksRef.current.onDrawingChange?.(true));
    map.on('pm:drawend', () => callbacksRef.current.onDrawingChange?.(false));

    const createPopupContent = (areaSqM) => {
      let primaryArea = '';
      let secondaryArea = '';

      if (areaSqM >= 10000) {
        primaryArea = `${(areaSqM / 10000).toFixed(2)} ha`;
        secondaryArea = `${Math.round(areaSqM).toLocaleString('sv-SE')} m²`;
      } else {
        primaryArea = `${Math.round(areaSqM).toLocaleString('sv-SE')} m²`;
        secondaryArea = `${(areaSqM / 10000).toFixed(4)} ha`;
      }

      return `
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
    };

    const handleCreate = (e) => {
      const layer = e.layer;
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      layer._areaId = id;

      const initialGeojson = JSON.parse(JSON.stringify(layer.toGeoJSON()));
      const areaSqM = turf.area(initialGeojson);

      layer.bindPopup(createPopupContent(areaSqM), { className: 'custom-area-popup' }).openPopup();

      layer.on('click', () => {
        callbacksRef.current.onAreaSelected?.(id);
      });

      const handleUpdate = () => {
        const freshGeojson = JSON.parse(JSON.stringify(layer.toGeoJSON()));
        const freshAreaSqM = turf.area(freshGeojson);
        
        if (layer.getPopup()) {
          layer.getPopup().setContent(createPopupContent(freshAreaSqM));
        }

        // Använd callbacksRef så att anropen alltid skickas rätt utan att rendera om hela Geoman
        callbacksRef.current.onAreaCreated?.({ id, sqMeters: freshAreaSqM, geojson: freshGeojson });
        callbacksRef.current.onAreaSelected?.(id);
      };

      // Geoman redigerings-events
      layer.on('pm:edit', handleUpdate);
      layer.on('pm:dragend', handleUpdate);
      layer.on('pm:vertexchange', handleUpdate);
      layer.on('pm:markerdragend', handleUpdate);

      callbacksRef.current.onAreaCreated?.({ id, sqMeters: areaSqM, geojson: initialGeojson });
    };

    const handleRemove = (e) => {
      if (e.layer && e.layer._areaId) {
        callbacksRef.current.onAreaDeleted?.(e.layer._areaId);
      }
    };

    map.on('pm:create', handleCreate);
    map.on('pm:remove', handleRemove);

    return () => {
      map.off('pm:create', handleCreate);
      map.off('pm:remove', handleRemove);
      if (map.pm) map.pm.removeControls();
      map.off('pm:drawstart');
      map.off('pm:drawend');
    };
  }, [map]); // Kör BARA om när 'map' ändras, inga andra dependencies!

  // Uppdatera visuell markering
  useEffect(() => {
    if (!map || !map.pm) return;
    map.pm.getGeomanLayers().forEach((layer) => {
      if (layer._areaId === activeAreaId) {
        layer.setStyle?.({ color: '#154125', fillColor: '#2e7d32', fillOpacity: 0.5, weight: 4 });
      } else {
        layer.setStyle?.({ color: '#2e6f40', fillColor: '#4caf50', fillOpacity: 0.3, weight: 2 });
      }
    });
  }, [activeAreaId, map]);

  return null;
}