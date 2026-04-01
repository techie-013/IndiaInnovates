import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { HiX, HiPhoto, HiLocationMarker, HiHashtag } from 'react-icons/hi';

const CreatePost = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please write something');
      return;
    }
    
    setLoading(true);
    try {
      const hashtagArray = hashtags.split(',').map(t => t.trim()).filter(t => t);
      const post = {
        userId: user.uid,
        userName: user.displayName || user.email,
        userAvatar: user.photoURL,
        userRole: 'citizen',
        content: content.trim(),
        imageUrl: imageUrl || null,
        hashtags: hashtagArray,
        likes: [],
        comments: [],
        shares: 0,
        isOfficial: false,
        status: 'active',
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'forum_posts'), post);
      onSuccess({ id: docRef.id, ...post });
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">Create Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <HiX className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-start space-x-3">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=2563eb&color=fff`}
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening in your neighborhood?"
                className="w-full border-none focus:ring-0 text-lg resize-none outline-none"
                rows="4"
                autoFocus
              />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center space-x-2 text-gray-500 border rounded-lg p-2">
              <HiHashtag className="w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="Add hashtags (comma separated)"
                className="flex-1 outline-none bg-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center space-x-2 text-gray-500 border rounded-lg p-2">
              <HiPhoto className="w-5 h-5 flex-shrink-0" />
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL (optional)"
                className="flex-1 outline-none bg-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <div className="flex space-x-3">
              <button type="button" className="text-gray-500 hover:text-primary-600">
                <HiPhoto className="w-6 h-6" />
              </button>
              <button type="button" className="text-gray-500 hover:text-primary-600">
                <HiLocationMarker className="w-6 h-6" />
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="bg-primary-600 text-white px-5 py-2 rounded-full font-medium hover:bg-primary-700 disabled:opacity-50 transition"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;