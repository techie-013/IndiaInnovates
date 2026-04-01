import React from 'react';
import { HiHeart, HiShare, HiBookmark, HiFlag } from 'react-icons/hi';
import { timeAgo } from '../../utils/formatters';

const PostDetail = ({ post, onLike, currentUserId }) => {
  const isLiked = post.likes?.includes(currentUserId);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b flex items-start space-x-3">
        <img src={post.userAvatar || `https://ui-avatars.com/api/?name=${post.userName}&background=2563eb&color=fff`} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center space-x-2"><span className="font-semibold text-lg">{post.userName}</span>{post.isOfficial && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Official</span>}<span className="text-sm text-gray-500">{timeAgo(post.createdAt)}</span></div>
          {post.location && <p className="text-sm text-gray-500">📍 {post.location}</p>}
        </div>
      </div>
      <div className="p-4"><p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>{post.hashtags?.length > 0 && <div className="flex flex-wrap gap-2 mt-3">{post.hashtags.map(tag => <span key={tag} className="text-primary-500 text-sm">#{tag}</span>)}</div>}{post.imageUrl && <img src={post.imageUrl} className="mt-4 rounded-lg max-h-96 object-cover" />}</div>
      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex space-x-6"><button onClick={onLike} className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}><HiHeart className="w-5 h-5" /><span>{post.likes?.length || 0}</span></button><button className="flex items-center space-x-2 text-gray-500 hover:text-green-500"><HiShare className="w-5 h-5" /><span>{post.shares || 0}</span></button><button className="flex items-center space-x-2 text-gray-500 hover:text-yellow-500"><HiBookmark className="w-5 h-5" /></button></div>
        <button className="text-gray-400 hover:text-red-500"><HiFlag className="w-5 h-5" /></button>
      </div>
    </div>
  );
};

export default PostDetail;