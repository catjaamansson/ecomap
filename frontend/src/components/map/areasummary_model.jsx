import React, { useState } from 'react';

const COLORS = {
  background: '#214B2A',
  panel: '#D5E5D7',
  panelMuted: '#C4DCC8',
  active: '#6F967C',
  activeDark: '#3F6B4A',
  border: '#B8CCBC',
  heading: '#173B23',
  text: '#294735',
  mutedText: '#647568',
  white: '#FFFFFF'
};

export default function AreaSummaryModel({ data, selectedAreaSqM, loading, error, onClose }) {
  // Alla flikar startar stängda som default
  const [openLayers, setOpenLayers] = useState({});
  const [viewMode, setViewMode] = useState('summary');

  const toggleLayer = (layerKey) => {
    setOpenLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const getLayerSummary = (layer, layerKey) => {
    const breakdown = Array.isArray(layer.breakdown) ? layer.breakdown : [];
    const meanMoisture = layer.data?.mean_moisture;
    const normalizedLayerKey = layerKey.toLowerCase();
    const getCategory = (item) => item.type || item.label || item.name || 'Unknown area type';
    const getPercent = (item) => {
      const value = Number(item.percent ?? item.percentage);
      return Number.isFinite(value) ? value : null;
    };

    if (typeof meanMoisture === 'number') {
      return [`Average soil moisture: ${meanMoisture}%`];
    }

    if (breakdown.length === 0) {
      return [normalizedLayerKey.includes('flood')
        ? 'Flooding data: unavailable'
        : 'Data: unavailable'];
    }

    if (normalizedLayerKey.includes('flood')) {
      const floodedArea = breakdown.find((item) => getCategory(item).toLowerCase().includes('flood'));
      const floodedPercent = floodedArea ? getPercent(floodedArea) : null;
      return floodedPercent === null
        ? ['Flooded area: percentage unavailable']
        : [`Flooded area: ${floodedPercent.toFixed(1)}%`];
    }

    if (normalizedLayerKey.includes('landuse')) {
      const commonLandUses = [...breakdown]
        .sort((first, second) => (getPercent(second) ?? 0) - (getPercent(first) ?? 0))
        .slice(0, 3)
        .map((item) => {
          const percent = getPercent(item);
          return percent === null
            ? getCategory(item)
            : `${getCategory(item)}: ${percent.toFixed(1)}%`;
        });
      return commonLandUses;
    }

    if (normalizedLayerKey.includes('forest')) {
      const forestArea = breakdown.find((item) => getCategory(item).toLowerCase().includes('forest'));
      const forestPercent = forestArea ? getPercent(forestArea) : null;
      const summary = forestPercent === null
        ? 'Forest cover: present'
        : `Forest cover: ${forestPercent.toFixed(1)}%`;
      if (forestPercent === null || forestPercent <= 0) {
        return [summary];
      }
      return [summary];
    }

    if (normalizedLayerKey.includes('waterbod')) {
      const waterArea = breakdown.find((item) => getCategory(item).toLowerCase().includes('water'));
      const waterPercent = waterArea ? getPercent(waterArea) : null;
      const summary = waterPercent === null
        ? 'Water coverage: present'
        : `Water coverage: ${waterPercent.toFixed(1)}%`;
      if (waterPercent === null || waterPercent <= 0) {
        return [summary];
      }
      return [summary];
    }

    return breakdown.map((item) => {
      const percent = getPercent(item);
      return percent === null
        ? `${getCategory(item)}: present`
        : `${getCategory(item)}: ${percent.toFixed(1)}%`;
    });
  };

  const getLayerRecommendations = (layer, layerKey) => {
    const breakdown = Array.isArray(layer.breakdown) ? layer.breakdown : [];
    const normalizedLayerKey = layerKey.toLowerCase();
    const getCategory = (item) => item.type || item.label || item.name || '';
    const getPercent = (item) => {
      const value = Number(item.percent ?? item.percentage);
      return Number.isFinite(value) ? value : null;
    };

    if (normalizedLayerKey.includes('flood')) {
      const floodedArea = breakdown.find((item) => getCategory(item).toLowerCase().includes('flood'));
      const floodedPercent = floodedArea ? getPercent(floodedArea) : null;
      if (floodedPercent !== null && floodedPercent > 0) {
        return floodedPercent >= 20
          ? [
              'Restore or create wetlands to retain excess water.',
              'Keep flood-prone areas free from new permanent construction.'
            ]
          : ['Protect natural drainage paths and keep floodplain vegetation intact.'];
      }
      return [];
    }

    if (normalizedLayerKey.includes('landuse')) {
      const categories = breakdown.map((item) => getCategory(item).toLowerCase());
      const recommendations = [];
      if (categories.some((category) => category.includes('arable') || category.includes('agricultural'))) {
        recommendations.push('Use vegetated buffer strips to reduce nutrient runoff from agricultural land.');
      }
      if (categories.some((category) => category.includes('pasture'))) {
        recommendations.push('Use rotational grazing to protect pasture soil and nearby waterways.');
      }
      if (categories.some((category) => category.includes('urban') || category.includes('residential'))) {
        recommendations.push('Add trees, rain gardens and green corridors to improve urban biodiversity.');
      }
      return recommendations;
    }

    if (normalizedLayerKey.includes('forest')) {
      const forestArea = breakdown.find((item) => getCategory(item).toLowerCase().includes('forest'));
      const forestPercent = forestArea ? getPercent(forestArea) : null;
      if (forestPercent === null || forestPercent <= 0) return [];
      return forestPercent >= 30
        ? [
            'Install bird nests to support local birdlife in areas with substantial forest cover.',
            'Keep dead wood and connected forest patches to support insects and small wildlife.'
          ]
        : ['Protect existing forest habitat and add bird nests where suitable.'];
    }

    if (normalizedLayerKey.includes('waterbod')) {
      const waterArea = breakdown.find((item) => getCategory(item).toLowerCase().includes('water'));
      const waterPercent = waterArea ? getPercent(waterArea) : null;
      if (waterPercent === null || waterPercent <= 0) return [];
      return [waterPercent >= 30
        ? 'Create meandering river sections to improve habitats and natural water flow.'
        : 'Protect existing water habitats and riverbanks.',
        'Plant native vegetation along shorelines to reduce erosion and improve habitat.'];
    }

    if (normalizedLayerKey.includes('soilmoisture') || normalizedLayerKey.includes('soil_moisture')) {
      const meanMoisture = Number(layer.data?.mean_moisture);
      if (Number.isFinite(meanMoisture) && meanMoisture < 30) {
        return ['Increase soil cover and organic matter to retain moisture during dry periods.'];
      }
      if (Number.isFinite(meanMoisture) && meanMoisture >= 50) {
        return ['Protect wet soil areas from compaction and preserve natural water storage.'];
      }
      return [];
    }

    if (normalizedLayerKey.includes('waterquality')) {
      return breakdown.length > 0
        ? ['Create vegetated buffer zones to filter runoff before it reaches the water.']
        : [];
    }

    return [];
  };

  if (loading) {
    return (
      <div style={{ marginTop: '20px', backgroundColor: COLORS.panel, borderRadius: '15px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', fontFamily: 'system-ui, sans-serif', color: COLORS.text, textAlign: 'center', fontWeight: '600' }}>
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
      <div style={{ marginTop: '20px', backgroundColor: 'rgba(33, 75, 42, 0.78)', borderRadius: '15px', padding: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', fontFamily: 'system-ui, sans-serif', color: COLORS.white, textAlign: 'center' }}>
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
  const recommendations = Object.entries(layersData).flatMap(([layerKey, layer]) => (
    getLayerRecommendations(layer, layerKey)
  ));

  return (
    <div style={{ marginTop: '20px', backgroundColor: `rgba(33, 75, 42, 0.78)`, borderRadius: '15px', padding: '20px 24px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', fontFamily: 'system-ui, -apple-system, sans-serif', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px', borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '12px', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, color: COLORS.white, fontSize: '18px', fontWeight: '700' }}>
          Area Summary
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', padding: '3px', backgroundColor: 'rgba(255, 255, 255, 0.16)', borderRadius: '8px' }} role="group" aria-label="Summary display mode">
            {[
              { value: 'summary', label: 'Summary' },
              { value: 'exact', label: 'Exact values' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setViewMode(option.value)}
                aria-pressed={viewMode === option.value}
                style={{
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 10px',
                  backgroundColor: viewMode === option.value ? COLORS.panel : 'transparent',
                  color: viewMode === option.value ? COLORS.heading : COLORS.white,
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
          {onClose && (
            <button onClick={onClose} aria-label="Close area summary" style={{ border: 'none', background: COLORS.active, borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px', color: COLORS.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'start' }}>
        {/* Vänster spalt: Total Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignSelf: 'start' }}>
          <div style={{ backgroundColor: COLORS.active, border: `1px solid ${COLORS.border}`, padding: '16px', borderRadius: '10px' }}>
            <span style={{ fontSize: '11px', color: COLORS.white, fontWeight: '700', textTransform: 'uppercase' }}>
              Selected Area
            </span>
            <div style={{ fontSize: '24px', fontWeight: '800', color: COLORS.white, marginTop: '4px' }}>
              {totalHa} ha
            </div>
            <div style={{ fontSize: '13px', color: COLORS.white, marginTop: '2px' }}>
              ({totalSqmStr} m²)
            </div>
          </div>

          {viewMode === 'summary' && recommendations.length > 0 && (
            <div style={{ marginTop: '14px', padding: '14px 16px', backgroundColor: COLORS.panelMuted, border: `1px solid ${COLORS.border}`, borderRadius: '10px', color: COLORS.text }}>
              <strong style={{ display: 'block', color: COLORS.heading, fontSize: '13px' }}>
                Suggestions &amp; Recommendations
              </strong>
              <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '12px', textAlign: 'left' }}>
                {recommendations.map((recommendation, index) => (
                  <li key={index} style={{ padding: '2px 0', lineHeight: '1.35' }}>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Höger spalt: Dynamisk lista över lager */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: viewMode === 'summary' ? '0' : '12px',
          padding: viewMode === 'summary' ? '16px 18px' : '0',
          backgroundColor: viewMode === 'summary' ? COLORS.panel : 'transparent',
          border: viewMode === 'summary' ? `1px solid ${COLORS.border}` : 'none',
          borderRadius: viewMode === 'summary' ? '10px' : '0'
        }}>
          {Object.entries(layersData).map(([layerKey, layer]) => {
            const isOpen = !!openLayers[layerKey];
            const lowerKey = layerKey.toLowerCase();
            const isWaterQuality = lowerKey.includes('waterquality') || lowerKey.includes('water_quality');
            const hasWaterQualityResult = isWaterQuality && Array.isArray(layer.breakdown) && layer.breakdown.length > 0;

            if (viewMode === 'summary') {
              const summaryItems = getLayerSummary(layer, layerKey);
              const hasMultipleSummaryItems = summaryItems.length > 1;

              return (
                <div key={layerKey} style={{ padding: '0 0 14px', marginBottom: '14px' }}>
                  {hasMultipleSummaryItems ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                        <strong style={{ color: COLORS.heading, fontSize: '13px' }}>{layer.title || layerKey}</strong>
                        {hasWaterQualityResult && (
                          <span style={{ fontSize: '11px', color: COLORS.mutedText }}>(% of water area)</span>
                        )}
                      </div>
                      <ul style={{ margin: '6px 0 0', paddingLeft: '20px', color: COLORS.text, fontSize: '13px', textAlign: 'left' }}>
                        {summaryItems.map((summaryItem, index) => (
                          <li key={index} style={{ padding: '1px 0', lineHeight: '1.35' }}>
                            {summaryItem}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                        <strong style={{ color: COLORS.heading, fontSize: '13px' }}>{layer.title || layerKey}</strong>
                        {hasWaterQualityResult && (
                          <span style={{ fontSize: '11px', color: COLORS.mutedText }}>(% of water area)</span>
                        )}
                      </div>
                      <span style={{ color: COLORS.text, fontSize: '13px', textAlign: 'left' }}>
                        {summaryItems[0]}
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={layerKey} style={{ border: `1px solid ${COLORS.border}`, borderRadius: '10px', overflow: 'hidden' }}>
                <button
                  onClick={() => toggleLayer(layerKey)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: 'none',
                    backgroundColor: isOpen ? COLORS.activeDark : COLORS.panelMuted,
                    color: isOpen ? COLORS.white : COLORS.heading,
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

                  <span style={{ fontSize: '12px', color: isOpen ? COLORS.white : COLORS.mutedText }}>
                    {isOpen ? 'Hide ▲' : 'Show ▼'}
                  </span>
                </button>

                {isOpen && (
                  <div style={{ padding: '12px', backgroundColor: COLORS.panel }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {layer.breakdown && layer.breakdown.length > 0 ? (
                        layer.breakdown.map((item, index) => {
                          const hasSqm = typeof item.sqm === 'number' && Number.isFinite(item.sqm);
                          const itemPercent = item.percent ?? item.percentage ?? 0;
                          const itemSqm = hasSqm ? item.sqm : (itemPercent / 100) * selectedSqm;
                          const itemHa = (itemSqm / 10000).toFixed(2);
                          
                          // Räkna ut % mot ritad yta om sqm finns, annars ta backendens %
                          const realPercent = (hasSqm && selectedSqm > 0)
                            ? ((itemSqm / selectedSqm) * 100).toFixed(2)
                            : itemPercent;

                          return (
                            <div
                              key={index}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '13px',
                                padding: '8px 12px',
                                backgroundColor: COLORS.panelMuted,
                                borderRadius: '8px',
                                border: `1px solid ${COLORS.border}`
                              }}
                            >
                              <span style={{ color: COLORS.text, fontWeight: '500' }}>
                                {item.type || item.label}
                              </span>
                              <strong style={{ color: COLORS.heading }}>
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