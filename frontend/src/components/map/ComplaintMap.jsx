import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ComplaintMap = ({ complaints, center, zoom }) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {complaints.map(complaint => (
        <Marker key={complaint.id} position={[complaint.location.lat, complaint.location.lng]}>
          <Popup>
            <div><strong>{complaint.title}</strong><p>{complaint.description?.substring(0, 100)}...</p><a href={`/complaint/${complaint.id}`}>View Details</a></div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ComplaintMap;