import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import foodRoute from './routes/foodRoute.js';
import orderRoutes from './routes/orderRoute.js';
import paymentRoute from './routes/paymentRoute.js';




const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1/users', userRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/foods', foodRoute);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoute);



app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'MyRestaurant API is running!'
    });
});

export default app;