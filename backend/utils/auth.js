const admin = require('firebase-admin');
const db = admin.firestore();

// Verify Firebase ID token
async function verifyToken(token) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Get user role from Firestore
async function getUserRole(uid) {
  const userDoc = await db.collection('users').doc(uid).get();
  return userDoc.exists ? userDoc.data().role : 'citizen';
}

// Get user department (for officials)
async function getUserDepartment(uid) {
  const userDoc = await db.collection('users').doc(uid).get();
  return userDoc.exists ? userDoc.data().department : null;
}

// Check if user has permission
async function hasPermission(uid, requiredRole) {
  const role = await getUserRole(uid);
  const roleHierarchy = { citizen: 1, official: 2, admin: 3 };
  return roleHierarchy[role] >= roleHierarchy[requiredRole];
}

// Check if user is admin
async function isAdmin(uid) {
  const role = await getUserRole(uid);
  return role === 'admin';
}

module.exports = {
  verifyToken,
  getUserRole,
  getUserDepartment,
  hasPermission,
  isAdmin
};