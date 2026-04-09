import { useState } from 'react';
import WelcomePage from './pages/WelcomePage';
import ResultsPage from './pages/ResultsPage';

function App() {
  const [page, setPage] = useState('welcome');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLocate = async (userLocation) => {
    setLoading(true);
    try {
      const response = await fetch('/data.json');
      const pollingUnits = await response.json();
      
      const unitsWithDistance = pollingUnits.map(unit => {
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
      {page === 'welcome' && (
        <WelcomePage onLocate={handleLocate} loading={loading} />
      )}
      
      {page === 'results' && results && (
        <ResultsPage results={results} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
