const API_BASE_URL = 'http://localhost:5000/api';

// Aircraft API
export const getAircraft = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/aircraft?${params}`);
  if (!response.ok) throw new Error('Failed to fetch aircraft');
  return response.json();
};

export const updateAircraft = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/aircraft/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error('Failed to update aircraft');
  return response.json();
};

// Crew API
export const getCrew = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/crew?${params}`);
  if (!response.ok) throw new Error('Failed to fetch crew');
  return response.json();
};

export const updateCrew = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/crew/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error('Failed to update crew');
  return response.json();
};

// Flight API
export const getFlights = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/flights?${params}`);
  if (!response.ok) throw new Error('Failed to fetch flights');
  return response.json();
};

export const updateFlight = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/flights/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error('Failed to update flight');
  return response.json();
};

// Optimization API
export const optimizeAssignments = async (params) => {
  const response = await fetch(`${API_BASE_URL}/flights/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!response.ok) throw new Error('Failed to optimize assignments');
  return response.json();
};