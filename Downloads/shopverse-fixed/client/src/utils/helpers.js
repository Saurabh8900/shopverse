// Format Indian currency
export const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

// Discount percentage
export const discountPct = (original, discounted) =>
  Math.round(((original - discounted) / original) * 100);

// Truncate text
export const truncate = (str, n = 60) =>
  str?.length > n ? str.slice(0, n) + '…' : str;

// Star array helper
export const getStars = (rating) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return { full, half, empty };
};

// Eco score config
export const ecoConfig = {
  green:       { label: '🌿 Eco Friendly', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  fair:        { label: '⚡ Fair Impact',  color: '#ffb300', bg: 'rgba(255,179,0,0.15)' },
  'high-impact':{ label: '🔴 High Impact', color: '#ff1a7f', bg: 'rgba(255,26,127,0.15)' },
};

// Mood config
export const moodConfig = [
  { key: 'chill',      label: 'Chill',       emoji: '😌', color: '#00e5ff' },
  { key: 'party',      label: 'Party',       emoji: '🎉', color: '#ff1a7f' },
  { key: 'work',       label: 'Work',        emoji: '💼', color: '#7c3aed' },
  { key: 'date-night', label: 'Date Night',  emoji: '🌹', color: '#ff91c3' },
];

// Countdown timer
export const getTimeLeft = (endDate) => {
  const diff = new Date(endDate) - Date.now();
  if (diff <= 0) return { h: 0, m: 0, s: 0, expired: true };
  return {
    h: Math.floor(diff / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    expired: false,
  };
};

// Debounce
export const debounce = (fn, ms = 300) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

// Random pastel from string (for avatars)
export const stringToColor = (str = '') => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return `hsl(${h % 360}, 70%, 60%)`;
};
