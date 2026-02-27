import express from "express";
import cors from "cors";
import helmet from "helmet";
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

const REQUIRED_ENV = ['JWT_SECRET', 'MONGO_URI', 'DB_NAME', 'DB_USER', 'DB_PASS', 'APP_PORT'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

const app = express();

// Middleware setup
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

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
        console.log("Connected to MongoDB");

        // Use alter:true in development only — run migrations manually in production
        const isDev = process.env.NODE_ENV !== 'production';
        await sequelize.sync({ alter: isDev });
        console.log("Models synced");

        const PORT = process.env.APP_PORT;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("Startup error:", err);
        process.exit(1);
    }
}

startServer();
