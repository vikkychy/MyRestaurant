import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    customerName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: ''
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
        required: true,
        min: 0
    },

    deliveryAddress: {
        type: String,
        required: true,
        trim: true
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

const Order = mongoose.model('Order', orderSchema);

export default Order;