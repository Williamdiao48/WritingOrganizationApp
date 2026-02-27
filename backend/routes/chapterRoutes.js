import express from "express";
import Chapter from "../models/mongo/chapterModel.js";
import Scene from "../models/mongo/sceneModel.js";
import Story from "../models/mongo/storyModel.js";
import Project from "../models/mongo/projectModel.js";
import authenticateToken from "../middleware/auth.js";
import { validate } from '../middleware/validate.js';
import { createChapterSchema, updateChapterSchema } from '../validation/schemas.js';

const router = express.Router();

// Verify the requesting user owns the project that contains this chapter
async function verifyChapterOwnership(chapterId, userId) {
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) return { error: "Chapter not found", status: 404 };
    const story = await Story.findById(chapter.storyId);
    if (!story) return { error: "Parent story not found", status: 404 };
    const project = await Project.findById(story.projectId);
    if (!project || project.userId !== userId) return { error: "Forbidden", status: 403 };
    return { chapter, story, project };
}

// POST /api/chapters — create a chapter inside a story
router.post("/", authenticateToken, validate(createChapterSchema), async (req, res) => {
    try {
        const story = await Story.findById(req.body.storyId);
        if (!story) return res.status(404).json({ message: "Story not found" });
        const project = await Project.findById(story.projectId);
        if (!project || project.userId !== req.user.userId) return res.status(403).json({ message: "Forbidden" });

        const chapter = new Chapter({
            storyId: req.body.storyId,
            title: req.body.title || "Untitled Chapter",
            summary: req.body.summary,
            content: req.body.content || "",
            order: req.body.order ?? 0,
        });
        const saved = await chapter.save();

        // Add chapter reference to story
        await Story.findByIdAndUpdate(req.body.storyId, { $push: { chapterIds: saved._id } });

        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/chapters/story/:storyId — get all chapters for a story
router.get("/story/:storyId", authenticateToken, async (req, res) => {
    try {
        const story = await Story.findById(req.params.storyId);
        if (!story) return res.status(404).json({ message: "Story not found" });
        const project = await Project.findById(story.projectId);
        if (!project || project.userId !== req.user.userId) return res.status(403).json({ message: "Forbidden" });

        const chapters = await Chapter.find({ storyId: req.params.storyId }).sort({ order: 1 });
        res.json(chapters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/chapters/:id — get a single chapter
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const { chapter, error, status } = await verifyChapterOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });
        res.json(chapter);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/chapters/:id — update chapter fields
router.patch("/:id", authenticateToken, validate(updateChapterSchema), async (req, res) => {
    try {
        const { chapter, error, status } = await verifyChapterOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });

        const { title, summary, content, order } = req.body;
        const updated = await Chapter.findByIdAndUpdate(
            req.params.id,
            { $set: { title, summary, content, order } },
            { new: true, runValidators: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/chapters/:id — delete chapter and cascade its scenes
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { chapter, story, error, status } = await verifyChapterOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });

        await Scene.deleteMany({ chapterId: req.params.id });
        await Chapter.findByIdAndDelete(req.params.id);

        // Remove reference from parent story
        await Story.findByIdAndUpdate(story._id, { $pull: { chapterIds: chapter._id } });

        res.json({ message: "Chapter and all associated scenes deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
