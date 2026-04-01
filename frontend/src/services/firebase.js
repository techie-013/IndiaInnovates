import { db, auth, storage, googleProvider } from '../firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { signInWithPopup, signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const firebaseService = {
  db, auth, storage, googleProvider,
  signInWithGoogle: () => signInWithPopup(auth, googleProvider),
  signOut: () => signOut(auth),
  
  getCollection: async (collectionName, conditions = [], orderByField = null, limitCount = null) => {
    let q = collection(db, collectionName);
    conditions.forEach(cond => { q = query(q, where(cond.field, cond.operator, cond.value)); });
    if (orderByField) q = query(q, orderBy(orderByField, 'desc'));
    if (limitCount) q = query(q, limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  getDocument: async (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  addDocument: async (collectionName, data) => {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { id: docRef.id, ...data };
  },
  
  updateDocument: async (collectionName, docId, data) => {
    await updateDoc(doc(db, collectionName, docId), data);
  },
  
  deleteDocument: async (collectionName, docId) => {
    await deleteDoc(doc(db, collectionName, docId));
  },
  
  uploadFile: async (path, file) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
};