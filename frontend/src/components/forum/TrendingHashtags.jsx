import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { HiTrendingUp } from 'react-icons/hi';

const TrendingHashtags = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const q = query(
        collection(db, 'forum_posts'),
        where('createdAt', '>=', sevenDaysAgo)
      );
      const snapshot = await getDocs(q);
      
      const hashtagCount = {};
      snapshot.forEach(doc => {
        const hashtags = doc.data().hashtags || [];
        hashtags.forEach(tag => {
          hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
        });
      });
      
      const trendingData = Object.entries(hashtagCount)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      
      setTrending(trendingData);
    } catch (error) {
      console.error('Error fetching trending:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-2 mb-3">
        <HiTrendingUp className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold text-gray-900">Trending Topics</h3>
      </div>
      {trending.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">No trending topics yet</p>
      ) : (
        <div className="space-y-2">
          {trending.map((item, idx) => (
            <div key={item.tag} className="flex items-center justify-between">
              <span className="text-primary-600 text-sm hover:underline cursor-pointer">
                {item.tag}
              </span>
              <span className="text-xs text-gray-400">{item.count} posts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingHashtags;