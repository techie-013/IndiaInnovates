/**
 * Notification Model - Firestore Collection: notifications
 * 
 * Document Structure:
 * {
 *   id: string (auto-generated)
 *   userId: string (User UID)
 *   title: string
 *   body: string
 *   type: 'complaint_assigned' | 'status_update' | 'comment' | 'like' | 'mention'
 *   data: {
 *     complaintId: string
 *     postId: string
 *     status: string
 *   }
 *   read: boolean
 *   readAt: Timestamp
 *   createdAt: Timestamp
 * }
 */

// This is a schema reference - actual data stored in Firestore