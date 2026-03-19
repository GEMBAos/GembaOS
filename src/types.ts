export type ProjectDuration = '1-day' | '3-day' | '5-day' | '1-month';
export type ScheduleIntensity = 'half-day' | 'full-day';

export interface KPI {
    id: string;
    name: string;
    baseline: string;
    target: string;
}

export interface Stakeholder {
    id: string;
    name: string;
    role: string;
}

export interface KaizenProject {
    id: string;
    name: string;
    problemStatement: string;
    targetOutcome?: string; // Optional for backward compatibility with new goalStatement
    goalStatement?: string;
    duration?: ProjectDuration;
    intensity?: ScheduleIntensity;
    kpis?: KPI[];
    stakeholders?: Stakeholder[];
    team?: string[];
    phases: KaizenPhase[];
    status: 'Planned' | 'Active' | 'Closed';
    createdAt: number | string; // Supporting both legacy strings and new timestamps
    updatedAt?: number;
    
    // Sub-tool data persistence
    vsmData?: VSMStep[];
    fiveWhysData?: string[];
    timeStudyData?: TimeStudyData;
    a3Data?: A3ReportData;
}

export type ActionItemStatus = 'To Do' | 'Doing' | 'Done';
export type ActionItemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ActionItem {
    id: string;
    projectId?: string;
    title: string;
    description?: string;
    owner: string;
    status: ActionItemStatus;
    difficulty: ActionItemDifficulty;
    dueDate?: string;
    linkedJfiId?: string;
    createdAt: number;
}

// A specific slice of time inside the Roadmap
export interface KaizenPhase {
    id: string;
    day: number;
    title: string;
    description: string;
    suggestedTools: string[];
    evidence: PhaseEvidence[];
    status: 'pending' | 'in-progress' | 'completed';
}

export interface PhaseEvidence {
    id: string;
    type: 'photo' | 'video' | 'data' | 'note' | 'spatial';
    url?: string;
    content: string; // The data note or the uploaded path
    timestamp: string;
}

export interface AIAnalysis {
    phaseId: string;
    summary: string;
    suggestedNextSteps: string[];
    toolRecommendation: string;
}

// ------ KPI Tracker Tool Types ------

export type KPIUnit = 'eaches' | 'percentage' | 'dollars';
export type KPIType = 'output' | 'labor' | 'overtime' | 'quality' | 'other';
export type KPIFrequency = 'daily' | 'weekly';

export interface TrackerKPI {
    id: string;
    name: string;
    type: KPIType;
    unit: KPIUnit;
    frequency: KPIFrequency;
    dailyValues: {
        mon: number;
        tue: number;
        wed: number;
        thu: number;
        fri: number;
        sat: number;
        sun: number;
    };
    weeklyTotal: number;
}

// ------ Kamishibai & TPM types ------
export type AuditFrequency = 'daily' | 'weekly' | 'monthly';

export interface KamishibaiCard {
    id: string;
    title: string;
    description: string;
    frequency: AuditFrequency;
    status: 'red' | 'green';
    lastAudited?: string;
}

// ------ Sub-Tool Data Types ------
export interface VSMStep {
    id: string;
    name: string;
    cycleTime: number; // in seconds
    valueAddTime: number; // in seconds
    changeoverTime: number; // in minutes
    uptime: number; // percentage
    defectRate: number; // percentage
    wip: number; // units of WIP after this step
}

export interface TimeStudyLap {
    id: string;
    description: string;
    timeMs: number;
}

export interface TimeStudyData {
    availableHours: number;
    demand: number;
    laps: TimeStudyLap[];
}

export interface A3ReportData {
    background: string;
    currentCondition: string;
    rootCauseAnalysis: string;
    targetCondition: string;
    implementationPlan: string;
    followUp: string;
}
