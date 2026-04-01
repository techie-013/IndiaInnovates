import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const getMarkerIcon = (department) => {
  const colors = {
    'Roads': '#3b82f6',
    'Water Supply': '#06b6d4',
    'Sanitation': '#10b981',
    'Street Lights': '#f59e0b',
    'Electricity': '#ef4444',
    'Drainage': '#8b5cf6',
    'Parks': '#ec489a',
    'General': '#6b7280'
  };
  const color = colors[department] || '#6b7280';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">📍</div>`,
    iconSize: [28, 28],
    popupAnchor: [0, -14]
  });
};

const MarkerCluster = ({ complaints }) => {
  return (
    <>
      {complaints.map(complaint => (
        <Marker
          key={complaint.id}
          position={[complaint.location.lat, complaint.location.lng]}
          icon={getMarkerIcon(complaint.ministryId)}
        >
          <Popup>
            <div className="max-w-xs">
              <h3 className="font-semibold text-gray-900">{complaint.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{complaint.description?.substring(0, 100)}...</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${complaint.status === 'resolved' ? 'bg-green-100 text-green-700' : complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                  {complaint.status}
                </span>
                <span className="text-xs text-gray-500">👍 {complaint.upvotes || 0}</span>
              </div>
              <a href={`/complaint/${complaint.id}`} className="block mt-2 text-primary-600 text-sm hover:underline">View Details →</a>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default MarkerCluster;