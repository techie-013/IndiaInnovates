/**
 * Complaint Model - Firestore Collection: complaints
 * 
 * Document Structure:
 * {
 *   id: string (auto-generated)
 *   userId: string (User UID)
 *   userName: string
 *   title: string
 *   description: string
 *   category: 'Roads' | 'Water Supply' | 'Sanitation' | 'Electricity' | 'Drainage' | 'Parks' | 'Other'
 *   ministryId: string (assigned department)
 *   status: 'pending' | 'assigned' | 'in-progress' | 'resolved' | 'rejected'
 *   priority: 0 | 1 | 2 | 3 (based on upvotes)
 *   upvotes: number
 *   upvotedBy: string[] (User UIDs)
 *   location: {
 *     lat: number
 *     lng: number
 *     address: string
 *   }
 *   imageUrl: string | null
 *   aiConfidence: number
 *   resolutionNote: string
 *   createdAt: Timestamp
 *   updatedAt: Timestamp
 *   resolvedAt: Timestamp
 * }
 */

// This is a schema reference - actual data stored in Firestore