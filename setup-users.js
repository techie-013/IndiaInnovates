const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

// Test users data
const users = [
  {
    email: 'admin@civiclens.com',
    password: 'admin123',
    displayName: 'System Administrator',
    role: 'admin',
    department: null
  },
  {
    email: 'roads@civiclens.com',
    password: 'official123',
    displayName: 'Roads Department Official',
    role: 'official',
    department: 'roads'
  },
  {
    email: 'citizen@civiclens.com',
    password: 'citizen123',
    displayName: 'Test Citizen',
    role: 'citizen',
    department: null
  }
];

async function setupUsers() {
  console.log('🚀 Starting user setup...\n');
  
  for (const user of users) {
    try {
      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        emailVerified: true
      });
      
      console.log(`✅ Created user: ${user.email} (UID: ${userRecord.uid})`);
      
      // Create user document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        department: user.department,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ Created user document for: ${user.email}\n`);
      
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`⚠️ User already exists: ${user.email}`);
        
        // Get existing user
        const userRecord = await auth.getUserByEmail(user.email);
        
        // Update user document
        await db.collection('users').doc(userRecord.uid).set({
          role: user.role,
          department: user.department,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log(`✅ Updated user document for: ${user.email}\n`);
      } else {
        console.error(`❌ Error creating user ${user.email}:`, error);
      }
    }
  }
  
  console.log('✅ User setup completed!');
  console.log('\nTest Credentials:');
  console.log('Admin: admin@civiclens.com / admin123');
  console.log('Roads Official: roads@civiclens.com / official123');
  console.log('Citizen: citizen@civiclens.com / citizen123');
}

setupUsers().catch(console.error);