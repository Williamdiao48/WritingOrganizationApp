import React, { useState } from 'react';
import { useOutletContext, Link, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '../lib/api.js';
import '../styles/dashboard.css';

export default function Dashboard() {
    const { user } = useOutletContext();
    const qc = useQueryClient();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tab, setTab] = useState('active'); // 'active' | 'archived'
    const [page, setPage] = useState(1);
    const [archivedPage, setArchivedPage] = useState(1);

    const { data: activeData = {}, isLoading, error } = useQuery({
        queryKey: ['projects', user?.id, page],
        queryFn: () => authFetch(`/api/projects/user/${user.id}?page=${page}&limit=12`),
        enabled: !!user?.id,
        keepPreviousData: true,
    });

    const { data: archivedData = {}, isLoading: archivedLoading } = useQuery({
        queryKey: ['projects-archived', user?.id, archivedPage],
        queryFn: () => authFetch(`/api/projects/user/${user.id}/archived?page=${archivedPage}&limit=12`),
        enabled: !!user?.id && tab === 'archived',
        keepPreviousData: true,
    });

    const projects = activeData.projects ?? [];
    const totalPages = activeData.totalPages ?? 1;

    const archivedProjects = archivedData.projects ?? [];
    const archivedTotalPages = archivedData.totalPages ?? 1;

    const createProject = useMutation({
        mutationFn: (body) => authFetch('/api/projects', { method: 'POST', body: JSON.stringify(body) }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['projects', user?.id] });
            setTitle('');
            setDescription('');
            setIsModalOpen(false);
            setPage(1);
        },
    });

    const archiveProject = useMutation({
        mutationFn: (id) => authFetch(`/api/projects/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['projects', user?.id] });
            qc.invalidateQueries({ queryKey: ['projects-archived', user?.id] });
        },
    });

    const restoreProject = useMutation({
        mutationFn: (id) => authFetch(`/api/projects/${id}/restore`, { method: 'PATCH' }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['projects', user?.id] });
            qc.invalidateQueries({ queryKey: ['projects-archived', user?.id] });
        },
    });

    const deleteProjectPermanent = useMutation({
        mutationFn: (id) => authFetch(`/api/projects/${id}/permanent`, { method: 'DELETE' }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['projects-archived', user?.id] });
        },
    });

    if (!user) return <Navigate to="/login" replace />;

    const handleCreateProject = (e) => {
        e.preventDefault();
        createProject.mutate({ title, description });
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Project Dashboard</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ New Project</button>
            </div>

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
                            <div className="modal-actions">
                                <button type="submit" disabled={createProject.isPending}>
                                    {createProject.isPending ? 'Saving...' : 'Save Project'}
                                </button>
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            </div>
                        </form>
                        {createProject.isError && (
                            <p className="error-message">{createProject.error.message}</p>
                        )}
                    </div>
                </div>
            )}

            <div className="dashboard-tabs">
                <button
                    className={`tab-btn${tab === 'active' ? ' tab-btn--active' : ''}`}
                    onClick={() => setTab('active')}
                >
                    Active
                </button>
                <button
                    className={`tab-btn${tab === 'archived' ? ' tab-btn--active' : ''}`}
                    onClick={() => setTab('archived')}
                >
                    Archived
                </button>
            </div>

            {tab === 'active' && (
                <>
                    {isLoading && <p>Loading projects...</p>}
                    {error && <p className="error-message">Failed to load projects: {error.message}</p>}
                    {!isLoading && !error && projects.length === 0 && (
                        <p className="empty-state">No projects yet. Create one above!</p>
                    )}
                    {!isLoading && !error && projects.length > 0 && (
                        <ul className="project-list">
                            {projects.map(proj => (
                                <li key={proj._id} className="project-list-item">
                                    <div className="project-info">
                                        <Link to={`/project/${proj._id}`}><strong>{proj.title}</strong></Link>
                                        {proj.description && <span className="project-desc">{proj.description}</span>}
                                    </div>
                                    <button
                                        className="btn-archive"
                                        onClick={() => archiveProject.mutate(proj._id)}
                                        disabled={archiveProject.isPending}
                                        title="Archive project"
                                    >
                                        Archive
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
                            <span>{page} / {totalPages}</span>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
                        </div>
                    )}
                </>
            )}

            {tab === 'archived' && (
                <>
                    {archivedLoading && <p>Loading archived projects...</p>}
                    {!archivedLoading && archivedProjects.length === 0 && (
                        <p className="empty-state">No archived projects.</p>
                    )}
                    {!archivedLoading && archivedProjects.length > 0 && (
                        <ul className="project-list">
                            {archivedProjects.map(proj => (
                                <li key={proj._id} className="project-list-item">
                                    <div className="project-info">
                                        <strong>{proj.title}</strong>
                                        {proj.description && <span className="project-desc">{proj.description}</span>}
                                    </div>
                                    <div className="project-actions">
                                        <button
                                            className="btn-restore"
                                            onClick={() => restoreProject.mutate(proj._id)}
                                            disabled={restoreProject.isPending}
                                        >
                                            Restore
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => {
                                                if (window.confirm(`Permanently delete "${proj.title}" and all its data? This cannot be undone.`)) {
                                                    deleteProjectPermanent.mutate(proj._id);
                                                }
                                            }}
                                            disabled={deleteProjectPermanent.isPending}
                                        >
                                            Delete Permanently
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    {archivedTotalPages > 1 && (
                        <div className="pagination">
                            <button onClick={() => setArchivedPage(p => Math.max(1, p - 1))} disabled={archivedPage === 1}>← Prev</button>
                            <span>{archivedPage} / {archivedTotalPages}</span>
                            <button onClick={() => setArchivedPage(p => Math.min(archivedTotalPages, p + 1))} disabled={archivedPage === archivedTotalPages}>Next →</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
