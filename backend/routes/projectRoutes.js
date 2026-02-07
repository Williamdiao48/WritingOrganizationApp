import express from "express";
import Project from "../models/mongo/projectModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try{
        const newProject = new Project({
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description,
            cover: req.body.cover,
            worldIds: req.body.worldIds || [], 
            storyIds: req.body.storyIds || [],
            characterIds: req.body.characterIds || []
        });
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);}    
    catch(err){
        res.status(500).json({ error: err.message });
    }
});

router.get("/user/:userId", async (req, res) =>{
    try{
        const idFromUrl =req.params.userId;
        const userProjects = await Project.find({userId: idFromUrl});
        res.json(userProjects);
    }
    catch(err){
        console.error("Backend Error:", err);
        res.status(500).json({ error: "Could not fetch projects" });
    }
});

export default router;