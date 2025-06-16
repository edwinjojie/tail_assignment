import express from 'express';
import Crew from '../models/Crew.js';

const router = express.Router();

// Get all crew members
router.get('/', async (req, res) => {
  try {
    const { available } = req.query;
    let query = {};
    
    if (available === 'true') {
      query = {
        status: 'available',
        $or: [
          { restUntil: null },
          { restUntil: { $lt: new Date() } }
        ]
      };
    }
    
    const crew = await Crew.find(query);
    res.json(crew);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single crew member
router.get('/:id', async (req, res) => {
  try {
    const crew = await Crew.findById(req.params.id);
    if (!crew) {
      return res.status(404).json({ message: 'Crew member not found' });
    }
    res.json(crew);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create crew member
router.post('/', async (req, res) => {
  const crew = new Crew(req.body);
  try {
    const newCrew = await crew.save();
    res.status(201).json(newCrew);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update crew member
router.patch('/:id', async (req, res) => {
  try {
    const crew = await Crew.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(crew);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;