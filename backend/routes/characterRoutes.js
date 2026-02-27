import express from "express";
import Character from "../models/mongo/characterModel.js";
import Project from "../models/mongo/projectModel.js";
import authenticateToken from "../middleware/auth.js";
import { validate } from '../middleware/validate.js';
import { createCharacterSchema, updateCharacterSchema } from '../validation/schemas.js';

const router = express.Router();

// Verify the requesting user owns the project that contains this character
async function verifyCharacterOwnership(characterId, userId) {
    const character = await Character.findById(characterId);
    if (!character) return { error: "Character not found", status: 404 };
    const project = await Project.findById(character.projectId);
    if (!project || project.userId !== userId) return { error: "Forbidden", status: 403 };
    return { character, project };
}

// POST /api/characters — create a character inside a project
router.post("/", authenticateToken, validate(createCharacterSchema), async (req, res) => {
    try {
        const project = await Project.findById(req.body.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });
        if (project.userId !== req.user.userId) return res.status(403).json({ message: "Forbidden" });

        const character = new Character({
            projectId: req.body.projectId,
            name: req.body.name,
            role: req.body.role,
            avatar: req.body.avatar,
            basics: req.body.basics,
            traits: req.body.traits || [],
            backstory: req.body.backstory,
        });
        const saved = await character.save();

        // Add character reference to project
        await Project.findByIdAndUpdate(req.body.projectId, { $push: { characterIds: saved._id } });

        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/characters/project/:projectId — get all characters for a project
router.get("/project/:projectId", authenticateToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });
        if (project.userId !== req.user.userId) return res.status(403).json({ message: "Forbidden" });

        const characters = await Character.find({ projectId: req.params.projectId });
        res.json(characters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/characters/:id — get a single character
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const { character, error, status } = await verifyCharacterOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });
        res.json(character);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/characters/:id — update character fields
router.patch("/:id", authenticateToken, validate(updateCharacterSchema), async (req, res) => {
    try {
        const { error, status } = await verifyCharacterOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });

        const { name, role, avatar, basics, traits, backstory } = req.body;
        const updated = await Character.findByIdAndUpdate(
            req.params.id,
            { $set: { name, role, avatar, basics, traits, backstory } },
            { new: true, runValidators: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/characters/:id — delete a character
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { character, project, error, status } = await verifyCharacterOwnership(req.params.id, req.user.userId);
        if (error) return res.status(status).json({ message: error });

        await Character.findByIdAndDelete(req.params.id);

        // Remove reference from parent project
        await Project.findByIdAndUpdate(project._id, { $pull: { characterIds: character._id } });

        res.json({ message: "Character deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
