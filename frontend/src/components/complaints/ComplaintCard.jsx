import React from 'react';
import { Link } from 'react-router-dom';
import { HiLocationMarker, HiCalendar, HiThumbUp, HiClock } from 'react-icons/hi';
import { formatDate, timeAgo, truncateText } from '../../utils/formatters';

const ComplaintCard = ({ complaint }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'assigned': return 'bg-purple-100 text-purple-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getPriorityIcon = (upvotes) => {
    if (upvotes >= 100) return '🚨';
    if (upvotes >= 50) return '⚠️';
    if (upvotes >= 20) return '⚡';
    return '📋';
  };

  return (
    <Link to={`/complaint/${complaint.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
              <span className="text-xs text-gray-400">ID: {complaint.id?.slice(0, 8)}</span>
              <span className="text-xs flex items-center gap-1 text-gray-500">
                <span>{getPriorityIcon(complaint.upvotes || 0)}</span>
                <span>Priority</span>
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-1 text-lg">{complaint.title}</h3>
            <p className="text-gray-600 text-sm">{truncateText(complaint.description, 120)}</p>
            
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
              {complaint.location?.address && (
                <span className="flex items-center gap-1">
                  <HiLocationMarker className="w-3 h-3" />
                  <span>{complaint.location.address.split(',')[0]}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <HiCalendar className="w-3 h-3" />
                <span>{timeAgo(complaint.createdAt)}</span>
              </span>
              <span className="flex items-center gap-1">
                <HiThumbUp className="w-3 h-3" />
                <span>{complaint.upvotes || 0} upvotes</span>
              </span>
              {complaint.status === 'in-progress' && (
                <span className="flex items-center gap-1">
                  <HiClock className="w-3 h-3" />
                  <span>In Progress</span>
                </span>
              )}
            </div>
            
            {complaint.ministryId && (
              <div className="mt-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  Department: {complaint.ministryId}
                </span>
              </div>
            )}
          </div>
          
          {complaint.imageUrl && (
            <img
              src={complaint.imageUrl}
              alt="Evidence"
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
          )}
        </div>
      </div>
    </Link>
  );
};

export default ComplaintCard;