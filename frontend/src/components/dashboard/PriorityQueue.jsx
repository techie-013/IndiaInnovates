import React, { useState } from 'react';
import { HiChevronDown, HiChevronUp, HiFlag, HiLocationMarker } from 'react-icons/hi';
import { timeAgo } from '../../utils/formatters';

const PriorityQueue = ({ complaints, onStatusUpdate, department }) => {
  const [expanded, setExpanded] = useState(null);

  const sortedComplaints = [...complaints].sort((a, b) => b.upvotes - a.upvotes);
  const critical = sortedComplaints.filter(c => c.upvotes >= 100);
  const high = sortedComplaints.filter(c => c.upvotes >= 50 && c.upvotes < 100);
  const medium = sortedComplaints.filter(c => c.upvotes >= 20 && c.upvotes < 50);
  const normal = sortedComplaints.filter(c => c.upvotes < 20);

  const PrioritySection = ({ title, complaints, color, icon, bgColor }) => (
    <div className="mb-6">
      <h3 className={`font-semibold text-${color}-600 mb-3 flex items-center space-x-2`}>
        <span>{icon}</span>
        <span>{title} ({complaints.length})</span>
      </h3>
      <div className="space-y-3">
        {complaints.map(complaint => (
          <div key={complaint.id} className={`border rounded-lg p-4 ${expanded === complaint.id ? 'bg-gray-50' : ''}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-semibold text-gray-900">{complaint.complaintId || complaint.id?.slice(0, 8)}</span>
                  <span className="text-xs text-gray-500">👍 {complaint.upvotes} upvotes</span>
                  <span className="text-xs text-gray-400">{timeAgo(complaint.createdAt)}</span>
                </div>
                <h4 className="font-medium text-gray-800">{complaint.title}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{complaint.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  {complaint.location?.address && (
                    <span className="flex items-center gap-1">
                      <HiLocationMarker className="w-3 h-3" />
                      {complaint.location.address.split(',')[0]}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">Filed by: {complaint.userName}</p>
              </div>
              <div className="ml-4 flex flex-col gap-2">
                <select
                  value={complaint.status}
                  onChange={(e) => onStatusUpdate(complaint.id, e.target.value, '')}
                  className={`text-sm border rounded px-2 py-1 ${bgColor || 'bg-white'}`}
                >
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button 
                  onClick={() => setExpanded(expanded === complaint.id ? null : complaint.id)}
                  className="text-xs text-gray-500 hover:text-primary-600"
                >
                  {expanded === complaint.id ? 'Show less' : 'Details'}
                </button>
              </div>
            </div>
            
            {expanded === complaint.id && (
              <div className="mt-4 pt-3 border-t">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
                {complaint.imageUrl && (
                  <img src={complaint.imageUrl} alt="Evidence" className="mt-3 rounded-lg max-h-48 object-cover" />
                )}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onStatusUpdate(complaint.id, 'in-progress', '')}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    Start Work
                  </button>
                  <button
                    onClick={() => onStatusUpdate(complaint.id, 'resolved', 'Issue resolved')}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <HiFlag className="text-primary-600" />
        Priority Queue
        <span className="text-sm font-normal text-gray-500 ml-2">Sorted by upvotes</span>
      </h2>
      {sortedComplaints.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No complaints assigned to {department} department</p>
      ) : (
        <>
          {critical.length > 0 && (
            <PrioritySection 
              title="Critical (100+ upvotes)" 
              complaints={critical} 
              color="red" 
              icon="🚨"
              bgColor="bg-red-50"
            />
          )}
          {high.length > 0 && (
            <PrioritySection 
              title="High (50-99 upvotes)" 
              complaints={high} 
              color="orange" 
              icon="⚠️"
              bgColor="bg-orange-50"
            />
          )}
          {medium.length > 0 && (
            <PrioritySection 
              title="Medium (20-49 upvotes)" 
              complaints={medium} 
              color="yellow" 
              icon="⚡"
              bgColor="bg-yellow-50"
            />
          )}
          {normal.length > 0 && (
            <PrioritySection 
              title="Normal (<20 upvotes)" 
              complaints={normal} 
              color="gray" 
              icon="📋"
            />
          )}
        </>
      )}
    </div>
  );
};

export default PriorityQueue;