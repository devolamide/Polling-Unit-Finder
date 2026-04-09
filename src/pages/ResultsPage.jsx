import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin } from "lucide-react";
import { PollingUnitCard } from '../components/PollingUnitCard';
import { Footer } from '../components/Footer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function ResultsPage({ results, onBack }) {
  const { userLocation, pollingUnits } = results;
  const [selectedUnit, setSelectedUnit] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (pollingUnits && pollingUnits.length > 0) {
      const firstUnit = {
        id: '0',
        name: pollingUnits[0].pollingUnit,
        registrationArea: pollingUnits[0].registrationArea,
        state: pollingUnits[0].state,
        localGovernment: pollingUnits[0].localGovernment,
        walkingDistance: `${pollingUnits[0].walkingDistance.toFixed(2)} km (${Math.round((pollingUnits[0].walkingDistance / 5) * 60)} mins)`,
        lat: parseFloat(pollingUnits[0].latitude),
        lng: parseFloat(pollingUnits[0].longitude),
      };
      setSelectedUnit(firstUnit);
    }
  }, [pollingUnits]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([userLocation.latitude, userLocation.longitude], 14);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const customIcon = L.divIcon({
      html: `
        <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 42 16 42C16 42 32 24.837 32 16C32 7.163 24.837 0 16 0Z" fill="#10b981"/>
          <circle cx="16" cy="16" r="8" fill="white"/>
          <path d="M16 10L18 14L22 14.5L19 17.5L19.5 21.5L16 19.5L12.5 21.5L13 17.5L10 14.5L14 14L16 10Z" fill="#10b981"/>
        </svg>
      `,
      className: 'custom-marker',
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42],
    });

    const userIcon = L.divIcon({
      html: `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#3b82f6" opacity="0.3"/>
          <circle cx="16" cy="16" r="10" fill="#3b82f6"/>
          <circle cx="16" cy="16" r="4" fill="white"/>
        </svg>
      `,
      className: 'user-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-size: 14px;">
          <div style="font-weight: 600; color: #3b82f6; margin-bottom: 4px;">Your Location</div>
        </div>
      `);

    pollingUnits.forEach((unit, index) => {
      const marker = L.marker([parseFloat(unit.latitude), parseFloat(unit.longitude)], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-size: 14px;">
            <div style="font-weight: 600; color: #10b981; margin-bottom: 4px;">${unit.pollingUnit}</div>
            <div style="color: #6b7280;">${unit.walkingDistance.toFixed(2)} km</div>
          </div>
        `);

      marker.on('click', () => {
        setSelectedUnit({
          id: index.toString(),
          name: unit.pollingUnit,
          registrationArea: unit.registrationArea,
          state: unit.state,
          localGovernment: unit.localGovernment,
          walkingDistance: `${unit.walkingDistance.toFixed(2)} km (${Math.round((unit.walkingDistance / 5) * 60)} mins)`,
          lat: parseFloat(unit.latitude),
          lng: parseFloat(unit.longitude),
        });
      });

      markersRef.current.push(marker);
    });

    const bounds = [
      [userLocation.latitude, userLocation.longitude],
      ...pollingUnits.map(unit => [parseFloat(unit.latitude), parseFloat(unit.longitude)])
    ];
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    };
  }, [userLocation, pollingUnits]);

  useEffect(() => {
    if (selectedUnit && mapInstanceRef.current) {
      const bounds = [
        [userLocation.latitude, userLocation.longitude],
        ...pollingUnits.map(unit => [parseFloat(unit.latitude), parseFloat(unit.longitude)])
      ];
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [selectedUnit, userLocation, pollingUnits]);

  const transformedUnits = pollingUnits.map((unit, index) => ({
    id: index.toString(),
    name: unit.pollingUnit,
    registrationArea: unit.registrationArea,
    state: unit.state,
    localGovernment: unit.localGovernment,
    walkingDistance: `${unit.walkingDistance.toFixed(2)} km (${Math.round((unit.walkingDistance / 5) * 60)} mins)`,
    lat: parseFloat(unit.latitude),
    lng: parseFloat(unit.longitude),
  }));

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white shadow-md z-10 px-4 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-emerald-500" />
          <h1 className="text-xl font-semibold text-gray-900">Nearby Polling Units</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />
          <a
            href="https://selar.com/showlove/yinkash"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 left-4 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-xs font-medium border border-gray-200 z-[1000]"
          >
            Found this useful? Buy me a coffee ☕
          </a>
        </div>

        <div className="lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {transformedUnits.length} Units Found
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Tap a unit to see details or select on map
            </p>
            <div className="space-y-3">
              {transformedUnits.map((unit) => (
                <PollingUnitCard
                  key={unit.id}
                  unit={unit}
                  isSelected={selectedUnit?.id === unit.id}
                  onSelect={() => setSelectedUnit(unit)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ResultsPage;
