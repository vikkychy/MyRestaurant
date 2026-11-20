import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    paymentMethod: {
        type: String,
        enum: ['COD', 'eSewa', 'Khalti'],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },

    transactionId: {
        type: String,
        default: null
    }

}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export default Payment;