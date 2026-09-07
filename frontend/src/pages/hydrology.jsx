import { useEffect, useState, useCallback } from 'react';
import Hydrosidebar from '../components/sidebar/hydrosidebar.jsx';
import Mapview from '../components/map/mapview.jsx';
import Navbar from '../components/navbar.jsx';
import Floodlayers from '../components/map/layers/hydrology/floodlayers_tiles';
import WaterQualityTiles from '../components/map/layers/hydrology/waterquality_tiles.jsx';
import Footer from '../components/footer.jsx';
import AreaSummaryModel from '../components/map/areasummary_model.jsx';

function Hydrology() {
    const [active, setActive] = useState(null);
    const [waterLevel, setWaterLevel] = useState(1);
    const [showWaterQuality, setShowWaterQuality] = useState(false);

    // State för ritat område och API-analys
    const [selectedArea, setSelectedArea] = useState(null); // Sparar { id, sqMeters, geojson }
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State för att trigga rensning av lager på kartan
    const [clearTrigger, setClearTrigger] = useState(false);

    // Funktion för att skicka förfrågan till backend
    const fetchAnalysis = useCallback(async (area, level) => {
        if (!area || !area.geojson) return;
        
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/analyze-area', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    geometry: area.geojson.geometry,
                    total_sqm: area.sqMeters,
                    water_level: level
                })
            });

            if (!response.ok) {
                throw new Error('Kunde inte analysera det valda området');
            }

            const data = await response.json();
            setSummaryData(data);
        } catch (err) {
            console.error('[ANALYSIS ERROR]', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Trigga om analysen automatiskt när antingen vattennivån eller det ritade området ändras
    useEffect(() => {
        if (selectedArea) {
            fetchAnalysis(selectedArea, waterLevel);
        }
    }, [waterLevel, selectedArea, fetchAnalysis]);

    // Hantera händelse när ett område skapas eller redigeras i Geoman
    const handleAreaCreated = (areaData) => {
        setSelectedArea(areaData);
    };

    // Hantera händelse när ett område raderas eller sammanfattningskortet stängs
    const handleAreaDeleted = () => {
        setSelectedArea(null);
        setSummaryData(null);
        setClearTrigger((prev) => !prev); // Signalera till AreaDrawer att ta bort polygonen från kartan
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
          backgroundColor: '#356d4f',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Navbar />
        
        <div style={{ display: 'flex', flexDirection: 'column', padding: '30px', flex: "1", gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '30px', flex: "1" }}>

            <Hydrosidebar 
              active={active} 
              setActive={setActive} 
              waterLevel={waterLevel}
              setWaterLevel={setWaterLevel} 
              showWaterQuality={showWaterQuality} 
              setShowWaterQuality={setShowWaterQuality} 
            />

            <div style={{ flex: 1, height: '550px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <Mapview 
                center={[55.6229, 13.3486]} 
                zoom={9.4} 
                waterLevel={waterLevel}
                onAreaCreated={handleAreaCreated}
                onAreaDeleted={handleAreaDeleted}
                onAreaSelected={(id) => console.log("Valt område ID:", id)}
                clearTrigger={clearTrigger}
                activeAreaId={selectedArea?.id}
              >
                {active === "low" && <Floodlayers level={waterLevel} />}
                {active === 'medium' && <Floodlayers level={waterLevel}/>}
                {active === 'high' && <Floodlayers level={waterLevel}/>}
                {!active && waterLevel > 0 && <Floodlayers level={waterLevel} />}
                {showWaterQuality && <WaterQualityTiles />}
              </Mapview>
            </div>
          </div>

          {/* Renderar sammanfattningen direkt under kartan/sidebar */}
          <AreaSummaryModel 
            data={summaryData} 
            selectedAreaSqM={selectedArea?.sqMeters} 
            loading={loading} 
            error={error} 
            onClose={handleAreaDeleted}
          />
        </div>

        <Footer />
      </div>  
    );
} 

export default Hydrology;