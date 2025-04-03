'use strict';

/**
 * Simply returns the date string as is
 * @param {string} dateString - Date string from the backend (YYYY-MM-DD format)
 * @returns {string} The same date string
 */
export function formatDate(dateString) {
  if (!dateString) return '';

  try {
    // If format is YYYY-MM-DD, convert to DD/MM/YYYY
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  } catch (error) {
    console.error('Error formatting date string:', error);
    return dateString || '';
  }
}
