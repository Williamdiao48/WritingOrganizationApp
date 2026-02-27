import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '../../lib/api.js';

export default function WorldDetail() {
    const { worldId, projectId } = useParams();
    const qc = useQueryClient();

    const [saveStatus, setSaveStatus] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loreSections, setLoreSections] = useState([]);

    const { data: world, isLoading, error } = useQuery({
        queryKey: ['world', worldId],
        queryFn: () => authFetch(`/api/worlds/${worldId}`),
        enabled: !!worldId,
    });

    useEffect(() => {
        if (world) {
            setName(world.name || '');
            setDescription(world.description || '');
            setLoreSections(world.loreSections || []);
        }
    }, [world]);

    const saveWorld = useMutation({
        mutationFn: (body) => authFetch(`/api/worlds/${worldId}`, { method: 'PATCH', body: JSON.stringify(body) }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['worlds', projectId] });
            setSaveStatus('Saved');
            setTimeout(() => setSaveStatus(''), 2000);
        },
        onError: (err) => {
            setSaveStatus(`Error: ${err.message}`);
        },
    });

    const addLoreSection = () =>
        setLoreSections(prev => [...prev, { header: '', body: '' }]);
    const updateLoreSection = (i, field, val) =>
        setLoreSections(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
    const removeLoreSection = (i) =>
        setLoreSections(prev => prev.filter((_, idx) => idx !== i));

    if (isLoading) return <div className="layout-loading">Loading world...</div>;
    if (error) return <div className="layout-loading error-state">Failed to load world: {error.message}</div>;
    if (!world) return <div className="layout-loading">World not found.</div>;

    const handleSave = (e) => {
        e.preventDefault();
        setSaveStatus('Saving...');
        saveWorld.mutate({ name, description, loreSections });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>{name || 'World'}</h1>
                <span className="save-feedback">{saveStatus}</span>
            </div>

            <form className="profile-form" onSubmit={handleSave}>
                <div className="form-group">
                    <label>Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Brief overview of this world..."
                    />
                </div>

                <div className="form-group">
                    <label>Lore</label>
                    <button type="button" className="add-lore-btn" onClick={addLoreSection}>
                        + Add lore section
                    </button>
                    {loreSections.map((section, i) => (
                        <div key={i} className="lore-section">
                            <div className="lore-section-header">
                                <input
                                    value={section.header}
                                    onChange={e => updateLoreSection(i, 'header', e.target.value)}
                                    placeholder="Section title (e.g. Magic System, History)"
                                    style={{ border: 'none', background: 'transparent', fontWeight: '600', fontSize: '0.9rem', outline: 'none', flex: 1 }}
                                />
                                <button type="button" className="lore-remove-btn" onClick={() => removeLoreSection(i)}>
                                    Remove
                                </button>
                            </div>
                            <div className="lore-section-body">
                                <textarea
                                    value={section.body}
                                    onChange={e => updateLoreSection(i, 'body', e.target.value)}
                                    placeholder="Describe this aspect of your world..."
                                    rows={4}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button type="submit" className="save-profile-btn" disabled={saveWorld.isPending}>
                    {saveWorld.isPending ? 'Saving...' : 'Save World'}
                </button>
            </form>
        </div>
    );
}
