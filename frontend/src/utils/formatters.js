import { format, formatDistanceToNow, formatDistance } from 'date-fns';

export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return format(date, 'dd MMM yyyy');
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return format(date, 'dd MMM yyyy, hh:mm a');
};

export const timeAgo = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatTimeDifference = (start, end) => {
  if (!start || !end) return 'N/A';
  const startDate = start.toDate ? start.toDate() : new Date(start);
  const endDate = end.toDate ? end.toDate() : new Date(end);
  return formatDistance(startDate, endDate);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const getRandomColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec489a', '#06b6d4'];
  return colors[Math.abs(hash) % colors.length];
};