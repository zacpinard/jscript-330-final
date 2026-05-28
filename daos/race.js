import Race from '../models/race';
import mongoose from 'mongoose';

export const createRace = async (data) => Race.create(data);

export const updateRace = async (id, data) =>
  Race.findByIdAndUpdate(id, data, { new: true }).lean();

export const getById = async (id) => Race.findById(id).lean();

export const getAll = async () => Race.find().lean();

export const getRaceWithRunners = async (id) => {
  const races = await Race.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: 'registrations', //which collection to join
        localField: '_id', //field on the Race document
        foreignField: 'raceId', //field on the Registration document
        as: 'registrations', //name of the new array added to the result
      }
    },
    {
      $lookup: {
        from: 'runners', //which collection to join
        localField: 'registrations.runnerId', //field from the new Registrations array
        foreignField: '_id', //match against Runner _id
        as: 'runners', //name of the new array added to the result
      }
    }
  ])
  return races[0] ?? null
}