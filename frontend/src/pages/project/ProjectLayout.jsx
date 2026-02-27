import React, { useState } from 'react';
import { Outlet, NavLink, Link, useOutletContext, useParams, Navigate, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '../../lib/api.js';
import '../../styles/project-layout.css';

export default function ProjectLayout() {
    const { user, setUser } = useOutletContext();
    const { projectId } = useParams();
    const navigate = useNavigate();
    const qc = useQueryClient();

    const [storyTitle, setStoryTitle] = useState('');
    const [showStoryForm, setShowStoryForm] = useState(false);
    const [charName, setCharName] = useState('');
    const [showCharForm, setShowCharForm] = useState(false);
    const [worldName, setWorldName] = useState('');
    const [showWorldForm, setShowWorldForm] = useState(false);

    const { data: project, isLoading: projLoading, error: projError } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => authFetch(`/api/projects/${projectId}`),
        enabled: !!user && !!projectId,
    });

    const { data: stories = [] } = useQuery({
        queryKey: ['stories', projectId],
        queryFn: () => authFetch(`/api/stories/project/${projectId}`),
        enabled: !!user && !!projectId,
    });

    const { data: characters = [] } = useQuery({
        queryKey: ['characters', projectId],
        queryFn: () => authFetch(`/api/characters/project/${projectId}`),
        enabled: !!user && !!projectId,
    });

    const { data: worlds = [] } = useQuery({
        queryKey: ['worlds', projectId],
        queryFn: () => authFetch(`/api/worlds/project/${projectId}`),
        enabled: !!user && !!projectId,
    });

    const createStory = useMutation({
        mutationFn: (body) => authFetch('/api/stories', { method: 'POST', body: JSON.stringify(body) }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['stories', projectId] });
            setStoryTitle('');
            setShowStoryForm(false);
        },
    });

    const createCharacter = useMutation({
        mutationFn: (body) => authFetch('/api/characters', { method: 'POST', body: JSON.stringify(body) }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['characters', projectId] });
            setCharName('');
            setShowCharForm(false);
        },
    });

    const createWorld = useMutation({
        mutationFn: (body) => authFetch('/api/worlds', { method: 'POST', body: JSON.stringify(body) }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['worlds', projectId] });
            setWorldName('');
            setShowWorldForm(false);
        },
    });

    if (!user) return <Navigate to="/login" replace />;

    if (projError?.status === 404 || projError?.status === 403) {
        navigate('/dashboard');
        return null;
    }

    if (projLoading) return <div className="layout-loading">Loading project...</div>;
    if (projError) return <div className="layout-loading error-state">Failed to load project.</div>;
    if (!project) return null;

    const handleCreateStory = (e) => {
        e.preventDefault();
        createStory.mutate({ projectId, title: storyTitle });
    };

    const handleCreateCharacter = (e) => {
        e.preventDefault();
        createCharacter.mutate({ projectId, name: charName });
    };

    const handleCreateWorld = (e) => {
        e.preventDefault();
        createWorld.mutate({ projectId, name: worldName });
    };

    return (
        <div className="project-layout">
            <aside className="project-sidebar">
                <Link to="/dashboard" className="sidebar-back-link">← Dashboard</Link>
                <h2 className="sidebar-project-title">{project?.title}</h2>

                <NavLink
                    to={`/project/${projectId}`}
                    end
                    className={({ isActive }) => isActive ? 'sidebar-overview-link active' : 'sidebar-overview-link'}
                >
                    Overview
                </NavLink>

                {/* Stories */}
                <section className="sidebar-section">
                    <div className="sidebar-section-header">
                        <span>Stories</span>
                        <button className="sidebar-add-btn" onClick={() => setShowStoryForm(v => !v)}>+</button>
                    </div>
                    {showStoryForm && (
                        <form className="sidebar-inline-form" onSubmit={handleCreateStory}>
                            <input value={storyTitle} onChange={e => setStoryTitle(e.target.value)} placeholder="Story title" required autoFocus />
                            <div className="sidebar-form-actions">
                                <button type="submit" disabled={createStory.isPending}>Add</button>
                                <button type="button" onClick={() => setShowStoryForm(false)}>Cancel</button>
                            </div>
                        </form>
                    )}
                    <ul className="sidebar-list">
                        {stories.map(s => (
                            <li key={s._id}>
                                <NavLink
                                    to={`/project/${projectId}/story/${s._id}`}
                                    className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                                >
                                    {s.title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Characters */}
                <section className="sidebar-section">
                    <div className="sidebar-section-header">
                        <span>Characters</span>
                        <button className="sidebar-add-btn" onClick={() => setShowCharForm(v => !v)}>+</button>
                    </div>
                    {showCharForm && (
                        <form className="sidebar-inline-form" onSubmit={handleCreateCharacter}>
                            <input value={charName} onChange={e => setCharName(e.target.value)} placeholder="Character name" required autoFocus />
                            <div className="sidebar-form-actions">
                                <button type="submit" disabled={createCharacter.isPending}>Add</button>
                                <button type="button" onClick={() => setShowCharForm(false)}>Cancel</button>
                            </div>
                        </form>
                    )}
                    <ul className="sidebar-list">
                        {characters.map(c => (
                            <li key={c._id}>
                                <NavLink
                                    to={`/project/${projectId}/characters/${c._id}`}
                                    className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                                >
                                    {c.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Worlds */}
                <section className="sidebar-section">
                    <div className="sidebar-section-header">
                        <span>Worlds</span>
                        <button className="sidebar-add-btn" onClick={() => setShowWorldForm(v => !v)}>+</button>
                    </div>
                    {showWorldForm && (
                        <form className="sidebar-inline-form" onSubmit={handleCreateWorld}>
                            <input value={worldName} onChange={e => setWorldName(e.target.value)} placeholder="World name" required autoFocus />
                            <div className="sidebar-form-actions">
                                <button type="submit" disabled={createWorld.isPending}>Add</button>
                                <button type="button" onClick={() => setShowWorldForm(false)}>Cancel</button>
                            </div>
                        </form>
                    )}
                    <ul className="sidebar-list">
                        {worlds.map(w => (
                            <li key={w._id}>
                                <NavLink
                                    to={`/project/${projectId}/world/${w._id}`}
                                    className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                                >
                                    {w.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </section>
            </aside>

            <main className="project-content">
                <Outlet context={{ user, setUser, project, stories, characters, worlds }} />
            </main>
        </div>
    );
}
