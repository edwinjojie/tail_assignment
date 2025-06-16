import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// These environment variables will be set after clicking "Connect to Supabase" button
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Click "Connect to Supabase" button to configure.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Aircraft functions
export async function getAircraft(filters: { status?: string } = {}) {
  let query = supabase.from('aircraft').select('*');
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateAircraft(id: string, updates: Partial<Database['public']['Tables']['aircraft']['Update']>) {
  const { data, error } = await supabase
    .from('aircraft')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Crew functions
export async function getCrew(filters: { available?: boolean } = {}) {
  let query = supabase.from('crew').select('*');
  
  if (filters.available) {
    query = query.is('rest_until', null);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateCrew(id: string, updates: Partial<Database['public']['Tables']['crew']['Update']>) {
  const { data, error } = await supabase
    .from('crew')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Flight functions
export async function getFlights(filters: { 
  from?: Date; 
  to?: Date;
  status?: string;
} = {}) {
  let query = supabase.from('flights').select(`
    *,
    aircraft:aircraft_id(*)
  `);
  
  if (filters.from) {
    query = query.gte('departure_time', filters.from.toISOString());
  }
  
  if (filters.to) {
    query = query.lte('departure_time', filters.to.toISOString());
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateFlight(id: string, updates: Partial<Database['public']['Tables']['flights']['Update']>) {
  const { data, error } = await supabase
    .from('flights')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Optimization functions
export async function optimizeAssignments(params: {
  from: Date;
  to: Date;
  constraints: {
    maintenance: boolean;
    crewRest: boolean;
    connectionTime: boolean;
    preferredAircraft: boolean;
  };
}) {
  // Get all flights in the date range
  const flights = await getFlights({ from: params.from, to: params.to });
  
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
        .filter(c => !c.rest_until || new Date(c.rest_until) < new Date())
        .slice(0, 2); // Assign 2 crew members per flight
      
      if (availableCrew.length > 0) {
        await updateFlight(flight.id, { 
          crew_ids: availableCrew.map(c => c.id)
        });
      }
    }
  }
  
  return await getFlights({ from: params.from, to: params.to });
}