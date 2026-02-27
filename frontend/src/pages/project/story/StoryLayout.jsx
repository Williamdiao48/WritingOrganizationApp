import React, { useState } from 'react';
import { Outlet, NavLink, Link, useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '../../../lib/api.js';
import '../../../styles/project-layout.css';

export default function StoryLayout() {
    const { user, setUser, project } = useOutletContext();
    const { projectId, storyId } = useParams();
    const navigate = useNavigate();
    const qc = useQueryClient();

    const [chapterTitle, setChapterTitle] = useState('');
    const [showChapterForm, setShowChapterForm] = useState(false);

    const { data: story, isLoading: storyLoading, error: storyError } = useQuery({
        queryKey: ['story', storyId],
        queryFn: () => authFetch(`/api/stories/${storyId}`),
        enabled: !!user && !!storyId,
    });

    const { data: chapters = [] } = useQuery({
        queryKey: ['chapters', storyId],
        queryFn: () => authFetch(`/api/chapters/story/${storyId}`),
        enabled: !!user && !!storyId,
    });

    const createChapter = useMutation({
        mutationFn: (body) => authFetch('/api/chapters', { method: 'POST', body: JSON.stringify(body) }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['chapters', storyId] });
            setChapterTitle('');
            setShowChapterForm(false);
        },
    });

    if (storyError?.status === 404 || storyError?.status === 403) {
        navigate(`/project/${projectId}`);
        return null;
    }

    if (storyLoading) return <div className="layout-loading">Loading story...</div>;
    if (storyError) return <div className="layout-loading error-state">Failed to load story.</div>;

    const handleCreateChapter = (e) => {
        e.preventDefault();
        createChapter.mutate({ storyId, title: chapterTitle || 'Untitled Chapter', order: chapters.length });
    };

    return (
        <div className="story-layout">
            <aside className="story-sidebar">
                <Link to={`/project/${projectId}`} className="sidebar-back-link">← {project?.title}</Link>
                <h2 className="sidebar-story-title">{story?.title}</h2>

                <NavLink
                    to={`/project/${projectId}/story/${storyId}`}
                    end
                    className={({ isActive }) => isActive ? 'sidebar-overview-link active' : 'sidebar-overview-link'}
                >
                    Story Overview
                </NavLink>

                <section className="sidebar-section">
                    <div className="sidebar-section-header">
                        <span>Chapters</span>
                        <button className="sidebar-add-btn" onClick={() => setShowChapterForm(v => !v)}>+</button>
                    </div>
                    {showChapterForm && (
                        <form className="sidebar-inline-form" onSubmit={handleCreateChapter}>
                            <input
                                value={chapterTitle}
                                onChange={e => setChapterTitle(e.target.value)}
                                placeholder="Chapter title"
                                autoFocus
                            />
                            <div className="sidebar-form-actions">
                                <button type="submit" disabled={createChapter.isPending}>Add</button>
                                <button type="button" onClick={() => setShowChapterForm(false)}>Cancel</button>
                            </div>
                        </form>
                    )}
                    <ul className="sidebar-list">
                        {chapters.map((ch, i) => (
                            <li key={ch._id}>
                                <NavLink
                                    to={`/project/${projectId}/story/${storyId}/chapter/${ch._id}`}
                                    className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                                >
                                    {i + 1}. {ch.title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </section>
            </aside>

            <main className="story-content">
                <Outlet context={{ user, setUser, project, story, chapters }} />
            </main>
        </div>
    );
}
