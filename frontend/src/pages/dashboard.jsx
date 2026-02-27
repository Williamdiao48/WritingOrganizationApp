import React, { useState } from 'react';
import { useOutletContext, Link, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '../lib/api.js';

export default function Dashboard() {
    const { user } = useOutletContext();
    const qc = useQueryClient();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: projects = [], isLoading, error } = useQuery({
        queryKey: ['projects', user?.id],
        queryFn: () => authFetch(`/api/projects/user/${user.id}`),
        enabled: !!user?.id,
    });

    const createProject = useMutation({
        mutationFn: (body) => authFetch('/api/projects', { method: 'POST', body: JSON.stringify(body) }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['projects', user?.id] });
            setTitle('');
            setDescription('');
            setIsModalOpen(false);
        },
    });

    if (!user) return <Navigate to="/login" replace />;

    const handleCreateProject = (e) => {
        e.preventDefault();
        createProject.mutate({ title, description });
    };

    return (
        <div className="dashboard-container">
            <h1>Project Dashboard</h1>
            <button onClick={() => setIsModalOpen(true)}>Create New Project</button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New Project</h2>
                        <form onSubmit={handleCreateProject}>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Project title"
                                required
                            />
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Short description (optional)"
                            />
                            <button type="submit" disabled={createProject.isPending}>
                                {createProject.isPending ? 'Saving...' : 'Save Project'}
                            </button>
                            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </form>
                        {createProject.isError && (
                            <p className="error-message">{createProject.error.message}</p>
                        )}
                    </div>
                </div>
            )}

            <h2>My Projects</h2>
            {isLoading && <p>Loading projects...</p>}
            {error && <p className="error-message">Failed to load projects: {error.message}</p>}
            {!isLoading && !error && projects.length === 0 && <p>No projects yet. Create one above!</p>}
            {!isLoading && !error && projects.length > 0 && (
                <ul>
                    {projects.map(proj => (
                        <li key={proj._id}>
                            <Link to={`/project/${proj._id}`}><strong>{proj.title}</strong></Link>
                            {proj.description && ` — ${proj.description}`}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
