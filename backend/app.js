import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRoute from './routes/userRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import foodRoute from './routes/foodRoute.js';
import orderRoutes from './routes/orderRoute.js';
import paymentRoute from './routes/paymentRoute.js';

const app = express();

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/v1/users', userRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/foods', foodRoute);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoute);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'MyRestaurant API is running!'
    });
});

export default app;