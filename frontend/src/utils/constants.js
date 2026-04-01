export const APP_NAME = 'CivicLens';
export const APP_TAGLINE = 'Your voice matters. Act now.';

export const COMPLAINT_CATEGORIES = [
  { value: 'Roads', label: 'Roads & Transport', icon: '🛣️', color: 'blue' },
  { value: 'Water Supply', label: 'Water Supply', icon: '💧', color: 'cyan' },
  { value: 'Sanitation', label: 'Sanitation', icon: '🗑️', color: 'green' },
  { value: 'Electricity', label: 'Electricity', icon: '⚡', color: 'yellow' },
  { value: 'Drainage', label: 'Drainage', icon: '🚰', color: 'purple' },
  { value: 'Parks', label: 'Parks', icon: '🌳', color: 'emerald' },
  { value: 'Other', label: 'Other', icon: '📝', color: 'gray' }
];

export const COMPLAINT_STATUS = {
  pending: { label: 'Pending', color: 'gray', icon: '⏳' },
  assigned: { label: 'Assigned', color: 'blue', icon: '📋' },
  'in-progress': { label: 'In Progress', color: 'yellow', icon: '🔄' },
  resolved: { label: 'Resolved', color: 'green', icon: '✅' },
  rejected: { label: 'Rejected', color: 'red', icon: '❌' }
};

export const USER_ROLES = {
  citizen: { label: 'Citizen', level: 1, dashboard: '/citizen' },
  official: { label: 'Official', level: 2, dashboard: '/official' },
  admin: { label: 'Administrator', level: 3, dashboard: '/admin' }
};

export const DEPARTMENTS = [
  'Roads', 'Water Supply', 'Sanitation', 'Electricity', 'Drainage', 'Parks', 'Health', 'Education', 'General'
];

export const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'trending', label: 'Trending' }
];