import sequelize from './db.js';

const peek = async () => {
  try {
    // This is the standard SQL command to see all "folders" (databases)
    const [results] = await sequelize.query("SHOW DATABASES;");
    console.log("Existing Databases:", results);
    
    // This tells you which one your code is currently pointing to
    console.log("Current Database in your Config:", sequelize.config.database);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

peek();