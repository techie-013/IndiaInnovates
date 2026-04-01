// Storage service disabled - priced feature
// Use this as placeholder - actual file uploads are disabled

export const storageService = {
  uploadFile: async (path, file) => {
    console.warn('Storage is disabled (priced feature). Using placeholder.');
    return null;
  },
  
  uploadComplaintImage: async (complaintId, file) => {
    console.warn('Storage is disabled (priced feature). Using placeholder.');
    return null;
  },
  
  uploadForumImage: async (postId, file) => {
    console.warn('Storage is disabled (priced feature). Using placeholder.');
    return null;
  },
  
  uploadAvatar: async (userId, file) => {
    console.warn('Storage is disabled (priced feature). Using placeholder.');
    return null;
  },
  
  deleteFile: async (path) => {
    console.warn('Storage is disabled (priced feature).');
  }
};
