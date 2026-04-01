/**
 * Comment Model - Subdocument within ForumPost
 * 
 * Structure:
 * {
 *   id: string (auto-generated)
 *   userId: string (User UID)
 *   userName: string
 *   userAvatar: string
 *   content: string
 *   likes: number
 *   createdAt: Timestamp
 * }
 */

// This is a schema reference - comments are stored as subdocuments in forum_posts