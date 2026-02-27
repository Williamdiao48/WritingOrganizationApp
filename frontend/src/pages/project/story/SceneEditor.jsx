import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '../../../lib/api.js';
import RichTextEditor from '../../../components/editor/RichTextEditor.jsx';

export default function SceneEditor() {
    const { sceneId, chapterId, storyId, projectId } = useParams();
    const qc = useQueryClient();

    const [title, setTitle] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [saveStatus, setSaveStatus] = useState('');

    const dirtyRef = useRef(false);
    const saveTimerRef = useRef(null);
    const titleRef = useRef('');
    const contentRef = useRef(null);

    const { data: scene, isLoading, error } = useQuery({
        queryKey: ['scene', sceneId],
        queryFn: () => authFetch(`/api/scenes/${sceneId}`),
        enabled: !!sceneId,
    });

    // Cancel any pending auto-save when the component unmounts
    useEffect(() => {
        return () => clearTimeout(saveTimerRef.current);
    }, []);

    useEffect(() => {
        if (scene) {
            setTitle(scene.title || '');
            titleRef.current = scene.title || '';
            contentRef.current = scene.content || null;
            dirtyRef.current = false;
        }
    }, [scene]);

    const saveScene = useMutation({
        mutationFn: (body) => authFetch(`/api/scenes/${sceneId}`, { method: 'PATCH', body: JSON.stringify(body) }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['scenes', chapterId] });
            setSaveStatus('Saved');
            setTimeout(() => setSaveStatus(''), 2000);
        },
        onError: (err) => setSaveStatus(`Error: ${err.message}`),
    });

    const scheduleAutoSave = () => {
        if (!dirtyRef.current) return;
        clearTimeout(saveTimerRef.current);
        setSaveStatus('Unsaved');
        saveTimerRef.current = setTimeout(() => {
            setSaveStatus('Saving...');
            const content = contentRef.current !== null ? JSON.stringify(contentRef.current) : '';
            saveScene.mutate({ title: titleRef.current, content });
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
        saveScene.mutate({ title: titleRef.current, content });
    };

    if (isLoading) return <div className="layout-loading">Loading scene...</div>;
    if (error) return <div className="layout-loading error-state">Failed to load scene: {error.message}</div>;

    return (
        <div className="chapter-editor-container">
            <div className="editor-toolbar">
                <Link
                    to={`/project/${projectId}/story/${storyId}/chapter/${chapterId}`}
                    className="back-to-chapter"
                >
                    ← Back to chapter
                </Link>
                <span className="editor-word-count">{wordCount.toLocaleString()} words</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="save-status">{saveStatus}</span>
                    <button className="save-btn" onClick={handleSave} disabled={saveScene.isPending}>
                        Save
                    </button>
                </div>
            </div>

            <input
                className="chapter-title-input"
                value={title}
                onChange={handleTitleChange}
                placeholder="Scene title"
            />

            {/* key={sceneId} remounts the editor when navigating between scenes */}
            <RichTextEditor
                key={sceneId}
                content={scene?.content}
                onChange={handleContentChange}
                onWordCountChange={setWordCount}
            />
        </div>
    );
}
