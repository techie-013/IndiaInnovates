import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getMarkerColor = (category) => {
  const colors = {
    'Roads': '#ef4444',
    'Sanitation': '#10b981',
    'Street Lights': '#f59e0b',
    'Water Supply': '#3b82f6',
    'Drainage': '#8b5cf6',
    'Parks': '#06b6d4',
    'default': '#6b7280'
  };
  return colors[category] || colors.default;
};

const MapPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState([28.6139, 77.2090]); // Delhi
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    fetchComplaints();
    getUserLocation();
  }, []);

  const fetchComplaints = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'complaints'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const withLocation = data.filter(c => c.location?.lat && c.location?.lng);
      setComplaints(withLocation);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setZoom(14);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Complaint Map</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '70vh', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {complaints.map(complaint => (
            <Marker
              key={complaint.id}
              position={[complaint.location.lat, complaint.location.lng]}
              icon={L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: ${getMarkerColor(complaint.category)}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">📍</div>`,
                iconSize: [24, 24],
                popupAnchor: [0, -12]
              })}
            >
              <Popup>
                <div className="max-w-xs">
                  <h3 className="font-semibold text-gray-900">{complaint.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{complaint.description?.substring(0, 100)}...</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {complaint.status}
                    </span>
                    <span className="text-xs text-gray-500">👍 {complaint.upvotes || 0}</span>
                  </div>
                  <a 
                    href={`/complaint/${complaint.id}`}
                    className="block mt-2 text-primary-600 text-sm hover:underline"
                  >
                    View Details →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-red-500"></div><span>Roads</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-green-500"></div><span>Sanitation</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-yellow-500"></div><span>Street Lights</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-blue-500"></div><span>Water Supply</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-purple-500"></div><span>Drainage</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-cyan-500"></div><span>Parks</span></div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;