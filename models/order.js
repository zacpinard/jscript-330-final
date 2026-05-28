import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  runnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Runner',
    required: true,
  },
  raceId: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    ref: 'Race',
    required: true,
  },
  registeredAt: { type: Date, default: Date.now },
});

export default mongoose.model('Registration', registrationSchema);
