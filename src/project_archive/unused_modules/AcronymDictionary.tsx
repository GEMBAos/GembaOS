/**
 * ARCHIVE NOTICE
 * Original Use: Used as a dictionary for Lean acronyms.
 * Moved to: unused_modules
 */

import { useState, useEffect } from 'react';
import { acronymService, type Acronym } from '../../services/acronymService';
import { supabase } from '../../lib/supabase';

export default function AcronymDictionary() {
    const [acronyms, setAcronyms] = useState<Acronym[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // New acronym form state
    const [newAcronym, setNewAcronym] = useState('');
    const [newDefinition, setNewDefinition] = useState('');
    const [newContext, setNewContext] = useState('');
    const [submitMessage, setSubmitMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

    useEffect(() => {
        fetchAcronyms();
    }, []);

    const fetchAcronyms = async () => {
        setIsLoading(true);
        const data = await acronymService.getAcronyms();
        // The service already handles falling back to local data if the db fails
        setAcronyms(data);
        setIsLoading(false);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitMessage(null);
        if (!newAcronym || !newDefinition) return;

        const { data: { user } } = await supabase.auth.getUser();

        const success = await acronymService.submitAcronym(
            newAcronym.trim(),
            newDefinition.trim(),
            newContext.trim(),
            user?.id || null
        );

        if (success) {
            setSubmitMessage({ text: 'Acronym submitted successfully! +5 XP awarded.', type: 'success' });
            // Refresh list
            await fetchAcronyms();
            
            // Reset form
            setTimeout(() => {
                setNewAcronym('');
                setNewDefinition('');
                setNewContext('');
                setIsSubmitting(false);
                setSubmitMessage(null);
            }, 2000);
        } else {
            setSubmitMessage({ text: 'Failed to submit acronym. Please try again.', type: 'error' });
        }
    };

    const handleVote = () => {
        // Vote functionality could also be moved to Supabase in a future iteration
        // For now, it's just local UI feedback, or we can omit it if not migrated.
        // I will keep it as local feedback for the demo.
        alert("Voting will be fully supported in a future update!");
    };

    const filteredAcronyms = acronyms.filter(a => 
        a.acronym.toLowerCase().includes(searchTerm) || 
        a.definition.toLowerCase().includes(searchTerm)
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '2.5rem' }}>📖</span> Lean Glossary
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Search and decode plant terminology, or drop your own knowledge.</p>
                </div>
                <button 
                    className="btn btn-primary" 
                    onClick={() => setIsSubmitting(!isSubmitting)}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '2rem', fontWeight: 'bold' }}
                >
                    {isSubmitting ? 'Cancel' : '+ Submit Acronym'}
                </button>
            </div>

            {isSubmitting && (
                <div className="card animate-slide-up" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--accent-primary)', background: 'rgba(14, 165, 233, 0.05)' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--accent-primary)' }}>Submit New Term</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '150px' }}>
                                <label className="input-label">Acronym / Term</label>
                                <input 
                                    className="input-field" 
                                    placeholder="e.g. Gemba" 
                                    value={newAcronym} 
                                    onChange={(e) => setNewAcronym(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div style={{ flex: 2, minWidth: '250px' }}>
                                <label className="input-label">Full Definition</label>
                                <input 
                                    className="input-field" 
                                    placeholder="e.g. The real place where work happens" 
                                    value={newDefinition} 
                                    onChange={(e) => setNewDefinition(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Context / Example (Optional)</label>
                            <textarea 
                                className="input-field" 
                                placeholder="How is this used on our floor?" 
                                value={newContext} 
                                onChange={(e) => setNewContext(e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div style={{ alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                            {submitMessage && (
                                <div style={{ 
                                    padding: '0.5rem 1rem', 
                                    borderRadius: '0.5rem', 
                                    fontSize: '0.9rem',
                                    background: submitMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: submitMessage.type === 'success' ? '#34d399' : '#fca5a5',
                                }}>
                                    {submitMessage.text}
                                </div>
                            )}
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 2rem' }}>
                                Publish to Glossary
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ marginBottom: '2rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                <input 
                    type="text" 
                    placeholder="Search for an acronym (e.g. 'OTD' or 'Delivery')..." 
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        width: '100%',
                        padding: '1rem 1rem 1rem 3rem',
                        fontSize: '1.1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--border-light)',
                        background: 'var(--bg-panel)',
                        color: 'var(--text-main)',
                        boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.2)'
                    }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', paddingBottom: '3rem' }}>
                {isLoading ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        Loading glossary data...
                    </div>
                ) : filteredAcronyms.map((item, index) => (
                    <div key={item.id || index} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '1.5rem', fontWeight: '900', letterSpacing: '1px' }}>
                                {item.acronym}
                            </h3>
                            <button 
                                onClick={() => handleVote()} 
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '0.25rem 0.6rem', borderRadius: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 'bold' }}
                                title="Upvote"
                            >
                                ▲ {/* Hardcoding 1 since we didn't migrate votes yet */} 1
                            </button>
                        </div>
                        <h4 style={{ margin: '0.5rem 0 1rem 0', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>
                            {item.definition}
                        </h4>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', lineHeight: '1.5' }}>
                            {item.context}
                        </p>
                    </div>
                ))}
                {filteredAcronyms.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No acronyms found matching "{searchTerm}". Click "+ Submit Acronym" to add it!
                    </div>
                )}
            </div>
        </div>
    );
}
