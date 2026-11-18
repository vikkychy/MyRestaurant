import mongoose from 'mongoose';

const connectDatabase = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected:', connection.connection.host);
        console.log('Database Name:', connection.connection.name);

    } catch (error) {
        console.log('Database Connection Error:', error.message);
        process.exit(1);
    }
};

export default connectDatabase;