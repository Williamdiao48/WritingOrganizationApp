import express from "express";
import cors from "cors";
import sequelize from "./db.js"; 
import dotenv from "dotenv";
import { connectMongoDB } from "./mongo.js";
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes)





async function startServer() {
    try {
      await sequelize.authenticate();
      console.log("Connected to DB");
        
      await connectMongoDB();
      console.log("Connected to MongoDB")

      await sequelize.sync({ alter: true });
      console.log("Models synced");
  
      const PORT = process.env.APP_PORT;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
      } catch (err) {
      console.error("DB error:", err);
    }
  }
  
startServer();