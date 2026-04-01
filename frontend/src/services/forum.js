import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, limit, arrayUnion, arrayRemove } from 'firebase/firestore';

export const forumService = {
  getAllPosts: async () => {
    const q = query(collection(db, 'forum_posts'), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  createPost: async (data) => {
    const docRef = await addDoc(collection(db, 'forum_posts'), { ...data, createdAt: new Date(), likes: [], comments: [], shares: 0, status: 'active' });
    return { id: docRef.id, ...data };
  },
  
  likePost: async (postId, userId) => { await updateDoc(doc(db, 'forum_posts', postId), { likes: arrayUnion(userId) }); },
  
  unlikePost: async (postId, userId) => { await updateDoc(doc(db, 'forum_posts', postId), { likes: arrayRemove(userId) }); },
  
  addComment: async (postId, comment) => { await updateDoc(doc(db, 'forum_posts', postId), { comments: arrayUnion(comment) }); },
  
  deletePost: async (postId) => { await deleteDoc(doc(db, 'forum_posts', postId)); }
};