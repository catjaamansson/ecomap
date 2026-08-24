import React, { useState } from 'react';

export default function AreaSummaryModel({ data, selectedAreaSqM, loading, error, onClose }) {
  const [showLandUse, setShowLandUse] = useState(false);
  // 1. Visas under tiden backend räknar
  if (loading) {
    return (
      <div
        style={{
          marginTop: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          fontFamily: 'system-ui, sans-serif',
          color: '#1b432a',
          textAlign: 'center',
          fontWeight: '600'
        }}
      >
         Analyserar markanvändning i valt område...
      </div>
    );
  }

  // 2. Visas om backend INTE svarar (Ingen fejkdata)
  if (error) {
    return (
      <div
        style={{
          marginTop: '20px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          fontFamily: 'system-ui, sans-serif',
          color: '#991b1b',
          textAlign: 'center'
        }}
      >
         <strong>Fel:</strong> {error}
      </div>
    );
  }

  // 3. Om ingen yta valts än
  if (!data) {
    return (
      <div
        style={{
          marginTop: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '15px',
          padding: '16px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          fontFamily: 'system-ui, sans-serif',
          color: '#6b7280',
          textAlign: 'center',
          border: '2px dashed #d1d5db'
        }}
      >
         <strong>Ingen yta vald:</strong> Rita en polygon på kartan för att analysera området.
      </div>
    );
  }

  // 4. Visas när ÄKTA data skickas tillbaka från Flask backend
  const selectedSqm = selectedAreaSqM ?? data.total_sqm;
  const totalHa = (selectedSqm / 10000).toFixed(2);
  const totalSqm = Math.round(selectedSqm).toLocaleString('sv-SE');

  return (
    <div
      style={{
        marginTop: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        padding: '20px 24px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '12px'
        }}
      >
        <h3 style={{ margin: 0, color: '#1b432a', fontSize: '18px', fontWeight: '700' }}>
          Area Summary & Land Use Breakdown
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: '#f3f4f6',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'start' }}>
        <div
          style={{
            backgroundColor: '#e8f5e9',
            border: '1px solid #c8e6c9',
            padding: '16px',
            borderRadius: '10px'
          }}
        >
          <span style={{ fontSize: '11px', color: '#2e6f40', fontWeight: '700', textTransform: 'uppercase' }}>
            Total Selected Area
          </span>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#1b432a', marginTop: '4px' }}>
            {totalHa} ha
          </div>
          <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '2px' }}>
            ({totalSqm} m²)
          </div>
        </div>

        <div>
          <button
            onClick={() => setShowLandUse((prev) => !prev)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #c8e6c9',
              backgroundColor: '#e8f5e9',
              color: '#1b432a',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            {showLandUse ? 'Hide land use' : 'Show land use'}
          </button>

          {showLandUse && (
            <>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '10px' }}>
                Land Use Coverage:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.breakdown &&
                  data.breakdown.map((item, index) => {
                    const itemHa = (item.sqm / 10000).toFixed(2);
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
                        <span style={{ color: '#374151', fontWeight: '500' }}>{item.type}</span>
                        <strong style={{ color: '#1b432a' }}>
                          {itemHa} ha ({item.percent}%)
                        </strong>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}