/**
 * Formatting utility functions
 */

/**
 * Formats an ISO timestamp into a human-readable string
 * @param {string} timestamp - ISO 8601 timestamp
 * @returns {string} Formatted date string
 */
export function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleString();
    } catch {
        return 'Invalid Date';
    }
}

/**
 * Formats a status string for display (uppercase + emoji)
 * @param {string} status - Status string like 'ok', 'error'
 * @returns {string} Formatted status
 */
export function formatStatus(status) {
    if (!status) return '❓ Unknown';
    const s = status.toLowerCase();
    if (s === 'ok') return '✅ OK';
    if (s === 'error') return '❌ Error';
    if (s === 'degraded') return '⚠️ Degraded';
    return `🔵 ${capitalizeFirst(status)}`;
}

/**
 * Truncates a message to a maximum length
 * @param {string} message - The message to truncate
 * @param {number} maxLength - Maximum character length (default: 100)
 * @returns {string} Truncated message
 */
export function truncateMessage(message, maxLength = 100) {
    if (!message) return '';
    if (message.length <= maxLength) return message;
    return message.slice(0, maxLength) + '...';
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Returns a CSS class name based on status
 * @param {string} status - The status value
 * @returns {string} CSS class name
 */
export function getStatusColor(status) {
    if (!status) return 'status-unknown';
    const s = status.toLowerCase();
    if (s === 'ok') return 'status-ok';
    if (s === 'error') return 'status-error';
    if (s === 'degraded') return 'status-degraded';
    return 'status-unknown';
}
