import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    required: true,
  },
  total: { type: Number, required: true },
});

export default mongoose.model('Order', orderSchema);
