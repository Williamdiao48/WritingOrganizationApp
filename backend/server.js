import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import sequelize from "./db.js"; 
import dotenv from "dotenv";
import User from "./models/sql/User.js";
import { connectMongoDB } from "./mongo.js";
import jwt from 'jsonwebtoken';

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());


//Register Route
app.post("/register", async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required"})
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            password: hashedPassword
        });

        res.status(201).json({ message: "User registered successfully" });}
        catch (err) {
            return res.status(400).json({ message: "Username already exists" });
        }
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server error" });
        }
);
  

//Login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password){
        return res.status(400).json({ message: "Username and password required" });
    }

    try {
        const user = await User.findOne({ where: { username} });
    
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
        return res.status(401).json({ message: "Invalid username or password"});
        }

        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    } catch(err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error"});
    }    
});



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