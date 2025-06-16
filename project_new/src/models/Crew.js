import mongoose from 'mongoose';

const CrewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qualifications: [{ type: String }],
  dutyHours: { type: Number, default: 0 },
  restUntil: { type: Date },
  role: { 
    type: String,
    enum: ['Captain', 'First Officer', 'Flight Attendant'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'on-duty', 'resting'],
    default: 'available'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Crew', CrewSchema);