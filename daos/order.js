import Order from '../models/order';

export const createOrder = async ({ userId, items, total }) =>
  Order.create({ userId, items, total });

// GET /:id — items populated (full objects)
export const getOrderByIdPopulated = async (id) =>
  Order.findById(id).populate('items').lean();

// GET / normal user — items stay as IDs
export const getOrdersByUserId = async (userId) =>
  Order.find({ userId }).lean();

// GET /  admin — items stay as IDs
export const getAllOrders = async () => Order.find().lean();
