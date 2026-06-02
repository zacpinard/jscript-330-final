import mongoose from 'mongoose';

const runnerSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roles: { type: [String], required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nationality: { type: String },
  age: { type: Number },
});

export default mongoose.model('Runner', runnerSchema);
