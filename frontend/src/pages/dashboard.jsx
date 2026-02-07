import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Dashboard (){
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isModalOpen, setisModalOpen] = useState(false);
    const { user, setUser } = useOutletContext();

    console.log("DASHBOARD RENDERED");
    console.log("USER OBJECT IS:", user);

    const handleCreateProject = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch("http://localhost:5050/api/projects",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    userId: user.id,
                    title: title,
                    description: "New writing project",
                }),
            });
            if (response.ok){
                const newProject = await response.json();
                setProjects((prev) => [...prev, newProject]);
                setTitle("");
                setDescription("");
                setIsModalOpen(false);
            }
        }catch (err) {
            console.error("Error creating project:", err);}
    };

    useEffect (() => {
        if (!user || !user.id) return;
        const loadProjects = async () => {
            try {
                const response = await fetch (`http://localhost:5050/api/projects/user/${user.id}`);
                const data = await response.json();
                setProjects(data);}
            catch(err){
                console.error("Error loading projects:", err);
            }
        };
        if (user?.id){
            loadProjects();
        }
    }, [user?.id]);

    return (
    <div className="dashboard-container">
        <h1> Project Dashboard </h1>
        <button onClick={() => setisModalOpen(true)}> Create New Project </button>

        {isModalOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Create New Project</h2>

                        <form onSubmit={handleCreateProject}>
                            <input value = {title} onChange={(e)=>setTitle(e.target.value)}/>
                            <textarea value = {description} onChange={(e)=>setDescription(e.target.value)}/>
                            <button type="submit">Save Project</button>
                            <button type="button" onClick={() => setisModalOpen(false)}>Cancel</button>
                        </form>
                </div>
            </div>)}
        <h2>My Projects</h2>
        {projects.length === 0 ? (
        <p>No projects yet. Create one above!</p>
      ) : (<ul>
        {projects.map((proj) => (
            <li key = {proj._id}>
                <strong>{proj.title}</strong> - {proj.description}
            </li>
            ))}
        </ul>
      )}
    </div>
);
}

