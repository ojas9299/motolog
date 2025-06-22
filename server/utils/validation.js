/**
 * Validate required fields in an object
 * @param {Object} data - Data object to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid boolean and missingFields array
 */
const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter(field => !data[field]);
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Validate date format and ensure it's a valid Date object
 * @param {string|Date} dateValue - Date value to validate
 * @returns {Date|null} Valid Date object or null if invalid
 */
const validateDate = (dateValue) => {
  if (!dateValue) return null;
  
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Validate that end time is after start time
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @returns {boolean} True if end time is after start time
 */
const validateTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return false;
  return endTime > startTime;
};

/**
 * Validate numeric field with range
 * @param {number|string} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number|null} Valid number or null if invalid
 */
const validateNumericRange = (value, min, max) => {
  if (!value) return null;
  
  const num = Number(value);
  if (isNaN(num)) return null;
  
  return (num >= min && num <= max) ? num : null;
};

/**
 * Validate and filter array of strings (e.g., image URLs)
 * @param {string[]} array - Array to validate
 * @returns {string[]} Filtered array with non-empty strings
 */
const validateStringArray = (array) => {
  if (!Array.isArray(array)) return [];
  return array.filter(item => item && typeof item === 'string' && item.trim() !== '');
};

/**
 * Validate trip data
 * @param {Object} tripData - Trip data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
const validateTripData = (tripData) => {
  const errors = [];
  
  // Required fields validation
  const requiredFields = [
    'userId', 'owner', 'vehicleId', 'brand', 'model', 
    'startLocation', 'endLocation', 'startTime', 'endTime'
  ];
  
  const { isValid, missingFields } = validateRequiredFields(tripData, requiredFields);
  if (!isValid) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  // Date validation
  const startTime = validateDate(tripData.startTime);
  const endTime = validateDate(tripData.endTime);
  
  if (!startTime) {
    errors.push('Invalid start time format');
  }
  
  if (!endTime) {
    errors.push('Invalid end time format');
  }
  
  // Time range validation
  if (startTime && endTime && !validateTimeRange(startTime, endTime)) {
    errors.push('End time must be after start time');
  }
  
  // Rating validation
  if (tripData.rating) {
    const rating = validateNumericRange(tripData.rating, 1, 5);
    if (rating === null) {
      errors.push('Rating must be between 1 and 5');
    }
  }
  
  // Trip images validation
  if (tripData.tripImages) {
    tripData.tripImages = validateStringArray(tripData.tripImages);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    validatedData: {
      ...tripData,
      startTime,
      endTime,
      rating: tripData.rating ? validateNumericRange(tripData.rating, 1, 5) : null
    }
  };
};

module.exports = {
  validateRequiredFields,
  validateDate,
  validateTimeRange,
  validateNumericRange,
  validateStringArray,
  validateTripData
}; 