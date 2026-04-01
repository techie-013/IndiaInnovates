import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

export const useFirestore = (collectionName, conditions = [], orderByField = 'createdAt', orderDirection = 'desc', limitCount = 50) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    let q = collection(db, collectionName);
    conditions.forEach(condition => { q = query(q, where(condition.field, condition.operator, condition.value)); });
    q = query(q, orderBy(orderByField, orderDirection));
    q = query(q, limit(limitCount));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      setData(items);
      setLoading(false);
    }, (err) => { setError(err); setLoading(false); });
    
    return () => unsubscribe();
  }, [collectionName, JSON.stringify(conditions), orderByField, orderDirection, limitCount]);
  
  return { data, loading, error };
};