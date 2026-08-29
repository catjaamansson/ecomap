import Sidebar from '../components/sidebar/fieldstudysidebar.jsx';
import { useState, useEffect } from 'react'; // <-- LÄGG TILL useEffect
import Navbar from '../components/navbar.jsx';
import Mapview from '../components/map/mapview.jsx';
import Landuselayers from '../components/map/layers/fieldstudy/landuselayer_tiles.jsx';
import Waterbodieslayers from '../components/map/layers/ecology/waterbodiestiles.jsx';
import LandUseClickPopup from '../components/map/layers/fieldstudy/landuse_click.jsx';
import { AreaDrawer } from '../components/map/areadraw.jsx';
import AreaSummaryModel from '../components/map/areasummary_model.jsx';
import Footer from '../components/footer.jsx';

function FieldStudy() {
  const [active, setActive] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedAreaSqM, setSelectedAreaSqM] = useState(null);
  const [isDrawingArea, setIsDrawingArea] = useState(false);

  // reset analysisData and selectedAreaSqM when active changes
  useEffect(() => {
    setAnalysisData(null);
    setSelectedAreaSqM(null);
  }, [active]);

  // receive area data from AreaDrawer and send it to backend for analysis
  const handleAreaCalculated = async ({ sqMeters, geojson }) => {
    if (!geojson || !sqMeters) {
      setAnalysisData(null);
      setSelectedAreaSqM(null);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/analyze-area', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          geometry: geojson.geometry, 
          sqMeters,
          layer: active || 'landuse' // send the active layer to backend for analysis
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Serverfel (${res.status})`);
      }

      const data = await res.json();
      setAnalysisData(data);
      setSelectedAreaSqM(sqMeters);
    } catch (err) {
      console.error('Kunde inte nå backend:', err);
      setAnalysisData(null);
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
      <div style={{ position: 'sticky', top: 0, zIndex: 2000, width: '100%' }}>
        <Navbar />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '60px', padding: '30px', flex: 1 }}>
        <div style={{ position: 'relative', zIndex: 900 }}>
          <Sidebar active={active} setActive={setActive} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', position: 'relative', zIndex: 1 }}>
          
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

          <AreaSummaryModel
            data={analysisData}
            selectedAreaSqM={selectedAreaSqM}
            onClose={() => setAnalysisData(null)}
          />

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FieldStudy;