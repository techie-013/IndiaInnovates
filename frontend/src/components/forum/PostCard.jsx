import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiHeart, HiChat, HiShare, HiBookmark } from 'react-icons/hi';
import { timeAgo, truncateText } from '../../utils/formatters';

const PostCard = ({ post, onLike, currentUserId }) => {
  const [showFull, setShowFull] = useState(false);
  const isLiked = post.likes?.includes(currentUserId);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-100">
      {/* Author Info */}
      <div className="flex items-start space-x-3">
        <img
          src={post.userAvatar || `https://ui-avatars.com/api/?name=${post.userName}&background=2563eb&color=fff`}
          alt={post.userName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-semibold text-gray-900">{post.userName}</span>
            {post.isOfficial && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Official</span>
            )}
            <span className="text-xs text-gray-500">{timeAgo(post.createdAt)}</span>
          </div>
          
          {/* Content */}
          <p className="text-gray-700 mt-2 leading-relaxed">
            {showFull ? post.content : truncateText(post.content, 200)}
            {post.content.length > 200 && (
              <button
                onClick={() => setShowFull(!showFull)}
                className="text-primary-600 text-sm ml-1 hover:underline"
              >
                {showFull ? 'Show less' : 'Read more'}
              </button>
            )}
          </p>
          
          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.hashtags.slice(0, 5).map(tag => (
                <span key={tag} className="text-primary-500 text-sm hover:underline cursor-pointer">
                  {tag}
                </span>
              ))}
              {post.hashtags.length > 5 && (
                <span className="text-gray-400 text-sm">+{post.hashtags.length - 5}</span>
              )}
            </div>
          )}
          
          {/* Media */}
          {post.imageUrl && (
            <div className="mt-3">
              <img
                src={post.imageUrl}
                alt="Post media"
                className="rounded-lg max-h-64 w-full object-cover cursor-pointer hover:opacity-90 transition"
                onClick={() => window.open(post.imageUrl, '_blank')}
              />
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center space-x-6 mt-3 pt-2 border-t border-gray-100">
            <button
              onClick={onLike}
              className={`flex items-center space-x-1 transition-all duration-200 ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <HiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{post.likes?.length || 0}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-primary-500 transition">
              <HiChat className="w-5 h-5" />
              <span className="text-sm">{post.comments?.length || 0}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition">
              <HiShare className="w-5 h-5" />
              <span className="text-sm">{post.shares || 0}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-yellow-500 transition ml-auto">
              <HiBookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;