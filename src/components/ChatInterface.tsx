import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { simulateAgentResponse, type ChatMessage } from '../engine/chatSimulation';

interface ChatInterfaceProps {
    phaseName: string;
}

export default function ChatInterface({ phaseName }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Initial greeting
    useEffect(() => {
        setMessages([
            {
                id: '1',
                role: 'agent',
                content: `Let's discuss the **${phaseName}** phase. What do you need help with?`,
                timestamp: new Date()
            }
        ]);
    }, [phaseName]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const newUserMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsThinking(true);

        const responseText = await simulateAgentResponse(newUserMsg.content, phaseName);

        const newAgentMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            content: responseText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newAgentMsg]);
        setIsThinking(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '300px', maxHeight: '400px', borderRadius: '0.5rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            {/* Context Header */}
            <div style={{ padding: '0.75rem', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Ask Copilot about tools, templates, or advice.
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%'
                    }}>
                        <div style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                            marginBottom: '0.25rem',
                            textAlign: msg.role === 'user' ? 'right' : 'left'
                        }}>
                            {msg.role === 'user' ? 'You' : 'Copilot'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div style={{
                            background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-dark)',
                            color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            borderBottomRightRadius: msg.role === 'user' ? '0' : '0.5rem',
                            borderBottomLeftRadius: msg.role === 'agent' ? '0' : '0.5rem',
                            fontSize: '0.9rem',
                            lineHeight: 1.5
                        }}>
                            {/* Use ReactMarkdown for Agent responses, simple string for User */}
                            {msg.role === 'agent' ? (
                                <ReactMarkdown components={{
                                    p: ({ node, ...props }) => <p style={{ margin: 0, padding: 0 }} {...props} />,
                                    ul: ({ node, ...props }) => <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }} {...props} />
                                }}>
                                    {msg.content}
                                </ReactMarkdown>
                            ) : (
                                <span>{msg.content}</span>
                            )}
                        </div>
                    </div>
                ))}

                {isThinking && (
                    <div style={{ alignSelf: 'flex-start' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Copilot is typing...</div>
                        <div style={{ background: 'var(--bg-dark)', padding: '0.75rem 1rem', borderRadius: '0.5rem', borderBottomLeftRadius: 0, display: 'flex', gap: '4px' }}>
                            <span style={{ animation: 'blink 1.4s infinite both', animationDelay: '0s' }}>.</span>
                            <span style={{ animation: 'blink 1.4s infinite both', animationDelay: '0.2s' }}>.</span>
                            <span style={{ animation: 'blink 1.4s infinite both', animationDelay: '0.4s' }}>.</span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', background: 'var(--bg-dark)' }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask a Lean question..."
                    style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                />
                <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '0.25rem', padding: '0 1rem', cursor: 'pointer', opacity: inputValue.trim() ? 1 : 0.5 }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
