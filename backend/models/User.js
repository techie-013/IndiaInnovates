/**
 * User Model - Firestore Collection: users
 * 
 * Document Structure:
 * {
 *   uid: string (Firebase Auth UID)
 *   name: string
 *   email: string
 *   role: 'citizen' | 'official' | 'admin'
 *   department: string | null (for officials)
 *   avatar: string (URL)
 *   createdAt: Timestamp
 *   updatedAt: Timestamp
 *   stats: {
 *     complaintsFiled: number
 *     complaintsResolved: number
 *     upvotesReceived: number
 *     forumPosts: number
 *   }
 * }
 */

// This is a schema reference - actual data stored in Firestore