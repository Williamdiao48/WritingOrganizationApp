import React from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';

export default function ProjectHome() {
    const { project, stories, characters, worlds } = useOutletContext();
    const { projectId } = useParams();

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>{project?.title}</h1>
            </div>

            {project?.description && <p style={{ color: '#666', marginBottom: '2rem' }}>{project.description}</p>}

            {/* Stats */}
            <div className="overview-stats">
                <Link to={`/project/${projectId}/story/${stories[0]?._id}`} className="stat-card" style={{ pointerEvents: stories.length ? 'auto' : 'none' }}>
                    <h3>Stories</h3>
                    <p>{stories.length}</p>
                </Link>
                <Link to={`/project/${projectId}/characters`} className="stat-card">
                    <h3>Characters</h3>
                    <p>{characters.length}</p>
                </Link>
                <div className="stat-card">
                    <h3>Worlds</h3>
                    <p>{worlds.length}</p>
                </div>
            </div>

            {/* Stories */}
            {stories.length > 0 && (
                <>
                    <p className="section-title">Stories</p>
                    <div className="content-grid">
                        {stories.map(s => (
                            <Link key={s._id} to={`/project/${projectId}/story/${s._id}`} className="content-card">
                                <h4>{s.title}</h4>
                                <p>{s.status}</p>
                            </Link>
                        ))}
                    </div>
                </>
            )}

            {/* Characters */}
            {characters.length > 0 && (
                <>
                    <p className="section-title">Characters</p>
                    <div className="content-grid">
                        {characters.map(c => (
                            <Link key={c._id} to={`/project/${projectId}/characters/${c._id}`} className="content-card">
                                <h4>{c.name}</h4>
                                <p>{c.role || 'No role set'}</p>
                            </Link>
                        ))}
                    </div>
                </>
            )}

            {/* Worlds */}
            {worlds.length > 0 && (
                <>
                    <p className="section-title">Worlds</p>
                    <div className="content-grid">
                        {worlds.map(w => (
                            <Link key={w._id} to={`/project/${projectId}/world/${w._id}`} className="content-card">
                                <h4>{w.name}</h4>
                                <p>{w.loreSections?.length ?? 0} lore section{w.loreSections?.length !== 1 ? 's' : ''}</p>
                            </Link>
                        ))}
                    </div>
                </>
            )}

            {stories.length === 0 && characters.length === 0 && worlds.length === 0 && (
                <p style={{ color: '#999' }}>
                    Use the sidebar to add stories, characters, and worlds to this project.
                </p>
            )}
        </div>
    );
}
