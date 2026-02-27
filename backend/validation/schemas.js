import { z } from 'zod';

// ── User ────────────────────────────────────────────────────
export const registerSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email().max(255),
    password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(6).max(100),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(6).max(100),
});

// ── Project ─────────────────────────────────────────────────
export const createProjectSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
});

export const updateProjectSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    cover: z.string().max(500).optional(),
});

// ── Story ───────────────────────────────────────────────────
export const createStorySchema = z.object({
    projectId: z.string().min(1),
    title: z.string().min(1).max(200),
    status: z.enum(['Draft', 'In Progress', 'Completed']).optional(),
    visibility: z.enum(['Private', 'Public', 'Archived']).optional(),
    worldId: z.string().optional(),
    cover: z.string().max(500).optional(),
    summary: z.string().max(5000).optional(),
});

export const updateStorySchema = z.object({
    title: z.string().min(1).max(200).optional(),
    status: z.enum(['Draft', 'In Progress', 'Completed']).optional(),
    visibility: z.enum(['Private', 'Public', 'Archived']).optional(),
    worldId: z.string().optional(),
    cover: z.string().max(500).optional(),
    summary: z.string().max(5000).optional(),
});

// ── Chapter ─────────────────────────────────────────────────
export const createChapterSchema = z.object({
    storyId: z.string().min(1),
    title: z.string().min(1).max(200),
    order: z.number().int().min(0).optional(),
});

export const updateChapterSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().optional(),
    order: z.number().int().min(0).optional(),
});

// ── Scene ───────────────────────────────────────────────────
export const createSceneSchema = z.object({
    chapterId: z.string().min(1),
    title: z.string().min(1).max(200),
    order: z.number().int().min(0).optional(),
});

export const updateSceneSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().optional(),
    order: z.number().int().min(0).optional(),
});

// ── Character ───────────────────────────────────────────────
export const createCharacterSchema = z.object({
    projectId: z.string().min(1),
    name: z.string().min(1).max(200),
});

export const updateCharacterSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    role: z.string().max(100).optional(),
    basics: z.object({
        age: z.union([z.string().max(50), z.number()]).optional(),
        gender: z.string().max(50).optional(),
        species: z.string().max(100).optional(),
    }).optional(),
    backstory: z.string().optional(),
    traits: z.array(z.object({
        label: z.string().max(100),
        value: z.string().max(500),
    })).optional(),
});

// ── World ───────────────────────────────────────────────────
export const createWorldSchema = z.object({
    projectId: z.string().min(1),
    name: z.string().min(1).max(200),
});

export const updateWorldSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).optional(),
    loreSections: z.array(z.object({
        header: z.string().max(200),
        body: z.string(),
    })).optional(),
});
