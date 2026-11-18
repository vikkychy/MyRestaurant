import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter food name'],
        trim: true,
        maxlength: 100
    },

    description: {
        type: String,
        trim: true,
        maxlength: 500
    },

    price: {
        type: Number,
        required: [true, 'Please enter food price'],
        min: 0
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please select food category']
    },

    image: {
        public_id: String,
        url: String
    },

    isAvailable: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

const Food = mongoose.model('Food', foodSchema);

export default Food;