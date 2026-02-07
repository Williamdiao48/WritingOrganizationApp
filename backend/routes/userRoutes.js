import bcrypt from "bcrypt";
import User from "../models/sql/User.js";
import jwt from 'jsonwebtoken';
import express from "express";

const router = express.Router();

//Register Route
router.post("/register", async(req, res) => {
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
        return res.status(201).json({ message: "User registered successfully" });}
        catch (err) {
            console.error("Registration error details:", err);
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: "Username already exists" });
            }
            return res.status(500).json({ message: "Server error. Please try again later." });
        }
    });

//Login route
router.post("/login", async (req, res) => {
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

export default router;