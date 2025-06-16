import express from 'express';
import Flight from '../models/Flight.js';

const router = express.Router();

// Get all flights
router.get('/', async (req, res) => {
  try {
    const { from, to, status } = req.query;
    let query = {};
    
    if (from) {
      query.departureTime = { $gte: new Date(from) };
    }
    if (to) {
      query.departureTime = { ...query.departureTime, $lte: new Date(to) };
    }
    if (status) {
      query.status = status;
    }
    
    const flights = await Flight.find(query)
      .populate('aircraft')
      .populate('crew');
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single flight
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id)
      .populate('aircraft')
      .populate('crew');
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create flight
router.post('/', async (req, res) => {
  const flight = new Flight(req.body);
  try {
    const newFlight = await flight.save();
    res.status(201).json(newFlight);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update flight
router.patch('/:id', async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('aircraft').populate('crew');
    res.json(flight);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Optimization endpoint
router.post('/optimize', async (req, res) => {
  try {
    const { from, to, constraints } = req.body;
    
    // Get all flights in the date range
    const flights = await Flight.find({
      departureTime: { $gte: new Date(from), $lte: new Date(to) }
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
    
    // Optimization logic here
    // This is a simplified version - you'll need to implement your actual optimization algorithm
    
    res.json({
      success: true,
      optimizedFlights: flights,
      message: 'Optimization complete'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;