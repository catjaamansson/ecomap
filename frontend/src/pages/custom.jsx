import Navbar from '../components/navbar.jsx';
import Mapview from '../components/map/mapview.jsx';
import { useState, useEffect } from 'react';

import Customsidebar from '../components/sidebar/customsidebar.jsx';
import ForestLayer from '../components/map/layers/ecology/forestlayer.jsx';
import Landuselayers from '../components/map/layers/fieldstudy/landuselayer_tiles.jsx';
import Waterbodieslayers from '../components/map/layers/ecology/waterbodiestiles.jsx';
import Waterquality from '../components/map/layers/hydrology/waterquality_tiles.jsx';
import Flooding from '../components/map/layers/hydrology/floodlayers_tiles.jsx';
import LandUseClickPopup from '../components/map/layers/fieldstudy/landuse_click.jsx';
import { AreaDrawer } from '../components/map/areadraw.jsx';
import AreaSummaryModel from '../components/map/areasummary_model.jsx';
import Footer from '../components/footer.jsx';
import Soilmoisture from '../components/map/layers/ecology/soilmoisturetiles.jsx';
import SoilmoistureClickPopup from '../components/map/layers/ecology/soilmoisture_click.jsx';

const ProtectedAreasLayer = () => null;
const ThreatenedAnimalsLayer = () => null;

function Custom() {
  const [active, setActive] = useState(null);
  const [waterLevel, setWaterLevel] = useState(0);
  const [analysisData, setAnalysisData] = useState(null);
  const [isDrawingArea, setIsDrawingArea] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);

  // Hanterar flera områden
  const [areas, setAreas] = useState([]); // Array av { id, sqMeters, geojson }
  const [activeAreaId, setActiveAreaId] = useState(null);

  // Hämta aktivt område baserat på ID
  const activeArea = areas.find((a) => a.id === activeAreaId);

  // Återanvändbar funktion för backend-analys
  const fetchAnalysis = async (geojson, sqMeters, layerToAnalyze) => {
    if (!geojson || !sqMeters) return;

    try {
      const res = await fetch('http://localhost:5000/api/analyze-area', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          geometry: geojson.geometry, 
          sqMeters,
          layer: layerToAnalyze || 'landuse'
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Serverfel (${res.status})`);
      }

      const data = await res.json();
      setAnalysisData(data);
    } catch (err) {
      console.error('Kunde inte nå backend:', err);
      setAnalysisData(null);
      alert(`Analysen misslyckades: ${err.message}`);
    }
  };

  // När ett nytt område skapas eller redigeras (drar i noder osv)
  const handleAreaCreated = (newArea) => {
    setAreas((prev) => {
      const exists = prev.some((a) => a.id === newArea.id);
      if (exists) {
        // Skapa ett helt nytt objekt i tillståndet så React upptäcker att geometrin ändrats
        return prev.map((a) => (a.id === newArea.id ? { ...newArea } : a));
      }
      return [...prev, { ...newArea }];
    });
    setActiveAreaId(newArea.id);
  };

  // När användaren klickar på ett existerande område på kartan
  const handleAreaSelected = (id) => {
    setActiveAreaId(id);
  };

  // När ett område raderas
  const handleAreaDeleted = (id) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
    if (activeAreaId === id) {
      const remaining = areas.filter((a) => a.id !== id);
      const nextActive = remaining.length > 0 ? remaining[remaining.length - 1].id : null;
      setActiveAreaId(nextActive);
      if (!nextActive) setAnalysisData(null);
    }
  };

  // Stäng sammanfattningen och ta bort just det AKTIVA området
  const handleCloseSummary = () => {
    if (activeAreaId) {
      setClearTrigger((prev) => prev + 1);
      handleAreaDeleted(activeAreaId);
    }
  };

  // Kör om analysen när det AKTIVA OMRÅDET (dess geojson/yta) eller kartlagret ändras
  useEffect(() => {
    if (!activeArea || !activeArea.geojson || !activeArea.sqMeters) {
      setAnalysisData(null);
      return;
    }

    // Debounce: vänta 300 ms efter sista dragningen/nodändringen innan backend kallas
    const timer = setTimeout(() => {
      fetchAnalysis(activeArea.geojson, activeArea.sqMeters, active);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeArea, active]); // Lyssnar direkt på hela activeArea-objektet!

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
        backgroundColor: '#356d4f',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ position: 'sticky', top: 0, zIndex: 2000, width: '100%' }}>
        <Navbar />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '60px', padding: '30px', flex: "1" }}>
        <div style={{ position: 'relative', zIndex: 900 }}>
          <Customsidebar active={active} setActive={setActive} setWaterLevel={setWaterLevel} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ height: '400px', width: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Mapview center={[55.6229, 13.3486]} zoom={9.4}>
              <AreaDrawer 
                onAreaCreated={handleAreaCreated}
                onAreaSelected={handleAreaSelected}
                onAreaDeleted={handleAreaDeleted}
                onDrawingChange={setIsDrawingArea}
                clearTrigger={clearTrigger}
                activeAreaId={activeAreaId}
              />

              {active === 'vegetation' && <ForestLayer key="vegetation" />}
              {active === 'waterbodies' && <Waterbodieslayers key="waterbodies" />}
              {active === 'protected_areas' && <ProtectedAreasLayer key="protected" />}
              {active === 'threatened_animals' && <ThreatenedAnimalsLayer key="animals" />}
              {active === 'soil_moisture' && !isDrawingArea && (
                <>
                  <Soilmoisture key="soil_moisture" />
                  <SoilmoistureClickPopup key="soil_moisture_click" />
                </>
              )}
              
              {active === 'landUse' && !isDrawingArea && (
                <>
                  <Landuselayers />
                  <LandUseClickPopup />
                </>
              )}
              
              {active === 'waterquality' && <Waterquality key="waterquality" />}
              {waterLevel > 0 && <Flooding level={waterLevel} key="flooding" />}
            </Mapview>
          </div>

          <AreaSummaryModel
            data={analysisData}
            selectedAreaSqM={activeArea ? activeArea.sqMeters : null}
            onClose={handleCloseSummary}
          />
        </div>
      </div>

      <Footer />
    </div>  
  );
} 

export default Custom;