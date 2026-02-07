import sequelize from './db.js';
import User from './models/sql/User.js';

const fullReset = async () => {
  try {
    const dbName = sequelize.config.database;
    console.log(`--- NUCLEAR RESET INITIATED FOR: ${dbName} ---`);

    await sequelize.query(`DROP DATABASE IF EXISTS ${dbName};`);
    await sequelize.query(`CREATE DATABASE ${dbName};`);
    await sequelize.query(`USE ${dbName};`);
    console.log("✅ Database wiped and re-created.");

    await sequelize.sync({ force: true });
    console.log("✅ Current models synced to database.");

    console.log("\n--- SYSTEM REBOOT COMPLETE ---");
    process.exit(0);
  } catch (err) {
    console.error("❌ Reset failed:", err);
    process.exit(1);
  }
};

fullReset();