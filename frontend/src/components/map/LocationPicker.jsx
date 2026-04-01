import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { HiLocationMarker } from 'react-icons/hi';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return position === null ? null : <Marker position={position} />;
}

const LocationPicker = ({ onSelect, onClose }) => {
  const [location, setLocation] = useState(null);
  const [center] = useState([28.6139, 77.2090]); // Delhi coordinates

  const handleSelect = () => {
    if (location) {
      onSelect(location);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Pick Location on Map</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div style={{ height: '400px' }}>
          <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker onLocationSelect={setLocation} />
          </MapContainer>
        </div>
        <div className="p-4 border-t flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={!location}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <HiLocationMarker className="w-4 h-4" />
            <span>Use This Location</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;