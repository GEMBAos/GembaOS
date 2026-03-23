export interface ToolInstruction {
    id: string;
    title: string;
    description: string;
    steps: {
        title: string;
        detail: string;
    }[];
    icon: string;
}

export const TOOL_INSTRUCTIONS: Record<string, ToolInstruction> = {
    'MOTION MAPPING V2': {
        id: 'MOTION MAPPING V2',
        title: 'Spaghetti Diagram Builder',
        description: 'Visually track an operator\'s physical movement to identify excess transportation and motion waste on the floor.',
        steps: [
            { title: 'Upload Layout', detail: 'Start by uploading a floor plan or taking a photo of the work area.' },
            { title: 'Log Movement', detail: 'Tap the screen wherever the operator moves to draw their path.' },
            { title: 'Track Time', detail: 'The system automatically records distance and time elapsed.' },
            { title: 'Review', detail: 'Analyze the resulting spaghetti diagram for layout optimization.' }
        ],
        icon: '🚶‍♂️'
    },
    'TIME STUDY': {
        id: 'TIME STUDY',
        title: 'Standard Work Timing',
        description: 'Record exact cycle times for specific process steps to identify bottlenecks and establish standard work.',
        steps: [
            { title: 'Define Steps', detail: 'List the individual elements or tasks that make up the operation.' },
            { title: 'Start Timer', detail: 'Use the built-in stopwatch to record actual observations.' },
            { title: 'Log Laps', detail: 'Tap "Lap" every time a step completes to separate the time.' },
            { title: 'Analyze', detail: 'Review the average cycle times against the Takt Time.' }
        ],
        icon: '⏱️'
    },
    'PROCESS CHECK': {
        id: 'PROCESS CHECK',
        title: 'Standardized Waste Walk',
        description: 'Conduct a structured observation of the floor to identify and categorize friction points or deviations.',
        steps: [
            { title: 'Observe', detail: 'Stand in the designated circle and watch the process silently for 5-10 minutes.' },
            { title: 'Identify Friction', detail: 'Log any issues you see (e.g., waiting, defects, overprocessing).' },
            { title: 'Categorize', detail: 'Classify the issue into one of the 8 wastes of Lean.' },
            { title: 'Action', detail: 'Push severe issues into the Jira / Improvement Card backlog.' }
        ],
        icon: '📋'
    },
    'VALUE SCANNER': {
        id: 'VALUE SCANNER',
        title: 'Value-Add Identification',
        description: 'Help operators determine whether their specific work sequences are Value-Added or Non-Value-Added.',
        steps: [
            { title: 'Input Action', detail: 'Describe exactly what the operator is doing at that exact moment.' },
            { title: 'Assess Output', detail: 'Ask: Does this change the fit, form, or function of the product?' },
            { title: 'Classify', detail: 'Mark it as Value Add, Non-Value Add (Required), or Waste.' },
            { title: 'Reflect', detail: 'Discuss how to eliminate the Waste and minimize the Non-Value Add.' }
        ],
        icon: '☑️'
    },
    'LINE BALANCE BUILDER': {
        id: 'LINE BALANCE BUILDER',
        title: 'Yamazumi Chart Creator',
        description: 'Visualize work distribution across operators to ensure workload is balanced securely under Takt Time.',
        steps: [
            { title: 'Set Target', detail: 'Input the current Customer Demand (Takt Time).' },
            { title: 'Add Operators', detail: 'Create columns for each operator on the line.' },
            { title: 'Add Tasks', detail: 'Stack tasks (with times) on top of operators using the Add Task button.' },
            { title: 'Balance', detail: 'Visually shift tasks around until no operator exceeds the Takt line.' }
        ],
        icon: '📊'
    },
    'IMPROVEMENT CARD': {
        id: 'IMPROVEMENT CARD',
        title: 'JDI / Kaizen Submission',
        description: 'A structured "Just Do It" form to propose, document, and track local countermeasures and fixes.',
        steps: [
            { title: 'State the Problem', detail: 'Clearly define what is happening vs what should be happening.' },
            { title: 'Root Cause', detail: 'Perform a quick 5-Why analysis to find the actual source of the problem.' },
            { title: 'Countermeasure', detail: 'Propose and implement the fix. Upload Before/After photos.' },
            { title: 'Track Impact', detail: 'Estimate the savings in time, money, or quality.' }
        ],
        icon: '💡'
    },
    'GOAL GAP MONITOR': {
        id: 'GOAL GAP MONITOR',
        title: 'Performance Telemetry',
        description: 'Track real-time hourly or daily metrics comparing target goals against actual output.',
        steps: [
            { title: 'Set Baseline', detail: 'Input the target goal for the shift or hour.' },
            { title: 'Log Actuals', detail: 'Record what was actually produced or achieved.' },
            { title: 'Calculate Gap', detail: 'The system automatically shows the variance (red/green).' },
            { title: 'Drive Action', detail: 'If there is a negative gap, assign an immediate countermeasure.' }
        ],
        icon: '🎯'
    },
    'TRAINING VIDEOS': {
        id: 'TRAINING VIDEOS',
        title: 'Standard Work Library',
        description: 'A repository of approved, standardized operational procedures and training materials.',
        steps: [
            { title: 'Browse', detail: 'Search for the specific machine or assembly process.' },
            { title: 'Watch', detail: 'Review the video emphasizing safety, quality, and standard work.' },
            { title: 'Verify', detail: 'Confirm understanding before operating the equipment.' }
        ],
        icon: '🎬'
    }
};
