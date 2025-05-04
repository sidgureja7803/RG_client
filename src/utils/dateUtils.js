/**
 * Date Utility Functions
 * Collection of helper functions for date formatting and manipulation
 */

/**
 * Format a date string to a readable format
 * @param {string|Date} date - Date to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return '';
  
  const defaultOptions = {
    format: 'medium', // 'short', 'medium', 'long', 'full'
    includeTime: false,
    timeFormat: '12h', // '12h' or '24h'
  };
  
  const config = { ...defaultOptions, ...options };
  
  // Format based on requested style
  if (config.format === 'relative') {
    return getRelativeTimeString(dateObj);
  }
  
  // Date formatting options
  const dateFormatOptions = { 
    timeZone: 'UTC',
  };
  
  // Set date format style
  switch (config.format) {
    case 'short':
      dateFormatOptions.dateStyle = 'short';
      break;
    case 'medium':
      dateFormatOptions.dateStyle = 'medium';
      break;
    case 'long':
      dateFormatOptions.dateStyle = 'long';
      break;
    case 'full':
      dateFormatOptions.dateStyle = 'full';
      break;
    default:
      dateFormatOptions.dateStyle = 'medium';
  }
  
  // Add time if requested
  if (config.includeTime) {
    dateFormatOptions.timeStyle = config.format === 'short' ? 'short' : 'medium';
  }
  
  return new Intl.DateTimeFormat('en-US', dateFormatOptions).format(dateObj);
};

/**
 * Get relative time string (e.g., "2 days ago", "just now")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const getRelativeTimeString = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffInMs = now - dateObj;
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);
  
  if (diffInSecs < 60) {
    return 'just now';
  } else if (diffInMins < 60) {
    return `${diffInMins} ${diffInMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  }
};

/**
 * Check if a date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date) => {
  if (!date) return false;
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return false;
  
  const now = new Date();
  return dateObj < now;
};

/**
 * Format a date range between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @param {object} options - Formatting options
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate, options = {}) => {
  if (!startDate) return '';
  
  const start = formatDate(startDate, options);
  
  if (!endDate) {
    return `${start} - Present`;
  }
  
  const end = formatDate(endDate, options);
  return `${start} - ${end}`;
};

/**
 * Calculate duration between two dates in years and months
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date (defaults to current date if not provided)
 * @returns {string} Duration string (e.g., "2 years 3 months")
 */
export const calculateDuration = (startDate, endDate) => {
  if (!startDate) return '';
  
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate ? (endDate instanceof Date ? endDate : new Date(endDate)) : new Date();
  
  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
  
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  
  // Adjust for negative months
  let adjustedYears = years;
  let adjustedMonths = months;
  
  if (months < 0) {
    adjustedYears = years - 1;
    adjustedMonths = months + 12;
  }
  
  // Format the duration string
  const parts = [];
  
  if (adjustedYears > 0) {
    parts.push(`${adjustedYears} ${adjustedYears === 1 ? 'year' : 'years'}`);
  }
  
  if (adjustedMonths > 0) {
    parts.push(`${adjustedMonths} ${adjustedMonths === 1 ? 'month' : 'months'}`);
  }
  
  // If duration is less than a month
  if (parts.length === 0) {
    const diffInDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    parts.push(`${diffInDays} ${diffInDays === 1 ? 'day' : 'days'}`);
  }
  
  return parts.join(' ');
}; 