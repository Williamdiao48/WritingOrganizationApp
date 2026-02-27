import express from "express";
import Scene from "../models/mongo/sceneModel.js";
import Chapter from "../models/mongo/chapterModel.js";
import Story from "../models/mongo/storyModel.js";
import Project from "../models/mongo/projectModel.js";
import authenticateToken from "../middleware/auth.js";
import { validate } from '../middleware/validate.js';
import { createSceneSchema, updateSceneSchema } from '../validation/schemas.js';

const router = express.Router();

// Verify the requesting user owns the project that contains this scene
async function verifySceneOwnership(sceneId, userId) {
    const scene = await Scene.findById(sceneId);
    if (!scene) return { error: "Scene not found", status: 404 };
    const chapter = await Chapter.findById(scene.chapterId);
    if (!chapter) return { error: "Parent chapter not found", status: 404 };
    const story = await Story.findById(chapter.storyId);
    if (!story) return { error: "Parent story not found", status: 404 };
    const project = await Project.findById(story.projectId);
    if (!project || project.userId !== userId) return { error: "Forbidden", status: 403 };
    return { scene, chapter, story, project };
}

// POST /api/scenes — create a scene inside a chapter
router.post("/", authenticateToken, validate(createSceneSchema), async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.body.chapterId);
        if (!chapter) return res.status(404).json({ message: "Chapter not found" });
        const story = await Story.findById(chapter.storyId);
        if (!story) return res.status(404).json({ message: "Parent story not found" });
        const project = await Project.findById(story.projectId);
        if (!project || project.userId !== req.user.userId) return res.status(403).json({ message: "Forbidden" });

        const scene = new Scene({
            chapterId: req.body.chapterId,
            title: req.body.title || "New Scene",
            content: req.body.content || "",
            order: req.body.order ?? 0,
        });
        const saved = await scene.save();

        // Add scene reference to chapter
        await Chapter.findByIdAndUpdate(req.body.chapterId, { $push: { sceneIds: saved._id } });

        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/scenes/chapter/:chapterId — get all scenes for a chapter
router.get("/chapter/:chapterId", authenticateToken, async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.chapterId);
        if (!chapter) return res.status(404).json({ message: "Chapter not found" });
        const story = await Story.findById(chapter.storyId);
        if (!story) return res.status(404).json({ message: "Parent story not found" });
        const project = await Project.findById(story.projectId);
        if (!project || project.userId !== req.user.userId) return res.status(403).json({ message: "Forbidden" });

        const scenes = await Scene.find({ chapterId: req.params.chapterId }).sort({ order: 1 });
        res.json(scenes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/scenes/:id — get a single scene
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const { scene, error, status } = await verifySceneOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });
        res.json(scene);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/scenes/:id — update scene fields
router.patch("/:id", authenticateToken, validate(updateSceneSchema), async (req, res) => {
    try {
        const { error, status } = await verifySceneOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });

        const { title, content, order } = req.body;
        const updated = await Scene.findByIdAndUpdate(
            req.params.id,
            { $set: { title, content, order } },
            { new: true, runValidators: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/scenes/:id — delete a scene
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { scene, chapter, error, status } = await verifySceneOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });

        await Scene.findByIdAndDelete(req.params.id);

        // Remove reference from parent chapter
        await Chapter.findByIdAndUpdate(chapter._id, { $pull: { sceneIds: scene._id } });

        res.json({ message: "Scene deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
