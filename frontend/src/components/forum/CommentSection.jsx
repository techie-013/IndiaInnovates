import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import CommentItem from './CommentItem';
import { HiPaperAirplane } from 'react-icons/hi';

const CommentSection = ({ postId, comments, onAddComment, onDeleteComment }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    setSubmitting(true);
    try {
      const comment = {
        id: Date.now().toString(),
        userId: user.uid,
        userName: user.displayName || user.email,
        userAvatar: user.photoURL,
        content: newComment.trim(),
        createdAt: new Date(),
        likes: 0
      };
      await onAddComment(postId, comment);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-900 mb-3">
        Comments ({comments?.length || 0})
      </h4>
      
      {/* Comment List */}
      <div className="space-y-3 max-h-96 overflow-y-auto mb-4 pr-2">
        {comments?.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments?.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={() => onDeleteComment(postId, comment.id)}
              currentUserId={user?.uid}
            />
          ))
        )}
      </div>
      
      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex items-start space-x-2">
          <img
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=2563eb&color=fff`}
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              rows="2"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="absolute bottom-2 right-2 text-primary-600 hover:text-primary-700 disabled:opacity-50"
            >
              <HiPaperAirplane className="w-5 h-5" />
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-500 text-center py-2">
          <a href="/login" className="text-primary-600 hover:underline">Login</a> to comment
        </p>
      )}
    </div>
  );
};

export default CommentSection;