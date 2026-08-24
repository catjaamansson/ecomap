import Sidebar from '../components/sidebar/fieldstudysidebar.jsx';
import { useState } from 'react';
import Navbar from '../components/navbar.jsx';
import Mapview from '../components/map/mapview.jsx';
import Landuselayers from '../components/map/layers/fieldstudy/landuselayer_tiles.jsx';
import Waterbodieslayers from '../components/map/layers/ecology/soilmosturetiles.jsx';
import LandUseClickPopup from '../components/map/layers/fieldstudy/landuse_click.jsx';
import { AreaDrawer } from '../components/map/areadraw.jsx';
import AreaSummaryModel from '../components/map/areasummary_model.jsx';

function FieldStudy() {
  const [active, setActive] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedAreaSqM, setSelectedAreaSqM] = useState(null);
  const [isDrawingArea, setIsDrawingArea] = useState(false);

  // Tar emot både sqMeters och geojson från AreaDrawer
  const handleAreaCalculated = async ({ sqMeters, geojson }) => {
    // Om ytan raderats eller saknas
    if (!geojson || !sqMeters) {
      setAnalysisData(null);
      setSelectedAreaSqM(null);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/analyze-area', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geometry: geojson.geometry, sqMeters })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Serverfel (${res.status})`);
      }

      const data = await res.json();
      setAnalysisData(data); // Visar äkta data från Python
      setSelectedAreaSqM(sqMeters);
    } catch (err) {
      console.error('Kunde inte nå backend:', err);
      setAnalysisData(null); // Rensar fejkdata
      setSelectedAreaSqM(null);
      alert(`Analysen misslyckades: ${err.message}`);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/leaf.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
        width: '100%',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        backgroundColor: '#356d4fff',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Navbar låst i toppen över kartan */}
      <div style={{ position: 'sticky', top: 0, zIndex: 2000, width: '100%' }}>
        <Navbar />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '60px', padding: '30px', flex: 1 }}>
        <div style={{ position: 'relative', zIndex: 900 }}>
          <Sidebar active={active} setActive={setActive} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', position: 'relative', zIndex: 1 }}>
          
          {/* Map Container */}
          <div
            style={{
              height: '400px',
              width: '100%',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Mapview center={[55.6229, 13.3486]} zoom={9.4}>
              {active === 'landUse' && !isDrawingArea && (
                <>
                  <Landuselayers />
                  <LandUseClickPopup />
                </>
              )}
              {active === 'waterbodies' && <Waterbodieslayers />}
              {active === 'bufferZone' && <Waterbodieslayers />}

              <AreaDrawer 
                onAreaCalculated={handleAreaCalculated} 
                onDrawingChange={setIsDrawingArea}
                />
            </Mapview>
          </div>

          {/* Area Summary Rendered Below Map */}
          <AreaSummaryModel
            data={analysisData}
            selectedAreaSqM={selectedAreaSqM}
            onClose={() => setAnalysisData(null)}
          />

        </div>
      </div>
    </div>
  );
}

export default FieldStudy;