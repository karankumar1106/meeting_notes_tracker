/**
 * API Service Layer
 * 
 * Centralized HTTP client for communicating with the Express backend.
 * Uses standard browser fetch API.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Generic request wrapper with error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // If response is 204 No Content, return null
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err);
    throw err;
  }
}

// Health Check
export const checkHealth = () => request('/health');

// Meetings Endpoints
export const getMeetings = () => request('/meetings');

export const getMeetingById = (id) => request(`/meetings/${id}`);

export const createMeeting = (title, notes) =>
  request('/meetings', {
    method: 'POST',
    body: JSON.stringify({ title, notes }),
  });

export const deleteMeeting = (id) =>
  request(`/meetings/${id}`, {
    method: 'DELETE',
  });

// Action Items Endpoints
export const getItems = (filters = {}) => {
  const query = new URLSearchParams();
  if (filters.meetingId) query.append('meetingId', filters.meetingId);
  if (filters.status) query.append('status', filters.status);

  const queryString = query.toString();
  return request(`/items${queryString ? `?${queryString}` : ''}`);
};

export const updateItem = (id, updates) =>
  request(`/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });

export const deleteItem = (id) =>
  request(`/items/${id}`, {
    method: 'DELETE',
  });

