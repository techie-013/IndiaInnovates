import React, { useState } from 'react';
import { HiHeart, HiTrash } from 'react-icons/hi';
import { timeAgo } from '../../utils/formatters';

const CommentItem = ({ comment, onDelete, currentUserId }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes || 0);

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="flex space-x-2">
      <img
        src={comment.userAvatar || `https://ui-avatars.com/api/?name=${comment.userName}&background=2563eb&color=fff`}
        alt={comment.userName}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="flex-1 bg-gray-50 rounded-lg p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm text-gray-900">{comment.userName}</span>
            <span className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
          </div>
          {currentUserId === comment.userId && (
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <HiTrash className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 mt-1 text-xs transition ${
            liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <HiHeart className="w-3 h-3" />
          <span>{likesCount}</span>
        </button>
      </div>
    </div>
  );
};

export default CommentItem;