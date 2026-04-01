import React from 'react';
import { HiThumbUp } from 'react-icons/hi';

const UpvoteButton = ({ upvotes, upvoted, onUpvote, size = 'md' }) => {
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onUpvote}
      className={`flex items-center space-x-2 rounded-lg transition-all duration-200 ${
        upvoted 
          ? 'bg-primary-600 text-white hover:bg-primary-700' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${sizes[size]}`}
    >
      <HiThumbUp className={`${upvoted ? 'text-white' : 'text-gray-500'}`} />
      <span className="font-semibold">{upvotes}</span>
      <span className="text-sm">Upvote</span>
    </button>
  );
};

export default UpvoteButton;