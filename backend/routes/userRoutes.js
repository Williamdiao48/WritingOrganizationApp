import crypto from 'crypto';
import bcrypt from "bcrypt";
import User from "../models/sql/User.js";
import jwt from 'jsonwebtoken';
import express from "express";
import rateLimit from "express-rate-limit";
import { Op } from 'sequelize';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validation/schemas.js';
import { sendPasswordResetEmail } from '../lib/email.js';

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts, please try again later." },
});

//Register Route
router.post("/register", authLimiter, validate(registerSchema), async(req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Registration error details:", err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Username or email already exists" });
        }
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
});

//Login route
router.post("/login", authLimiter, validate(loginSchema), async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password"});
        }
        const token = jwt.sign(
            { userId: user.id },
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

// POST /api/users/forgot-password
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        // Always respond 200 to prevent email enumeration
        if (!user) {
            return res.status(200).json({ message: "If that email is registered, you will receive a reset link." });
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await user.update({ resetToken: hashedToken, resetTokenExpiry: expiry });

        const resetUrl = `${process.env.APP_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`;
        await sendPasswordResetEmail(email, resetUrl);

        return res.status(200).json({ message: "If that email is registered, you will receive a reset link." });
    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/users/reset-password
router.post("/reset-password", validate(resetPasswordSchema), async (req, res) => {
    const { token, password } = req.body;
    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: { [Op.gt]: new Date() },
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({ password: hashedPassword, resetToken: null, resetTokenExpiry: null });

        return res.status(200).json({ message: "Password reset successfully." });
    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
