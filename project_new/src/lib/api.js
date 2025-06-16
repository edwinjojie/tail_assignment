import Aircraft from '../models/Aircraft';
import Crew from '../models/Crew';
import Flight from '../models/Flight';

// Aircraft functions
export const getAircraft = async (filters = {}) => {
  try {
    return await Aircraft.find(filters);
  } catch (error) {
    throw new Error(`Error fetching aircraft: ${error.message}`);
  }
};

export const updateAircraft = async (id, updates) => {
  try {
    return await Aircraft.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
  } catch (error) {
    throw new Error(`Error updating aircraft: ${error.message}`);
  }
};

// Crew functions
export const getCrew = async (filters = {}) => {
  try {
    let query = {};
    if (filters.available) {
      query = {
        status: 'available',
        $or: [
          { restUntil: null },
          { restUntil: { $lt: new Date() } }
        ]
      };
    }
    return await Crew.find(query);
  } catch (error) {
    throw new Error(`Error fetching crew: ${error.message}`);
  }
};

export const updateCrew = async (id, updates) => {
  try {
    return await Crew.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
  } catch (error) {
    throw new Error(`Error updating crew: ${error.message}`);
  }
};

// Flight functions
export const getFlights = async (filters = {}) => {
  try {
    let query = Flight.find().populate('aircraft').populate('crew');
    
    if (filters.from) {
      query = query.where('departureTime').gte(filters.from);
    }
    if (filters.to) {
      query = query.where('departureTime').lte(filters.to);
    }
    if (filters.status) {
      query = query.where('status', filters.status);
    }
    
    return await query.exec();
  } catch (error) {
    throw new Error(`Error fetching flights: ${error.message}`);
  }
};

export const updateFlight = async (id, updates) => {
  try {
    return await Flight.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).populate('aircraft').populate('crew');
  } catch (error) {
    throw new Error(`Error updating flight: ${error.message}`);
  }
};

// Optimization function
export const optimizeAssignments = async (params) => {
  const { from, to, constraints } = params;
  
  try {
    // Get all flights in the date range
    const flights = await Flight.find({
      departureTime: { $gte: from, $lte: to }
    });
    
    // Get available aircraft and crew
    const aircraft = await Aircraft.find({ status: 'available' });
    const crew = await Crew.find({
      status: 'available',
      $or: [
        { restUntil: null },
        { restUntil: { $lt: new Date() } }
      ]
    });
    
    // Optimization logic
    for (const flight of flights) {
      if (!flight.aircraft) {
        const availableAircraft = aircraft.find(a => a.status === 'available');
        if (availableAircraft) {
          flight.aircraft = availableAircraft._id;
          availableAircraft.status = 'assigned';
          await availableAircraft.save();
        }
      }
      
      if (!flight.crew || flight.crew.length === 0) {
        const availableCrew = crew
          .filter(c => c.status === 'available')
          .slice(0, 2);
        
        if (availableCrew.length > 0) {
          flight.crew = availableCrew.map(c => c._id);
        }
      }
      
      await flight.save();
    }
    
    return await Flight.find({
      departureTime: { $gte: from, $lte: to }
    }).populate('aircraft').populate('crew');
    
  } catch (error) {
    throw new Error(`Error in optimization: ${error.message}`);
  }
};