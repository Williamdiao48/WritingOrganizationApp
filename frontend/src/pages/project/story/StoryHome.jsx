import React from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';

export default function StoryHome() {
    const { story, chapters } = useOutletContext();
    const { projectId, storyId } = useParams();

    const wordCount = chapters.reduce((sum, ch) => {
        if (!ch.content?.trim()) return sum;
        return sum + ch.content.trim().split(/\s+/).length;
    }, 0);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>{story?.title}</h1>
                <span className="status-badge">{story?.status}</span>
            </div>

            {story?.summary && (
                <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '1.5rem' }}>{story.summary}</p>
            )}

            <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '2rem' }}>
                {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} · {wordCount.toLocaleString()} words
            </p>

            <p className="section-title">Chapters</p>

            {chapters.length === 0 ? (
                <p style={{ color: '#999' }}>No chapters yet. Use the sidebar to add one.</p>
            ) : (
                <ul className="chapter-list">
                    {chapters.map((ch, i) => (
                        <Link
                            key={ch._id}
                            to={`/project/${projectId}/story/${storyId}/chapter/${ch._id}`}
                            className="chapter-item"
                        >
                            <span className="chapter-item-title">{i + 1}. {ch.title}</span>
                            <span className="chapter-item-meta">
                                {ch.content?.trim()
                                    ? `${ch.content.trim().split(/\s+/).length.toLocaleString()} words`
                                    : 'Empty'}
                            </span>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    );
}
