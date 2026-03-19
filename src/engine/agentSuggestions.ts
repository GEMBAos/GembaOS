import type { KaizenPhase, AIAnalysis } from '../types';

export function generateAgentSuggestion(phase: KaizenPhase): AIAnalysis {
    let analysis = 'Based on the current phase, you should focus on data collection and waste identification. ';
    let nextSteps = [];
    let toolRecommendation = '';

    const title = phase.title.toLowerCase();

    if (title.includes('current state')) {
        analysis += 'Currently analyzing the as-is process. Ensure you capture the actual cycle times, not standard times.';
        nextSteps = ['Conduct Time Studies', 'Draw Spaghetti Diagram', 'Identify 8 Wastes'];
        toolRecommendation = 'Time Observation Form & Spaghetti Diagram';
    } else if (title.includes('root cause') || title.includes('analysis')) {
        analysis += 'You are in the diagnostic phase. Ask "Why" until you hit the systemic failure.';
        nextSteps = ['Group brainstorm', 'Perform 5 Whys', 'Draft Fishbone Diagram'];
        toolRecommendation = '5 Whys / Fishbone Diagram';
    } else if (title.includes('future state') || title.includes('trial')) {
        analysis += 'Time to design the ideal state. Focus on continuous flow and pull systems.';
        nextSteps = ['Draft Future State VSM', 'Cardboard mock-ups', 'Calculate Takt Time vs Cycle Time'];
        toolRecommendation = 'Future State VSM & Line Balancing Board';
    } else if (title.includes('implementation')) {
        analysis += 'Execute changes rapidly. Do not let perfect get in the way of better.';
        nextSteps = ['Move equipment', 'Update Standard Work files', 'Train operators'];
        toolRecommendation = 'Standard Work Document';
    } else if (title.includes('report out') || title.includes('sustaining')) {
        analysis += 'Wrap up the project and ensure controls are in place to prevent regression.';
        nextSteps = ['Compile before/after metrics', 'Complete Report Out', 'Implement Daily Control Board'];
        toolRecommendation = 'Report Out Presentation & Control Plan';
    } else {
        analysis += 'Stay aligned with the project charter.';
        nextSteps = ['Review KPIs', 'Check in with stakeholders'];
        toolRecommendation = 'Project Charter';
    }

    return {
        phaseId: phase.id,
        summary: analysis,
        suggestedNextSteps: nextSteps,
        toolRecommendation: toolRecommendation
    };
}
