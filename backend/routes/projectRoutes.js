import express from "express";
import Project from "../models/mongo/projectModel.js";
import Story from "../models/mongo/storyModel.js";
import Chapter from "../models/mongo/chapterModel.js";
import Scene from "../models/mongo/sceneModel.js";
import Character from "../models/mongo/characterModel.js";
import World from "../models/mongo/worldModel.js";
import authenticateToken from "../middleware/auth.js";
import { validate } from '../middleware/validate.js';
import { createProjectSchema, updateProjectSchema } from '../validation/schemas.js';

const router = express.Router();

// POST /api/projects — create project
router.post("/", authenticateToken, validate(createProjectSchema), async (req, res) => {
    try {
        const newProject = new Project({
            userId: req.user.userId,
            title: req.body.title,
            description: req.body.description,
            cover: req.body.cover,
            worldIds: req.body.worldIds || [],
            storyIds: req.body.storyIds || [],
            characterIds: req.body.characterIds || []
        });
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/projects/user/:userId — get all projects for a user
router.get("/user/:userId", authenticateToken, async (req, res) => {
    try {
        if (req.params.userId !== req.user.userId) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const userProjects = await Project.find({ userId: req.params.userId });
        res.json(userProjects);
    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ error: "Could not fetch projects" });
    }
});

// GET /api/projects/:id — get a single project
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        if (project.userId !== req.user.userId) return res.status(403).json({ message: "Forbidden" });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/projects/:id — update project title/description/cover
router.patch("/:id", authenticateToken, validate(updateProjectSchema), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        if (project.userId !== req.user.userId) return res.status(403).json({ message: "Forbidden" });

        const { title, description, cover } = req.body;
        const updated = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: { title, description, cover } },
            { new: true, runValidators: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/projects/:id — delete project and cascade all children
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        if (project.userId !== req.user.userId) return res.status(403).json({ message: "Forbidden" });

        // Cascade: stories → chapters → scenes
        const stories = await Story.find({ projectId: req.params.id });
        const storyIds = stories.map(s => s._id);

        const chapters = await Chapter.find({ storyId: { $in: storyIds } });
        const chapterIds = chapters.map(c => c._id);

        await Scene.deleteMany({ chapterId: { $in: chapterIds } });
        await Chapter.deleteMany({ storyId: { $in: storyIds } });
        await Story.deleteMany({ projectId: req.params.id });

        // Cascade: characters and worlds
        await Character.deleteMany({ projectId: req.params.id });
        await World.deleteMany({ projectId: req.params.id });

        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project and all associated data deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
