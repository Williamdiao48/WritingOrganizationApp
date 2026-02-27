import express from "express";
import World from "../models/mongo/worldModel.js";
import Project from "../models/mongo/projectModel.js";
import authenticateToken from "../middleware/auth.js";
import { validate } from '../middleware/validate.js';
import { createWorldSchema, updateWorldSchema } from '../validation/schemas.js';

const router = express.Router();

// Verify the requesting user owns the project that contains this world
async function verifyWorldOwnership(worldId, userId) {
    const world = await World.findById(worldId);
    if (!world) return { error: "World not found", status: 404 };
    const project = await Project.findById(world.projectId);
    if (!project || project.userId !== userId) return { error: "Forbidden", status: 403 };
    return { world, project };
}

// POST /api/worlds — create a world inside a project
router.post("/", authenticateToken, validate(createWorldSchema), async (req, res) => {
    try {
        const project = await Project.findById(req.body.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });
        if (project.userId !== req.user.userId) return res.status(403).json({ message: "Forbidden" });

        const world = new World({
            projectId: req.body.projectId,
            name: req.body.name,
            description: req.body.description,
            loreSections: req.body.loreSections || [],
        });
        const saved = await world.save();

        // Add world reference to project
        await Project.findByIdAndUpdate(req.body.projectId, { $push: { worldIds: saved._id } });

        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/worlds/project/:projectId — get all worlds for a project
router.get("/project/:projectId", authenticateToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });
        if (project.userId !== req.user.userId) return res.status(403).json({ message: "Forbidden" });

        const worlds = await World.find({ projectId: req.params.projectId });
        res.json(worlds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/worlds/:id — get a single world
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const { world, error, status } = await verifyWorldOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });
        res.json(world);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/worlds/:id — update world fields
router.patch("/:id", authenticateToken, validate(updateWorldSchema), async (req, res) => {
    try {
        const { error, status } = await verifyWorldOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });

        const { name, description, loreSections } = req.body;
        const updated = await World.findByIdAndUpdate(
            req.params.id,
            { $set: { name, description, loreSections } },
            { new: true, runValidators: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/worlds/:id — delete a world
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { world, project, error, status } = await verifyWorldOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });

        await World.findByIdAndDelete(req.params.id);

        // Remove reference from parent project
        await Project.findByIdAndUpdate(project._id, { $pull: { worldIds: world._id } });

        res.json({ message: "World deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
