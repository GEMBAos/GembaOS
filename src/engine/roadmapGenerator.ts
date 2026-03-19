import type { KaizenPhase, ProjectDuration, ScheduleIntensity } from '../types';

export function generateRoadmap(duration: ProjectDuration, intensity: ScheduleIntensity): KaizenPhase[] {
    const phases: KaizenPhase[] = [];

    if (duration === '1-day') {
        phases.push(
            { id: 'p1', day: 1, title: 'Kickoff & Charter Review', description: 'Review goals, metrics, and problem statement.', suggestedTools: ['Charter Review'], evidence: [], status: 'pending' },
            { id: 'p2', day: 1, title: 'Current State Analysis', description: 'Walk the process, map the current state.', suggestedTools: ['Spaghetti Diagram', 'Process Observation'], evidence: [], status: 'pending' },
            { id: 'p3', day: 1, title: 'Root Cause & Brainstorming', description: 'Identify waste and conceptualize improvements.', suggestedTools: ['5 Whys', 'Fishbone Diagram'], evidence: [], status: 'pending' },
            { id: 'p4', day: 1, title: 'Implementation & Report Out', description: 'Quick win implementation and final presentation.', suggestedTools: ['Action Plan', 'Report Out Template'], evidence: [], status: 'pending' }
        );
    } else if (duration === '3-day') {
        phases.push(
            { id: 'p1', day: 1, title: 'Day 1: Current State & Training', description: 'Lean training, charter review, and current state mapping.', suggestedTools: ['Value Stream Mapping (Current)', 'Time Observation'], evidence: [], status: 'pending' },
            { id: 'p2', day: 2, title: 'Day 2: Future State & Root Cause', description: 'Analyze data, identify root causes, design future state.', suggestedTools: ['5 Whys', 'Value Stream Mapping (Future)', 'Line Balancing'], evidence: [], status: 'pending' },
            { id: 'p3', day: 3, title: 'Day 3: Implementation & Validation', description: 'Execute changes, update standard work, and report out.', suggestedTools: ['Standard Work Chart', 'Before/After Photos'], evidence: [], status: 'pending' }
        );
    } else if (duration === '5-day') {
        phases.push(
            { id: 'p1', day: 1, title: 'Day 1: Preparation & Current State', description: 'Kickoff, training, gemba walk, and current state capability mapping.', suggestedTools: ['Gemba Walk', 'Spaghetti Diagram', 'Time Studies'], evidence: [], status: 'pending' },
            { id: 'p2', day: 2, title: 'Day 2: Root Cause Analysis', description: 'Analyze waste, determine root causes of bottlenecks.', suggestedTools: ['5 Whys', 'Fishbone Diagram', 'Pareto Analysis'], evidence: [], status: 'pending' },
            { id: 'p3', day: 3, title: 'Day 3: Future State Design & Trial', description: 'Brainstorm solutions, design future state layout/process, begin mock-up.', suggestedTools: ['Future State Layout', 'Mock-up', 'Try-storming'], evidence: [], status: 'pending' },
            { id: 'p4', day: 4, title: 'Day 4: Full Implementation', description: 'Physical moves, standard work creation, and operator training.', suggestedTools: ['Standard Work Combination Sheet', '5S Audit'], evidence: [], status: 'pending' },
            { id: 'p5', day: 5, title: 'Day 5: Sustainment & Report Out', description: 'Measure new KPIs, capture final data, management presentation.', suggestedTools: ['KPI Dashboard Update', 'Report Out Builder'], evidence: [], status: 'pending' }
        );
    } else if (duration === '1-month') {
        // 4 phases acting as weeks
        phases.push(
            { id: 'p1', day: 7, title: 'Week 1: Deep Dive Current State', description: 'Extensive data collection, macro VSM.', suggestedTools: ['Macro VSM', 'Process Mining', 'Extensive Time Studies'], evidence: [], status: 'pending' },
            { id: 'p2', day: 14, title: 'Week 2: Analysis & Future State Strategy', description: 'Identify systemic waste, plan major layout or systemic changes.', suggestedTools: ['Root Cause Analysis', 'Capacity Planning'], evidence: [], status: 'pending' },
            { id: 'p3', day: 21, title: 'Week 3: Phased Implementation', description: 'Execute changes during non-production hours or phased zones.', suggestedTools: ['Project Management Gantt', 'Change Management Plan'], evidence: [], status: 'pending' },
            { id: 'p4', day: 28, title: 'Week 4: Optimization & Sustaining', description: 'Monitor daily management, tweak line balancing, final sign-off.', suggestedTools: ['Daily Management System', 'Control Plan'], evidence: [], status: 'pending' }
        );
    }

    // If half-day intensity, we add a note to descriptions noting the compressed schedule
    if (intensity === 'half-day') {
        phases.forEach(p => {
            p.description = '[Half-Day Pace] ' + p.description;
        });
    }

    return phases;
}
