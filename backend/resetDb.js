const sequelize = require('./config/database');
const User = require('./models/User');
const mongoose = require('mongoose');
const Project = require('./models/Project');

const resetAllDatabases = async () => {
    try {
        console.log("--- Starting Full System Reset ---");
        await sequelize.authenticate();
        console.log("Connected to SQL. Dropping all tables...");
        await sequelize.drop();
        await sequelize.sync({ force: true });