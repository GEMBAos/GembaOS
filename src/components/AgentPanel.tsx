import { useEffect, useState } from 'react';
import type { KaizenPhase, AIAnalysis } from '../types';
import { generateAgentSuggestion } from '../engine/agentSuggestions';
import ChatInterface from './ChatInterface';

interface AgentPanelProps {
    phase: KaizenPhase;
}

export default function AgentPanel({ phase }: AgentPanelProps) {
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        // Simulate AI loading / thinking
        setIsTyping(true);
        setAnalysis(null);

        const timer = setTimeout(() => {
            setAnalysis(generateAgentSuggestion(phase));
            setIsTyping(false);
        }, 600); // 600ms fake delay

        return () => clearTimeout(timer);
    }, [phase.id]);

    const [activeTab, setActiveTab] = useState<'insights' | 'chat'>('insights');

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🤖</span> Copilot Agent
                </h3>
                <span className="ai-badge">Autonomous Mode</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <button
                    onClick={() => setActiveTab('insights')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: activeTab === 'insights' ? 'var(--accent-primary)' : 'var(--text-muted)',
                        fontWeight: activeTab === 'insights' ? '600' : 'normal',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem'
                    }}
                >
                    Phase Insights
                </button>
                <button
                    onClick={() => setActiveTab('chat')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: activeTab === 'chat' ? 'var(--accent-primary)' : 'var(--text-muted)',
                        fontWeight: activeTab === 'chat' ? '600' : 'normal',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem'
                    }}
                >
                    Ask Copilot
                </button>
            </div>

            {activeTab === 'chat' ? (
                <div style={{ animation: 'fadeIn 0.3s ease-out', height: '100%' }}>
                    <ChatInterface phaseName={phase.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} />
                </div>
            ) : (
                <>
                    {isTyping || !analysis ? (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div className="typing-indicator" style={{ display: 'flex', gap: '2px' }}>
                                <span style={{ animation: 'blink 1.4s infinite both', animationDelay: '0s' }}>.</span>
                                <span style={{ animation: 'blink 1.4s infinite both', animationDelay: '0.2s' }}>.</span>
                                <span style={{ animation: 'blink 1.4s infinite both', animationDelay: '0.4s' }}>.</span>
                            </div>
                            Analyzing phase context...
                        </div>
                    ) : (
                        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                                {analysis.summary}
                            </p>

                            <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                                <h4 style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                                    Suggested Next Steps
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    {analysis.suggestedNextSteps.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.5rem' }}>
                                <h4 style={{ fontSize: '0.8rem', color: 'var(--accent-warning)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                                    Recommended Tool
                                </h4>
                                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                                    {analysis.toolRecommendation}
                                </div>
                                <button className="btn" style={{ marginTop: '0.75rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                                    Generate Template
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <style>{`
        @keyframes blink {
          0% { opacity: .2; }
          20% { opacity: 1; }
          100% { opacity: .2; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
