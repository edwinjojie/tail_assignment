import mongoose from 'mongoose';

const AircraftSchema = new mongoose.Schema({
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentLocation: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['available', 'in-flight', 'maintenance'],
    default: 'available'
  },
  nextMaintenance: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Aircraft', AircraftSchema);