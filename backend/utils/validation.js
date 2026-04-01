// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate complaint title
function isValidTitle(title) {
  return title && title.length >= 5 && title.length <= 100;
}

// Validate complaint description
function isValidDescription(description) {
  return description && description.length >= 10 && description.length <= 1000;
}

// Validate coordinates
function isValidCoordinates(lat, lng) {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// Validate phone number (Indian format)
function isValidPhone(phone) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

// Sanitize input to prevent XSS
function sanitizeInput(input) {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
}

// Validate hashtags
function isValidHashtags(hashtags) {
  if (!Array.isArray(hashtags)) return false;
  const hashtagRegex = /^#[a-zA-Z0-9_\u0600-\u06FF]+$/;
  return hashtags.every(tag => hashtagRegex.test(tag));
}

module.exports = {
  isValidEmail,
  isValidTitle,
  isValidDescription,
  isValidCoordinates,
  isValidPhone,
  sanitizeInput,
  isValidHashtags
};