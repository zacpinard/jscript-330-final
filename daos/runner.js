import bcrypt from 'bcrypt';
import User from '../models/runner';

export const createUser = async ({ email, password }) => {
  const hashed = await bcrypt.hash(password, 10);
  return User.create({ email, password: hashed, roles: ['user'] });
};

export const getByEmail = async (email) => User.findOne({ email }).lean();

export const updatePassword = async (userId, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  return User.updateOne({ _id: userId }, { password: hashed });
};
