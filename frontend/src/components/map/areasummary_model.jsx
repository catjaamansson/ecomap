import React, { useState } from 'react';

export default function AreaSummaryModel({ data, selectedAreaSqM, loading, error, onClose }) {
  // Alla flikar startar stängda som default
  const [openLayers, setOpenLayers] = useState({});

  const toggleLayer = (layerKey) => {
    setOpenLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  if (loading) {
    return (
      <div style={{ marginTop: '20px', backgroundColor: '#ffffff', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', fontFamily: 'system-ui, sans-serif', color: '#1b432a', textAlign: 'center', fontWeight: '600' }}>
        Analysing area, please wait...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginTop: '20px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', fontFamily: 'system-ui, sans-serif', color: '#991b1b', textAlign: 'center' }}>
        <strong>Error loading data:</strong> {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ marginTop: '20px', backgroundColor: '#ffffff', borderRadius: '15px', padding: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', fontFamily: 'system-ui, sans-serif', color: '#6b7280', textAlign: 'center', border: '2px dashed #d1d5db' }}>
        <strong>No area selected:</strong> Draw an area on the map to see the summary
      </div>
    );
  }

  const selectedSqm = selectedAreaSqM ?? data.total_sqm;
  const totalHa = (selectedSqm / 10000).toFixed(2);
  const totalSqmStr = Math.round(selectedSqm).toLocaleString('sv-SE');

  const layersData = data.layers || {
    landUse: {
      title: 'Land Use Coverage',
      breakdown: data.breakdown || []
    }
  };

  return (
    <div style={{ marginTop: '20px', backgroundColor: '#ffffff', borderRadius: '15px', padding: '20px 24px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', fontFamily: 'system-ui, -apple-system, sans-serif', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
        <h3 style={{ margin: 0, color: '#1b432a', fontSize: '18px', fontWeight: '700' }}>
          Area Summary
        </h3>
        {onClose && (
          <button onClick={onClose} style={{ border: 'none', background: '#f3f4f6', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'start' }}>
        {/* Vänster spalt: Total Area */}
        <div style={{ backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9', padding: '16px', borderRadius: '10px', position: 'sticky', top: '10px' }}>
          <span style={{ fontSize: '11px', color: '#2e6f40', fontWeight: '700', textTransform: 'uppercase' }}>
            Selected Area
          </span>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#1b432a', marginTop: '4px' }}>
            {totalHa} ha
          </div>
          <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '2px' }}>
            ({totalSqmStr} m²)
          </div>
        </div>

        {/* Höger spalt: Dynamisk lista över lager */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(layersData).map(([layerKey, layer]) => {
            const isOpen = !!openLayers[layerKey];
            const lowerKey = layerKey.toLowerCase();
            const isWaterQuality = lowerKey.includes('waterquality') || lowerKey.includes('water_quality');

            return (
              <div key={layerKey} style={{ border: '1px solid #c8e6c9', borderRadius: '10px', overflow: 'hidden' }}>
                <button
                  onClick={() => toggleLayer(layerKey)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: 'none',
                    backgroundColor: isOpen ? '#e8f5e9' : '#f9fafb',
                    color: '#1b432a',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{layer.title || layerKey}</span>
                    {isWaterQuality && (
                      <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#4b5563' }}>
                        (% of water area)
                      </span>
                    )}
                  </div>

                  <span style={{ fontSize: '12px', color: '#4b5563' }}>
                    {isOpen ? 'Hide ▲' : 'Show ▼'}
                  </span>
                </button>

                {isOpen && (
                  <div style={{ padding: '12px', backgroundColor: '#ffffff' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {layer.breakdown && layer.breakdown.length > 0 ? (
                        layer.breakdown.map((item, index) => {
                          const hasSqm = typeof item.sqm === 'number' && item.sqm > 0;
                          const itemSqm = hasSqm ? item.sqm : (item.percent / 100) * selectedSqm;
                          const itemHa = (itemSqm / 10000).toFixed(2);
                          
                          // Räkna ut % mot ritad yta om sqm finns, annars ta backendens %
                          const realPercent = (hasSqm && selectedSqm > 0)
                            ? ((itemSqm / selectedSqm) * 100).toFixed(2)
                            : item.percent;

                          return (
                            <div
                              key={index}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '13px',
                                padding: '8px 12px',
                                backgroundColor: '#f9fafb',
                                borderRadius: '8px',
                                border: '1px solid #f3f4f6'
                              }}
                            >
                              <span style={{ color: '#374151', fontWeight: '500' }}>
                                {item.type || item.label}
                              </span>
                              <strong style={{ color: '#1b432a' }}>
                                {isWaterQuality ? (
                                  `${item.percent}%`
                                ) : (
                                  `${itemHa} ha (${realPercent}%)`
                                )}
                              </strong>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', padding: '4px' }}>
                          No data available for this layer in the selected area.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}