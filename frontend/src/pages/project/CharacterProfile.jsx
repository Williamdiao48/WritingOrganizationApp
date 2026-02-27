import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '../../lib/api.js';

export default function CharacterProfile() {
    const { characterId, projectId } = useParams();
    const qc = useQueryClient();

    const [saveStatus, setSaveStatus] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [species, setSpecies] = useState('');
    const [backstory, setBackstory] = useState('');
    const [traits, setTraits] = useState([]);

    const { data: character, isLoading, error } = useQuery({
        queryKey: ['character', characterId],
        queryFn: () => authFetch(`/api/characters/${characterId}`),
        enabled: !!characterId,
    });

    useEffect(() => {
        if (character) {
            setName(character.name || '');
            setRole(character.role || '');
            setAge(character.basics?.age || '');
            setGender(character.basics?.gender || '');
            setSpecies(character.basics?.species || '');
            setBackstory(character.backstory || '');
            setTraits(character.traits || []);
        }
    }, [character]);

    const saveCharacter = useMutation({
        mutationFn: (body) => authFetch(`/api/characters/${characterId}`, { method: 'PATCH', body: JSON.stringify(body) }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['characters', projectId] });
            setSaveStatus('Saved');
            setTimeout(() => setSaveStatus(''), 2000);
        },
        onError: (err) => {
            setSaveStatus(`Error: ${err.message}`);
        },
    });

    const addTrait = () => setTraits(prev => [...prev, { label: '', value: '' }]);
    const updateTrait = (i, field, val) =>
        setTraits(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: val } : t));
    const removeTrait = (i) => setTraits(prev => prev.filter((_, idx) => idx !== i));

    if (isLoading) return <div className="layout-loading">Loading character...</div>;
    if (error) return <div className="layout-loading error-state">Failed to load character: {error.message}</div>;
    if (!character) return <div className="layout-loading">Character not found.</div>;

    const handleSave = (e) => {
        e.preventDefault();
        setSaveStatus('Saving...');
        saveCharacter.mutate({ name, role, basics: { age, gender, species }, backstory, traits });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>{name || 'Character Profile'}</h1>
                <span className="save-feedback">{saveStatus}</span>
            </div>

            <form className="profile-form" onSubmit={handleSave}>
                <div className="form-group">
                    <label>Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Role</label>
                    <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Protagonist, Mentor" />
                </div>

                <div className="form-group">
                    <label>Basics</label>
                    <div className="basics-grid">
                        <input value={age} onChange={e => setAge(e.target.value)} placeholder="Age" />
                        <input value={gender} onChange={e => setGender(e.target.value)} placeholder="Gender" />
                        <input value={species} onChange={e => setSpecies(e.target.value)} placeholder="Species / Race" />
                    </div>
                </div>

                <div className="form-group">
                    <label>Traits</label>
                    <div className="traits-list">
                        {traits.map((t, i) => (
                            <div key={i} className="trait-row">
                                <input
                                    value={t.label}
                                    onChange={e => updateTrait(i, 'label', e.target.value)}
                                    placeholder="Label"
                                />
                                <input
                                    value={t.value}
                                    onChange={e => updateTrait(i, 'value', e.target.value)}
                                    placeholder="Value"
                                />
                                <button type="button" className="trait-remove-btn" onClick={() => removeTrait(i)}>×</button>
                            </div>
                        ))}
                        <button type="button" className="add-trait-btn" onClick={addTrait}>+ Add trait</button>
                    </div>
                </div>

                <div className="form-group">
                    <label>Backstory</label>
                    <textarea
                        value={backstory}
                        onChange={e => setBackstory(e.target.value)}
                        rows={6}
                        placeholder="Character backstory..."
                    />
                </div>

                <button type="submit" className="save-profile-btn" disabled={saveCharacter.isPending}>
                    {saveCharacter.isPending ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
}
