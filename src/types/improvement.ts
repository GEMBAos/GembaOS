export type ImprovementEntityType = 'Metric' | 'Observation' | 'Countermeasure' | 'Defect' | 'MotionPath' | 'CycleTime' | 'Idea' | 'ProcessArea' | 'ProcessCheck' | 'ImprovementCard' | 'MotionSessionV2' | 'MotionParticipantPathV2';

export interface BaseEntity {
  id: string;
  type: ImprovementEntityType;
  createdAt: string;
  updatedAt: string;
  areaId?: string; 
  owner?: string;
}

export interface Metric extends BaseEntity {
  type: 'Metric';
  metricName: string;
  target: number;
  actual: number;
  gap: number;
  date: string;
}

export interface Countermeasure extends BaseEntity {
  type: 'Countermeasure';
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  impactEstimate?: string;
  relatedEntityId?: string; // Links CM to a Metric, Defect, or Observation
}

export interface Observation extends BaseEntity {
  type: 'Observation';
  notes: string;
  valueClassification?: 'Value Add' | 'Non-Value Add' | 'Waste';
  severity?: 'Low' | 'Medium' | 'High';
}

export interface MotionPath extends BaseEntity {
  type: 'MotionPath';
  sessionName: string;
  operatorId: string;
  notes?: string;
  pathCoordinates: {
    id: string;
    label: string;
    x: number; // Stored as 0-100 percentage for responsive scaling
    y: number; // Stored as 0-100 percentage for responsive scaling
    timestamp: number;
  }[];
  totalDistance: number; // relative calculated distance
  totalStops: number;
  longestSegment: number;
}

export interface CycleTime extends BaseEntity {
  type: 'CycleTime';
  stationName: string;
  operatorsCount: number;
  workContent: number[];
  recordedTimes: number[];
}

export interface Defect extends BaseEntity {
  type: 'Defect';
  description: string;
  category: string;
  severity: 'Minor' | 'Major' | 'Critical';
  status: 'Open' | 'Resolved';
}

export interface ProcessArea extends BaseEntity {
  type: 'ProcessArea';
  name: string;
  description?: string;
}

export interface Idea extends BaseEntity {
  type: 'Idea';
  title: string;
  description: string;
  status: 'Pending Review' | 'Approved' | 'Implemented' | 'Skipped';
}

export interface ProcessCheck extends BaseEntity {
  type: 'ProcessCheck';
  processName: string;
  operatorId: string;
  findings: string;
  wasteTypes: string[];
  targetCycleTime: number;
  actualCycleTime: number;
  motionSessionId?: string;
}

export interface ImprovementCard extends BaseEntity {
  type: 'ImprovementCard';
  title: string;
  owner: string;
  status: 'Planned' | 'In Test' | 'Implemented' | 'Needs Follow-Up';
  linkedProcessCheckId?: string;
  countermeasure: string;
  beforeCondition: string;
  beforeImageUrl?: string;
  afterCondition: string;
  afterImageUrl?: string;
  expectedFieldExits: number;
  measuredFieldExits?: number;
  expectedDistance: number;
  measuredDistance?: number;
  nextAction: 'Standardize Change' | 'Test Again' | 'Escalate' | 'Reopen Diagnosis' | '';
}
