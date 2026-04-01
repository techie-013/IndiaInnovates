export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  return true;
};

export const downloadJSON = (data, filename) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const shareOnTwitter = (text, url) => {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
};

export const shareOnFacebook = (url) => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

export const shareOnWhatsApp = (text, url) => {
  window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const getQueryParams = (url) => {
  const params = {};
  new URL(url).searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};