import mongoose from 'mongoose';
import Runner from './models/runner';
import Race from './models/race';
import Registration from './models/registration';

const models = [Runner, Race, Registration];

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL, {});
  await Promise.all(models.map((m) => m.syncIndexes()));
};

export const stopDB = async () => {
  await mongoose.disconnect();
};

export const clearDB = async () => {
  await Promise.all(models.map((model) => model.deleteMany()));
};

export const findOne = async (model, query) => {
  const result = await model.findOne(query).lean();
  if (result) {
    result._id = result._id.toString();
  }
  return result;
};

export const find = async (model, query) => {
  const results = await model.find(query).lean();
  results.forEach((result) => {
    result._id = result._id.toString();
  });
  return results;
};