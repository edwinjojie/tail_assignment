import express from 'express';
import Aircraft from '../models/Aircraft.js';

const router = express.Router();

// Get all aircraft
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const aircraft = await Aircraft.find(query);
    res.json(aircraft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single aircraft
router.get('/:id', async (req, res) => {
  try {
    const aircraft = await Aircraft.findById(req.params.id);
    if (!aircraft) {
      return res.status(404).json({ message: 'Aircraft not found' });
    }
    res.json(aircraft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create aircraft
router.post('/', async (req, res) => {
  const aircraft = new Aircraft(req.body);
  try {
    const newAircraft = await aircraft.save();
    res.status(201).json(newAircraft);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update aircraft
router.patch('/:id', async (req, res) => {
  try {
    const aircraft = await Aircraft.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(aircraft);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;