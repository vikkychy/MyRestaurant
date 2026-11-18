import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

import app from './app.js';
import connectDatabase from './config/db.js';

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';

const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(PORT, HOST, () => {
            console.log(`Server running at http://${HOST}:${PORT}`);
        });
    } catch (error) {
        console.log(`Server Error: ${error.message}`);
        process.exit(1);
    }
};

startServer();