import mongoose from 'mongoose';

const raceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  park: { type: String, required: true },
  country: { type: String, required: true },
  date: { type: Date, required: true },
  charityOrg: { type: String, required: true },
  spotsAvailable: { type: Number, required: true },
  entryFee: { type: Number, required: true },
});

export default mongoose.model('Race', raceSchema);
