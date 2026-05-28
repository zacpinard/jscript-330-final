import mongoose from 'mongoose';
import Item from './models/item';
import Order from './models/order';
import User from './models/user';

const models = [Item, Order, User];

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
