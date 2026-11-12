/**
 * API Service Layer
 * 
 * Centralized HTTP client for communicating with the Express backend.
 * Uses standard browser fetch API with cookie + Bearer token authentication.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

let authToken = localStorage.getItem('meeting_tracker_token') || null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('meeting_tracker_token', token);
  } else {
    localStorage.removeItem('meeting_tracker_token');
  }
};

export const getAuthToken = () => authToken;

/**
 * Generic request wrapper with error handling and auth headers
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const config = {
    credentials: 'include', // Automatically sends HTTP-only cookies
    ...options,
    headers,
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

// Authentication Endpoints
export const loginApi = async (email, password) => {
  const data = await request('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.accessToken) {
    setAuthToken(data.accessToken);
  }
  return data;
};

export const registerApi = async (name, email, password) => {
  const data = await request('/users/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  if (data.accessToken) {
    setAuthToken(data.accessToken);
  }
  return data;
};

export const logoutApi = async () => {
  try {
    await request('/users/logout', { method: 'POST' });
  } finally {
    setAuthToken(null);
  }
};

export const getCurrentUserApi = () => request('/users/me');

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
