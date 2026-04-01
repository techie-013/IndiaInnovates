import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { HiTrophy } from 'react-icons/hi';

const TopContributors = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContributors();
  }, []);

  const fetchContributors = async () => {
    try {
      // Get users with most forum posts
      const q = query(collection(db, 'users'), orderBy('stats.forumPosts', 'desc'), limit(10));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContributors(data);
    } catch (error) {
      console.error('Error fetching contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (index) => {
    if (index === 0) return 'text-yellow-500';
    if (index === 1) return 'text-gray-400';
    if (index === 2) return 'text-orange-500';
    return 'text-gray-300';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-2 mb-3">
        <HiTrophy className="w-5 h-5 text-yellow-500" />
        <h3 className="font-semibold text-gray-900">Top Contributors</h3>
      </div>
      {contributors.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">No contributors yet</p>
      ) : (
        <div className="space-y-3">
          {contributors.slice(0, 5).map((contributor, idx) => (
            <div key={contributor.id} className="flex items-center space-x-3">
              <span className={`font-bold w-6 ${getMedalColor(idx)}`}>#{idx + 1}</span>
              <img
                src={contributor.avatar || `https://ui-avatars.com/api/?name=${contributor.name}&background=2563eb&color=fff`}
                alt={contributor.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{contributor.name}</p>
                <p className="text-xs text-gray-500">{contributor.stats?.forumPosts || 0} posts</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopContributors;