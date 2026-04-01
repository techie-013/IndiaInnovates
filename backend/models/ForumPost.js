/**
 * ForumPost Model - Firestore Collection: forum_posts
 * 
 * Document Structure:
 * {
 *   id: string (auto-generated)
 *   userId: string (User UID)
 *   userName: string
 *   userAvatar: string
 *   userRole: string
 *   content: string
 *   imageUrl: string | null
 *   location: {
 *     lat: number
 *     lng: number
 *     address: string
 *   }
 *   hashtags: string[]
 *   likes: string[] (User UIDs)
 *   comments: Array<{
 *     id: string
 *     userId: string
 *     userName: string
 *     userAvatar: string
 *     content: string
 *     likes: number
 *     createdAt: Timestamp
 *   }>
 *   shares: number
 *   isOfficial: boolean
 *   isPinned: boolean
 *   status: 'active' | 'flagged' | 'deleted'
 *   createdAt: Timestamp
 *   updatedAt: Timestamp
 * }
 */

// This is a schema reference - actual data stored in Firestore