import Registration from '../models/registration';

export const createRegistration = async ({ runnerId, raceId }) =>
  Registration.create({ runnerId, raceId });

export const getRegistrationByRunnerId = async (runnerId) =>
  Registration.find({runnerId}).lean()

export const getRegistrationById = async (id) =>
  Registration.findById(id).lean();

export const getAllRegistrations = async () => Registration.find().lean();

export const deleteRegistration = async (id) =>
  Registration.findByIdAndDelete(id).lean();