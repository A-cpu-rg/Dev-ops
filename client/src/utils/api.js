/**
 * API utility for making backend requests
 */

const DEFAULT_API_URL = '';

/**
 * Fetches the health status from the backend API
 * @returns {Promise<{status: string, message: string, timestamp: string}>}
 */
export async function fetchHealthStatus() {
    const apiUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
    const response = await fetch(`${apiUrl}/api/health`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

/**
 * Generic GET request helper
 * @param {string} endpoint - API endpoint path
 * @returns {Promise<any>}
 */
export async function apiGet(endpoint) {
    const apiUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
    const response = await fetch(`${apiUrl}${endpoint}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

/**
 * Generic POST request helper
 * @param {string} endpoint - API endpoint path
 * @param {object} body - Request body
 * @returns {Promise<any>}
 */
export async function apiPost(endpoint, body) {
    const apiUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
    const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}
