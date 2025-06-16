import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Aircraft functions
export const getAircraft = async (filters = {}) => {
  let query = supabase.from('aircraft').select('*');
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const updateAircraft = async (id, updates) => {
  const { data, error } = await supabase
    .from('aircraft')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Crew functions
export const getCrew = async (filters = {}) => {
  let query = supabase.from('crew').select('*');
  
  if (filters.available) {
    query = query.is('rest_until', null).lt('duty_hours', 60);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const updateCrew = async (id, updates) => {
  const { data, error } = await supabase
    .from('crew')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Flight functions
export const getFlights = async (filters = {}) => {
  let query = supabase.from('flights').select(`
    *,
    aircraft:aircraft_id(*)
  `);
  
  if (filters.from) {
    query = query.gte('departure_time', filters.from);
  }
  
  if (filters.to) {
    query = query.lte('departure_time', filters.to);
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const updateFlight = async (id, updates) => {
  const { data, error } = await supabase
    .from('flights')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Optimization functions
export const optimizeAssignments = async (params) => {
  const { from, to, constraints } = params;
  
  // Get all flights in the date range
  const flights = await getFlights({ from, to });
  
  // Get available aircraft and crew
  const aircraft = await getAircraft({ status: 'available' });
  const crew = await getCrew({ available: true });
  
  // Simple greedy algorithm for demonstration
  // In production, this would be a more sophisticated optimization algorithm
  for (const flight of flights) {
    if (!flight.aircraft_id) {
      // Find suitable aircraft
      const availableAircraft = aircraft.find(a => a.status === 'available');
      if (availableAircraft) {
        await updateFlight(flight.id, { aircraft_id: availableAircraft.id });
        await updateAircraft(availableAircraft.id, { status: 'assigned' });
      }
    }
    
    if (!flight.crew_ids || flight.crew_ids.length === 0) {
      // Find suitable crew
      const availableCrew = crew
        .filter(c => c.duty_hours < 60 && (!c.rest_until || new Date(c.rest_until) < new Date()))
        .slice(0, 2); // Assign 2 crew members per flight
      
      if (availableCrew.length > 0) {
        await updateFlight(flight.id, { 
          crew_ids: availableCrew.map(c => c.id)
        });
      }
    }
  }
  
  return await getFlights({ from, to });
};