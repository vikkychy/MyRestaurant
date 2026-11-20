import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  deliveryAddress: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  paymentMethod: {
  type: String,
  enum: ['COD', 'eSewa', 'Khalti'],
  default: 'COD'
  },

  paymentStatus: {
    type: String,
  enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
  default: 'Pending'
  },

  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }

}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;