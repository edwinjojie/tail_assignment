const API_BASE_URL = 'http://localhost:5000';

// Aircraft API calls
export async function fetchAircraft() {
  try {
    const response = await fetch(`${API_BASE_URL}/aircraft`);
    if (!response.ok) {
      throw new Error('Failed to fetch aircraft');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching aircraft:', error);
    return null;
  }
}

export async function addAircraft(aircraftData) {
  try {
    const response = await fetch(`${API_BASE_URL}/aircraft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aircraftData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add aircraft');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding aircraft:', error);
    throw error;
  }
}

// Flights API calls
export async function fetchFlights() {
  try {
    const response = await fetch(`${API_BASE_URL}/flights`);
    if (!response.ok) {
      throw new Error('Failed to fetch flights');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching flights:', error);
    return null;
  }
}

export async function addFlight(flightData) {
  try {
    const response = await fetch(`${API_BASE_URL}/flights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flightData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add flight');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding flight:', error);
    throw error;
  }
}

// Crews API calls
export async function fetchCrews() {
  try {
    const response = await fetch(`${API_BASE_URL}/crews`);
    if (!response.ok) {
      throw new Error('Failed to fetch crews');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching crews:', error);
    return null;
  }
}

export async function addCrew(crewData) {
  try {
    const response = await fetch(`${API_BASE_URL}/crews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crewData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add crew');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding crew:', error);
    throw error;
  }
}

// Assignments API calls
export async function fetchAssignments() {
  try {
    const response = await fetch(`${API_BASE_URL}/assignments`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch assignments');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return null;
  }
}