import { useState, useEffect } from 'react';
import WelcomePage from './pages/WelcomePage';
import ResultsPage from './pages/ResultsPage';
import { buildGeohashIndex, searchNearbyUnits } from './utils/geohash';

function App() {
  const [page, setPage] = useState('welcome');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geohashIndex, setGeohashIndex] = useState(null);
  const [indexLoading, setIndexLoading] = useState(true);

  useEffect(() => {
    const loadAndIndexData = async () => {
      try {
        const response = await fetch('/data.json');
        const pollingUnits = await response.json();
        
        console.log(`Building geohash index for ${pollingUnits.length} polling units...`);
        const index = buildGeohashIndex(pollingUnits, 5);
        console.log(`Index built with ${index.size} geohash buckets`);
        
        setGeohashIndex(index);
      } catch (error) {
        console.error('Error loading polling data:', error);
        alert('Failed to load polling data. Please refresh the page.');
      } finally {
        setIndexLoading(false);
      }
    };

    loadAndIndexData();
  }, []);

  const handleLocate = async (userLocation) => {
    if (!geohashIndex) {
      alert('Polling data is still loading. Please wait.');
      return;
    }

    setLoading(true);
    try {
      const nearbyUnits = searchNearbyUnits(
        geohashIndex,
        userLocation.latitude,
        userLocation.longitude,
        5
      );
      
      console.log(`Found ${nearbyUnits.length} nearby units using geohash`);
      
      const unitsWithDistance = nearbyUnits.map(unit => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          parseFloat(unit.latitude),
          parseFloat(unit.longitude)
        );
        return { ...unit, straightLineDistance: distance };
      });
      
      unitsWithDistance.sort((a, b) => a.straightLineDistance - b.straightLineDistance);
      const closest10 = unitsWithDistance.slice(0, 10);
      
      const unitsWithWalkingDistance = await Promise.all(
        closest10.map(async (unit) => {
          const walkingDistance = await getWalkingDistance(
            userLocation.latitude,
            userLocation.longitude,
            parseFloat(unit.latitude),
            parseFloat(unit.longitude)
          );
          return { ...unit, walkingDistance };
        })
      );
      
      unitsWithWalkingDistance.sort((a, b) => a.walkingDistance - b.walkingDistance);
      
      setResults({
        userLocation,
        pollingUnits: unitsWithWalkingDistance.slice(0, 5)
      });
      setPage('results');
    } catch (error) {
      console.error('Error finding polling units:', error);
      alert('Failed to locate polling units. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getWalkingDistance = async (lat1, lon1, lat2, lon2) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/foot/${lon1},${lat1};${lon2},${lat2}?overview=false`
      );
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        return data.routes[0].distance / 1000;
      }
      return calculateDistance(lat1, lon1, lat2, lon2);
    } catch (error) {
      console.error('Error getting walking distance:', error);
      return calculateDistance(lat1, lon1, lat2, lon2);
    }
  };

  const handleBack = () => {
    setPage('welcome');
    setResults(null);
  };

  return (
    <div className="app">
      {indexLoading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div className="loader"></div>
          <p>Loading polling data...</p>
        </div>
      ) : (
        <>
          {page === 'welcome' && (
            <WelcomePage onLocate={handleLocate} loading={loading} />
          )}
          
          {page === 'results' && results && (
            <ResultsPage results={results} onBack={handleBack} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
