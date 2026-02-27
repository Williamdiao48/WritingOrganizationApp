import express from "express";
import cors from "cors";
import sequelize from "./db.js"; 
import dotenv from "dotenv";
import { connectMongoDB } from "./mongo.js";
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import chapterRoutes from './routes/chapterRoutes.js';
import sceneRoutes from './routes/sceneRoutes.js';
import characterRoutes from './routes/characterRoutes.js';
import worldRoutes from './routes/worldRoutes.js';
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/scenes', sceneRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/worlds', worldRoutes);





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