import mongoose from 'mongoose';

const FlightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  aircraft: { type: mongoose.Schema.Types.ObjectId, ref: 'Aircraft' },
  crew: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crew' }],
  status: {
    type: String,
    enum: ['scheduled', 'boarding', 'in-flight', 'completed', 'delayed', 'cancelled'],
    default: 'scheduled'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Flight', FlightSchema);