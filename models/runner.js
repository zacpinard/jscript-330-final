import mongoose from 'mongoose';

const runnerSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roles: { type: [String], required: true },
});

export default mongoose.model('Runner', runnerSchema);
