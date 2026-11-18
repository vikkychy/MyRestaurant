import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        maxlength: 50
    },

    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },

    phone: {
        type: String,
        trim: true,
        default: ''
    },

    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },

    role: {
        type: String,
        enum: ['customer', 'admin', 'superadmin'],
        default: 'customer'
    }

}, {
    timestamps: true
});


// Password Hashing
userSchema.pre('save', async function () {

    if (!this.isModified('password')) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);

});


// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {

    return await bcrypt.compare(enteredPassword, this.password);

};


const User = mongoose.model('User', userSchema);

export default User;