import React from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';

export default function CharacterRoster() {
    const { characters } = useOutletContext();
    const { projectId } = useParams();

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Characters</h1>
            </div>

            {characters.length === 0 ? (
                <p style={{ color: '#999' }}>No characters yet. Use the sidebar to add one.</p>
            ) : (
                <div className="character-grid">
                    {characters.map(c => (
                        <Link key={c._id} to={`/project/${projectId}/characters/${c._id}`} className="character-card">
                            <h4>{c.name}</h4>
                            <p>{c.role || 'No role set'}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
