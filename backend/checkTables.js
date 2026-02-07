/*import sequelize from './db.js';

const checkTables = async () => {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();

    // This command asks MySQL for a list of all tables in the current DB
    const [tables] = await sequelize.query("SHOW TABLES;");

    console.log("\n--- Current Tables in Database ---");
    if (tables.length === 0) {
      console.log("No tables found. The database is empty.");
    } else {
      console.table(tables);
    }

    // This shows which DB you are actually looking inside of
    console.log(`\nChecked Database: ${sequelize.config.database}`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Could not fetch tables:", err);
    process.exit(1);
  }
};

checkTables();*/


import sequelize from './db.js';

const check = async () => {
  try {
    console.log("Attempting to connect via Sequelize...");
    await sequelize.authenticate();
    console.log("✅ Connection successful!");

    // This lists every table in your database
    const [tables] = await sequelize.query("SHOW TABLES;");
    console.log("\n--- Tables Found ---");
    console.table(tables);

    // If 'users' exists, show the structure
    if (JSON.stringify(tables).includes('Users')) {
        const [columns] = await sequelize.query("DESCRIBE Users;");
        console.log("\n--- User Table Structure ---");
        console.table(columns);
    } else {
        console.log("\n❌ The 'Users' table does NOT exist yet.");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Database Error:", err.message);
    process.exit(1);
  }
};

check();