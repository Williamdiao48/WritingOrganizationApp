import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '../../../lib/api.js';
import RichTextEditor from '../../../components/editor/RichTextEditor.jsx';

export default function ChapterEditor() {
    const { chapterId, storyId, projectId } = useParams();
    const qc = useQueryClient();

    const [title, setTitle] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [saveStatus, setSaveStatus] = useState('');

    // Refs avoid stale closures in the debounced save callback
    const dirtyRef = useRef(false);
    const saveTimerRef = useRef(null);
    const titleRef = useRef('');
    const contentRef = useRef(null);

    const { data: chapter, isLoading, error } = useQuery({
        queryKey: ['chapter', chapterId],
        queryFn: () => authFetch(`/api/chapters/${chapterId}`),
        enabled: !!chapterId,
    });

    const { data: scenes = [] } = useQuery({
        queryKey: ['scenes', chapterId],
        queryFn: () => authFetch(`/api/scenes/chapter/${chapterId}`),
        enabled: !!chapterId,
    });

    // Cancel any pending auto-save when the component unmounts
    useEffect(() => {
        return () => clearTimeout(saveTimerRef.current);
    }, []);

    // Sync state from query data; reset dirty flag so initial load doesn't auto-save
    useEffect(() => {
        if (chapter) {
            setTitle(chapter.title || '');
            titleRef.current = chapter.title || '';
            contentRef.current = chapter.content || null;
            dirtyRef.current = false;
        }
    }, [chapter]);

    const saveChapter = useMutation({
        mutationFn: (body) => authFetch(`/api/chapters/${chapterId}`, { method: 'PATCH', body: JSON.stringify(body) }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['chapters', storyId] });
            setSaveStatus('Saved');
            setTimeout(() => setSaveStatus(''), 2000);
        },
        onError: (err) => setSaveStatus(`Error: ${err.message}`),
    });

    const createScene = useMutation({
        mutationFn: (body) => authFetch('/api/scenes', { method: 'POST', body: JSON.stringify(body) }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['scenes', chapterId] }),
    });

    const scheduleAutoSave = () => {
        if (!dirtyRef.current) return;
        clearTimeout(saveTimerRef.current);
        setSaveStatus('Unsaved');
        saveTimerRef.current = setTimeout(() => {
            setSaveStatus('Saving...');
            const content = contentRef.current !== null ? JSON.stringify(contentRef.current) : '';
            saveChapter.mutate({ title: titleRef.current, content });
        }, 1500);
    };

    const handleTitleChange = (e) => {
        const val = e.target.value;
        setTitle(val);
        titleRef.current = val;
        dirtyRef.current = true;
        scheduleAutoSave();
    };

    const handleContentChange = (json) => {
        contentRef.current = json;
        dirtyRef.current = true;
        scheduleAutoSave();
    };

    const handleSave = () => {
        clearTimeout(saveTimerRef.current);
        setSaveStatus('Saving...');
        const content = contentRef.current !== null ? JSON.stringify(contentRef.current) : '';
        saveChapter.mutate({ title: titleRef.current, content });
    };

    if (isLoading) return <div className="layout-loading">Loading chapter...</div>;
    if (error) return <div className="layout-loading error-state">Failed to load chapter: {error.message}</div>;

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
                onChange={handleTitleChange}
                placeholder="Chapter title"
            />

            {/* key={chapterId} remounts the editor when navigating between chapters */}
            <RichTextEditor
                key={chapterId}
                content={chapter?.content}
                onChange={handleContentChange}
                onWordCountChange={setWordCount}
            />

            <div className="scene-list-section">
                <div className="scene-list-header">
                    <span>Scenes</span>
                    <button
                        className="sidebar-add-btn"
                        onClick={() => createScene.mutate({
                            chapterId,
                            title: `Scene ${scenes.length + 1}`,
                            order: scenes.length,
                        })}
                        disabled={createScene.isPending}
                        title="Add scene"
                    >+</button>
                </div>
                {scenes.length === 0 ? (
                    <p className="scene-empty">No scenes yet. Click + to add one.</p>
                ) : (
                    <ul className="scene-list">
                        {scenes.map(scene => (
                            <li key={scene._id}>
                                <Link
                                    to={`/project/${projectId}/story/${storyId}/chapter/${chapterId}/scene/${scene._id}`}
                                    className="scene-list-link"
                                >
                                    {scene.title || 'Untitled Scene'}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
