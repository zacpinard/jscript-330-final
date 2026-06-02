import bcrypt from 'bcrypt';
import Runner from '../models/runner';

export const createRunner = async ({ email, password, firstName, lastName, nationality, age }) => {
  const hashed = await bcrypt.hash(password, 10);
  return Runner.create({ email, password: hashed, roles: ['user'], firstName, lastName, nationality, age });
};

export const getByEmail = async (email) => Runner.findOne({ email }).lean();

export const updatePassword = async (runnerId, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  return Runner.updateOne({ _id: runnerId }, { password: hashed });
};
