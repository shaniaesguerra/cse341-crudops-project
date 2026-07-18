const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const initDb = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.db;
    }

    await mongoose.connect(process.env.MONGO_URI);

    return mongoose.connection.db;
};

const getDatabase = () => {
    if (!mongoose.connection.db) {
        throw new Error('Database not initialized.');
    }

    return mongoose.connection.db;
};

module.exports = { initDb, getDatabase };