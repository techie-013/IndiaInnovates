export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  if (name.length > 50) return 'Name must be less than 50 characters';
  return null;
};

export const validateComplaintTitle = (title) => {
  if (!title) return 'Title is required';
  if (title.length < 5) return 'Title must be at least 5 characters';
  if (title.length > 100) return 'Title must be less than 100 characters';
  return null;
};

export const validateComplaintDescription = (description) => {
  if (!description) return 'Description is required';
  if (description.length < 10) return 'Description must be at least 10 characters';
  if (description.length > 1000) return 'Description must be less than 1000 characters';
  return null;
};

export const validateLocation = (location) => {
  if (!location || !location.lat || !location.lng) {
    return 'Please select a location on the map';
  }
  return null;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone) return null;
  if (!phoneRegex.test(phone)) return 'Please enter a valid 10-digit phone number';
  return null;
};