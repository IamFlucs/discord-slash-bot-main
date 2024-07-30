const mongoose = require('mongoose');
const { logger } = require('../../utils/tools/logger.js');

/**
 * This event handle the connection with the MangoDB using mongoose
 */
const connectDB = async () => {
    try {
        await mongoose
            .connect('mongodb://localhost:27017/', {
                // useNewUrlParser: true,
                // useUnifiedTopology: true,
        });
        logger.ok('>> MongoDB connected.');
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
    }
};

module.exports = connectDB;
