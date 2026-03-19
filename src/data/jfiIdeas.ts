export type JFICategory = 'Ergonomics' | 'Visual Management' | 'Motion Waste' | 'Safety' | 'Workstation Organization' | 'Material Flow' | 'General';
export type JFIImpactLevel = 'Quick Win' | 'Moderate' | 'Heavy Hitter';

export interface JFIIdea {
    id: string;
    category: JFICategory;
    title: string;
    description: string;
    impactLevel: JFIImpactLevel;
    impact: string; // Detail text
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const JFI_IDEAS: JFIIdea[] = [
    // QUICK WINS (2-Second Improvements, Easy, Immediate)
    { id: 'qw-1', category: 'Motion Waste', impactLevel: 'Quick Win', title: 'Point-of-Use Tools', description: 'Move the most commonly used tool (e.g. tape measure, marker) exactly to where your hand normally rests.', impact: 'Saves 2 seconds of reaching per cycle. Compounds to hours per week.', difficulty: 'Easy' },
    { id: 'qw-2', category: 'Workstation Organization', impactLevel: 'Quick Win', title: 'Trash Chute / Drop', description: 'Cut a small hole in the workbench and place a trash bin directly beneath it for immediate scrap disposal.', impact: 'Eliminates turning around or walking to a trash can.', difficulty: 'Easy' },
    { id: 'qw-3', category: 'Visual Management', impactLevel: 'Quick Win', title: 'Tape the Minimum Level', description: 'Take a piece of red tape and mark the "reorder line" directly on the side of a clear parts bin.', impact: 'Instantly visually signals when parts are low without counting.', difficulty: 'Easy' },
    { id: 'qw-4', category: 'Ergonomics', impactLevel: 'Quick Win', title: 'Raise the Screen', description: 'Put a box or stand under a computer monitor so the top third is at eye level.', impact: 'Eliminates 2 seconds of neck-bending strain every time you check data.', difficulty: 'Easy' },
    { id: 'qw-5', category: 'Visual Management', impactLevel: 'Quick Win', title: 'Shadow Boarding (Basic)', description: 'Trace the outline of your 3 main tools on the bench or foam in 5 minutes.', impact: 'Saves 5 seconds of "Where is my tool?" searching per task.', difficulty: 'Easy' },
    
    // MODERATE (Takes a few hours / minor resources, noticeable impact)
    { id: 'mod-1', category: 'Material Flow', impactLevel: 'Moderate', title: 'Two-Bin Kanban', description: 'Set up two small bins for a fast-moving part instead of one large box. Pull from the first; when empty, pull from the second while the first is refilled.', impact: 'Prevents mid-shift stockouts and stops operators from walking away to find parts.', difficulty: 'Medium' },
    { id: 'mod-2', category: 'Ergonomics', impactLevel: 'Moderate', title: 'Gravity Feed Racks', description: 'Install rollers or tilt bins toward the operator at a 15-30 degree angle.', impact: 'Removes the awkward wrist strain of reaching deep into boxes.', difficulty: 'Medium' },
    { id: 'mod-3', category: 'Motion Waste', impactLevel: 'Moderate', title: 'Retractable Tool Balancers', description: 'Hang heavy torque guns or scanners on retractable lanyards directly over the work area.', impact: 'Eliminates the physical fatigue of picking up and putting down heavy items.', difficulty: 'Medium' },
    { id: 'mod-4', category: 'Safety', impactLevel: 'Moderate', title: 'Pedestrian Walkway Painting', description: 'Paint or tape distinct yellow lanes on the floor separating forklift traffic from people.', impact: 'Dramatically reduces collision risk and creates psychological safety.', difficulty: 'Medium' },

    // HEAVY HITTER (Requires planning/capital, massive transformational impact)
    { id: 'hh-1', category: 'Motion Waste', impactLevel: 'Heavy Hitter', title: 'U-Shaped Cell Layout', description: 'Reconfigure a linear assembly line into a U-shape so the start and end processes are adjacent.', impact: 'Allows a single operator to run the whole line with zero walk-back time.', difficulty: 'Hard' },
    { id: 'hh-2', category: 'Material Flow', impactLevel: 'Heavy Hitter', title: 'Automated Milk Run Delivery', description: 'Implement a tugger/cart system (or AGV) that runs a scheduled 30-minute route to restock all cells, eliminating individual forklifts.', impact: 'Transforms plant traffic, cuts WIP by 50%, and keeps operators in their cells.', difficulty: 'Hard' },
    { id: 'hh-3', category: 'Visual Management', impactLevel: 'Heavy Hitter', title: 'Digital Andon & Paced Scoreboards', description: 'Install large screens at every line showing real-time target vs. actual metrics, tied straight to machine PLCs.', impact: 'Creates immediate, undeniable visibility into pacing and downtime root causes.', difficulty: 'Hard' }
];

export function getRandomJFI(impactLevel?: JFIImpactLevel | 'Random'): JFIIdea {
    let pool = JFI_IDEAS;
    if (impactLevel && impactLevel !== 'Random') {
        pool = JFI_IDEAS.filter(i => i.impactLevel === impactLevel);
    }
    return pool[Math.floor(Math.random() * pool.length)];
}
