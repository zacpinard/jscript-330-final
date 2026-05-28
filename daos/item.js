import Item from '../models/item';

export const createItem = async (data) => Item.create(data);

export const updateItem = async (id, data) =>
  Item.findByIdAndUpdate(id, data, { new: true }).lean();

export const getById = async (id) => Item.findById(id).lean();

export const getAll = async () => Item.find().lean();
