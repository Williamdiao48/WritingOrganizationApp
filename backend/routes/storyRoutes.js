import express from "express";
import Story from "../models/mongo/storyModel.js";
import Chapter from "../models/mongo/chapterModel.js";
import Scene from "../models/mongo/sceneModel.js";
import Project from "../models/mongo/projectModel.js";
import authenticateToken from "../middleware/auth.js";
import { validate } from '../middleware/validate.js';
import { createStorySchema, updateStorySchema } from '../validation/schemas.js';

const router = express.Router();

// Verify the requesting user owns the project that contains this story
async function verifyStoryOwnership(storyId, userId) {
    const story = await Story.findById(storyId);
    if (!story) return { error: "Story not found", status: 404 };
    const project = await Project.findById(story.projectId);
    if (!project || project.userId !== userId) return { error: "Forbidden", status: 403 };
    return { story, project };
}

// POST /api/stories — create a story inside a project
router.post("/", authenticateToken, validate(createStorySchema), async (req, res) => {
    try {
        const project = await Project.findById(req.body.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });
        if (project.userId !== req.user.userId) return res.status(403).json({ message: "Forbidden" });

        const story = new Story({
            projectId: req.body.projectId,
            worldId: req.body.worldId,
            title: req.body.title,
            cover: req.body.cover,
            summary: req.body.summary,
            status: req.body.status,
            visibility: req.body.visibility,
        });
        const saved = await story.save();

        // Add story reference to project
        await Project.findByIdAndUpdate(req.body.projectId, { $push: { storyIds: saved._id } });

        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/stories/project/:projectId — get all stories for a project
router.get("/project/:projectId", authenticateToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });
        if (project.userId !== req.user.userId) return res.status(403).json({ message: "Forbidden" });

        const stories = await Story.find({ projectId: req.params.projectId });
        res.json(stories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/stories/:id — get a single story
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const { story, error, status } = await verifyStoryOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });
        res.json(story);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/stories/:id — update story fields
router.patch("/:id", authenticateToken, validate(updateStorySchema), async (req, res) => {
    try {
        const { story, error, status } = await verifyStoryOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });

        const { title, cover, summary, status: storyStatus, visibility, worldId } = req.body;
        const updated = await Story.findByIdAndUpdate(
            req.params.id,
            { $set: { title, cover, summary, status: storyStatus, visibility, worldId } },
            { new: true, runValidators: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/stories/:id — delete story and cascade chapters/scenes
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { story, error, status } = await verifyStoryOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });

        // Cascade: chapters → scenes
        const chapters = await Chapter.find({ storyId: req.params.id });
        const chapterIds = chapters.map(c => c._id);
        await Scene.deleteMany({ chapterId: { $in: chapterIds } });
        await Chapter.deleteMany({ storyId: req.params.id });

        await Story.findByIdAndDelete(req.params.id);

        // Remove reference from parent project
        await Project.findByIdAndUpdate(story.projectId, { $pull: { storyIds: story._id } });

        res.json({ message: "Story and all associated chapters and scenes deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
