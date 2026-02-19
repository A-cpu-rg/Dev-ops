/**
 * Validation utility functions
 */

/**
 * Validates if an object is a valid health API response
 * @param {object} data - The response data to validate
 * @returns {boolean} True if valid
 */
export function isValidHealthResponse(data) {
    if (!data || typeof data !== 'object') return false;
    return (
        typeof data.status === 'string' &&
        typeof data.message === 'string' &&
        typeof data.timestamp === 'string'
    );
}

/**
 * Validates if a string is a valid ISO timestamp
 * @param {string} timestamp - The timestamp to validate
 * @returns {boolean} True if valid ISO timestamp
 */
export function isValidTimestamp(timestamp) {
    if (!timestamp || typeof timestamp !== 'string') return false;
    const date = new Date(timestamp);
    return !isNaN(date.getTime());
}

/**
 * Validates if a value is a non-empty string
 * @param {any} value - The value to check
 * @returns {boolean} True if non-empty string
 */
export function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates if a status value is one of the known statuses
 * @param {string} status - The status to validate
 * @returns {boolean} True if valid status
 */
export function isValidStatus(status) {
    const validStatuses = ['ok', 'error', 'degraded', 'maintenance'];
    return typeof status === 'string' && validStatuses.includes(status.toLowerCase());
}
