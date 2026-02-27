import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '../../../lib/api.js';

export default function ChapterEditor() {
    const { chapterId, storyId } = useParams();
    const qc = useQueryClient();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saveStatus, setSaveStatus] = useState('');

    const { data: chapter, isLoading, error } = useQuery({
        queryKey: ['chapter', chapterId],
        queryFn: () => authFetch(`/api/chapters/${chapterId}`),
        enabled: !!chapterId,
    });

    useEffect(() => {
        if (chapter) {
            setTitle(chapter.title || '');
            setContent(chapter.content || '');
        }
    }, [chapter]);

    const saveChapter = useMutation({
        mutationFn: (body) => authFetch(`/api/chapters/${chapterId}`, { method: 'PATCH', body: JSON.stringify(body) }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['chapters', storyId] });
            setSaveStatus('Saved');
            setTimeout(() => setSaveStatus(''), 2000);
        },
        onError: (err) => {
            setSaveStatus(`Error: ${err.message}`);
        },
    });

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    if (isLoading) return <div className="layout-loading">Loading chapter...</div>;
    if (error) return <div className="layout-loading error-state">Failed to load chapter: {error.message}</div>;

    const handleSave = () => {
        setSaveStatus('Saving...');
        saveChapter.mutate({ title, content });
    };

    return (
        <div className="chapter-editor-container">
            <div className="editor-toolbar">
                <span className="editor-word-count">{wordCount.toLocaleString()} words</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="save-status">{saveStatus}</span>
                    <button className="save-btn" onClick={handleSave} disabled={saveChapter.isPending}>
                        Save
                    </button>
                </div>
            </div>

            <input
                className="chapter-title-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Chapter title"
            />

            <textarea
                className="chapter-content-area"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Start writing..."
            />
        </div>
    );
}
