export interface ChatMessage {
    id: string;
    role: 'user' | 'agent';
    content: string;
    timestamp: Date;
}

export function simulateAgentResponse(message: string, phaseName: string): Promise<string> {
    return new Promise((resolve) => {
        // Simple heuristic rules to mock "AI" response
        const lowerMsg = message.toLowerCase();
        let response = '';

        if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            response = `Hello! I'm your GembaOS Assistant. We are currently in the **${phaseName}** phase. How can I assist you with Lean operations today?`;
        } else if (lowerMsg.includes('spaghetti') || lowerMsg.includes('diagram')) {
            response = 'A **Spaghetti Diagram** tracks the movement of operators or materials. \n\n1. Draw a layout of the area.\n2. Trace the exact path taken during one cycle.\n3. Measure the distance. \n\n*Would you like a printable template?*';
        } else if (lowerMsg.includes('time') || lowerMsg.includes('study')) {
            response = 'For a **Time Study**, ensure you break the job into distinct elements. Record the *lowest repeatable time* to identify the baseline. Avoid using average times which hide variation.';
        } else if (lowerMsg.includes('5s')) {
            response = 'The 5S principles are: \n- **Sort**\n- **Set in Order**\n- **Shine**\n- **Standardize**\n- **Sustain** \n\nLet me know if you need to run a 5S audit for this area.';
        } else if (lowerMsg.includes('bottleneck')) {
            response = 'To find the bottleneck, look for the process step with the **longest cycle time** or where inventory typically piles up beforehand. In the current phase, focus on direct observation at the gemba.';
        } else {
            response = `I understand you're asking about "${message}". As an autonomous agent, I recommend focusing your current efforts on the required outcomes for the **${phaseName}** phase to ensure project velocity.`;
        }

        // Simulate network delay
        setTimeout(() => {
            resolve(response);
        }, 800 + Math.random() * 800);
    });
}
