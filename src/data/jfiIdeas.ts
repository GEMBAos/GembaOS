export type JFICategory = 'Ergonomics' | 'Visual Management' | 'Motion Waste' | 'Safety' | 'Workstation Organization' | 'Material Flow' | 'General' | 'Office Lean' | 'Personal Habits' | 'Manufacturing';
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

import { JFI_OFFICE } from './jfiIdeas_Office';
import { JFI_PERSONAL } from './jfiIdeas_Personal';
import { JFI_PERSONAL_2 } from './jfiIdeas_Personal2';
import { JFI_MANUFACTURING_EXTENDED } from './jfiIdeas_Manufacturing';
import { JFI_MASS_EXPANSION } from './jfiIdeas_MassExpansion';
import { JFI_HOME_LEAN } from './jfiIdeas_HomeLean';
import { JFI_LOGISTICS } from './jfiIdeas_Logistics';

const ORIGINAL_JFI_IDEAS: JFIIdea[] = [
    // QUICK WINS
    { id: 'qw-1', category: 'Motion Waste', impactLevel: 'Quick Win', title: 'Point-of-Use Tools', description: 'Move the most commonly used tool (e.g. tape measure, marker) exactly to where your hand normally rests.', impact: 'Saves 2 seconds of reaching per cycle. Compounds to hours per week.', difficulty: 'Easy' },
    { id: 'qw-2', category: 'Workstation Organization', impactLevel: 'Quick Win', title: 'Trash Chute / Drop', description: 'Cut a small hole in the workbench and place a trash bin directly beneath it for immediate scrap disposal.', impact: 'Eliminates turning around or walking to a trash can.', difficulty: 'Easy' },
    { id: 'qw-3', category: 'Visual Management', impactLevel: 'Quick Win', title: 'Tape the Minimum Level', description: 'Take a piece of red tape and mark the "reorder line" directly on the side of a clear parts bin.', impact: 'Instantly visually signals when parts are low without counting.', difficulty: 'Easy' },
    { id: 'qw-4', category: 'Ergonomics', impactLevel: 'Quick Win', title: 'Raise the Screen', description: 'Put a box or stand under a computer monitor so the top third is at eye level.', impact: 'Eliminates 2 seconds of neck-bending strain every time you check data.', difficulty: 'Easy' },
    { id: 'qw-5', category: 'Visual Management', impactLevel: 'Quick Win', title: 'Shadow Boarding (Basic)', description: 'Trace the outline of your 3 main tools on the bench or foam in 5 minutes.', impact: 'Saves 5 seconds of "Where is my tool?" searching per task.', difficulty: 'Easy' },
    { id: 'qw-6', category: 'Safety', impactLevel: 'Quick Win', title: 'Zip-Tie Cords', description: 'Spend 5 minutes zip-tying all loose cords under the workstation to the table leg.', impact: 'Eliminates a tripping hazard and makes sweeping the floor instant.', difficulty: 'Easy' },
    { id: 'qw-7', category: 'Motion Waste', impactLevel: 'Quick Win', title: 'Pre-Open Boxes', description: 'Have the material handler slice the tops off cardboard boxes before placing them on the flow rack.', impact: 'Operators no longer waste 15 seconds wrestling with box flaps.', difficulty: 'Easy' },
    { id: 'qw-8', category: 'General', impactLevel: 'Quick Win', title: 'Standardize the Pen', description: 'Remove the 15 random broken pens from the cup and leave exactly two identical, working pens.', impact: 'Stops the "scribble test" waste entirely.', difficulty: 'Easy' },
    { id: 'qw-9', category: 'Visual Management', impactLevel: 'Quick Win', title: 'Color Code Left/Right', description: 'Put red tape on the left-side parts and blue tape on the right-side parts.', impact: 'Prevents installation errors and rework.', difficulty: 'Easy' },
    { id: 'qw-10', category: 'Workstation Organization', impactLevel: 'Quick Win', title: 'Magnetic Strip for Bits', description: 'Mount a $5 magnetic strip to hold the drill bits right next to the drill holster.', impact: 'Stops operators from fumbling in their pockets or drawers for bits.', difficulty: 'Easy' },
    { id: 'qw-11', category: 'Ergonomics', impactLevel: 'Quick Win', title: 'Anti-Fatigue Mat Placement', description: 'Tape the floor to show exactly where the anti-fatigue mat should be so it isn\'t pushed under the bench by cleaners.', impact: 'Ensures the operator actually gets the ergonomic benefit.', difficulty: 'Easy' },
    { id: 'qw-12', category: 'Material Flow', impactLevel: 'Quick Win', title: 'Angle the Bins', description: 'Put a small wedge under the back of the parts bin so it tilts forward toward the operator.', impact: 'Improves visibility and makes parts slide forward automatically.', difficulty: 'Easy' },
    { id: 'qw-13', category: 'Safety', impactLevel: 'Quick Win', title: 'Corner Guards', description: 'Slice a pool noodle or pipe insulation and tape it over the sharp corner of the metal rack.', impact: 'Prevents hip bruises and snagged clothing.', difficulty: 'Easy' },
    { id: 'qw-14', category: 'Motion Waste', impactLevel: 'Quick Win', title: 'Combine Two Steps', description: 'If you use a cleaner and a rag, tape the bottle to the rag dispenser so you grab both at once.', impact: 'Saves a double-reach every time you clean a surface.', difficulty: 'Easy' },
    { id: 'qw-15', category: 'Visual Management', impactLevel: 'Quick Win', title: 'Gauge Target Ranges', description: 'Use a green paint pen to color the "good" range on the analog pressure gauge.', impact: 'Operators don\'t have to remember the spec, they just look for green.', difficulty: 'Easy' },
    { id: 'qw-16', category: 'Safety', impactLevel: 'Quick Win', title: 'Bright Handles', description: 'Wrap yellow electrical tape around the handle of the sweeping broom.', impact: 'Makes it highly visible so forklifts don\'t run it over.', difficulty: 'Easy' },
    { id: 'qw-17', category: 'Ergonomics', impactLevel: 'Quick Win', title: 'Sponge Grip', description: 'Add foam pipe wrap to the thin metal handle of the hand-cart.', impact: 'Reduces grip fatigue and vibration transferred to the hand.', difficulty: 'Easy' },
    { id: 'qw-18', category: 'Workstation Organization', impactLevel: 'Quick Win', title: 'Label the Drawer', description: 'Write the exact contents of the drawer on a piece of masking tape and stick it to the front.', impact: 'Eliminates the "open every drawer to find the tape" waste.', difficulty: 'Easy' },
    { id: 'qw-19', category: 'Material Flow', impactLevel: 'Quick Win', title: 'First In, First Out (Basic)', description: 'Write today\'s date in large sharpie on the front of the incoming boxes.', impact: 'Prevents old material from expiring at the back of the shelf.', difficulty: 'Easy' },
    { id: 'qw-20', category: 'Motion Waste', impactLevel: 'Quick Win', title: 'Pre-Position Next Unit', description: 'When finishing one unit, immediately place the empty fixture exactly where it needs to be for the next one before turning away.', impact: 'Sets up the next cycle for success.', difficulty: 'Easy' },

    // MODERATE 
    { id: 'mod-1', category: 'Material Flow', impactLevel: 'Moderate', title: 'Two-Bin Kanban', description: 'Set up two small bins for a fast-moving part instead of one large box. Pull from the first; when empty, pull from the second while the first is refilled.', impact: 'Prevents mid-shift stockouts and stops operators from walking away to find parts.', difficulty: 'Medium' },
    { id: 'mod-2', category: 'Ergonomics', impactLevel: 'Moderate', title: 'Gravity Feed Racks', description: 'Install rollers or tilt bins toward the operator at a 15-30 degree angle.', impact: 'Removes the awkward wrist strain of reaching deep into boxes.', difficulty: 'Medium' },
    { id: 'mod-3', category: 'Motion Waste', impactLevel: 'Moderate', title: 'Retractable Tool Balancers', description: 'Hang heavy torque guns or scanners on retractable lanyards directly over the work area.', impact: 'Eliminates the physical fatigue of picking up and putting down heavy items.', difficulty: 'Medium' },
    { id: 'mod-4', category: 'Safety', impactLevel: 'Moderate', title: 'Pedestrian Walkway Painting', description: 'Paint distinct yellow lanes on the floor separating forklift traffic from people.', impact: 'Dramatically reduces collision risk and creates psychological safety.', difficulty: 'Medium' },
    { id: 'mod-5', category: 'Workstation Organization', impactLevel: 'Moderate', title: 'Custom Foam Cutouts', description: 'Use Kaizen foam to cut exact, tight-fitting silhouettes for every tool in the main drawer.', impact: 'Missing tools become painfully obvious before the shift ends.', difficulty: 'Medium' },
    { id: 'mod-6', category: 'Visual Management', impactLevel: 'Moderate', title: 'Floor Markings for Pallets', description: 'Paint corner brackets on the floor indicating exactly where pallets of finished goods should be staged.', impact: 'Stops pallets from wandering into walkways or blocking fire extinguishers.', difficulty: 'Medium' },
    { id: 'mod-7', category: 'Material Flow', impactLevel: 'Moderate', title: 'Kitting Carts', description: 'Instead of picking parts at the line, have the warehouse prep a dedicated cart with exactly the parts needed for 1 hour of build time.', impact: 'Zero material handling done by the assembly operator.', difficulty: 'Medium' },
    { id: 'mod-8', category: 'Ergonomics', impactLevel: 'Moderate', title: 'Scissor Lift Tables', description: 'Replace static pallets with pneumatic lift tables that rise as product is removed.', impact: 'Eliminates deep bending to pick up the bottom layers of parts.', difficulty: 'Medium' },
    { id: 'mod-9', category: 'General', impactLevel: 'Moderate', title: 'Standard Work Instructions', description: 'Take high-res photos of the 5 key steps, print them in color, laminate them, and hang them at eye level.', impact: 'Massively reduces training time and rework from temps or floaters.', difficulty: 'Medium' },
    { id: 'mod-10', category: 'Visual Management', impactLevel: 'Moderate', title: 'Shadow Board for Cleaning', description: 'Build a wall-mounted board exclusively for the broom, dustpan, and squeegee.', impact: 'Ensures the 5S sweep actually happens because the tools are never lost.', difficulty: 'Medium' },
    { id: 'mod-11', category: 'Motion Waste', impactLevel: 'Moderate', title: 'Dedicated Sub-Assembly', description: 'Pull the slow, tedious prep work out of the main line and set up a small desk next to it just for prepping components.', impact: 'Smooths out the cycle time of the main flow.', difficulty: 'Medium' },
    { id: 'mod-12', category: 'Safety', impactLevel: 'Moderate', title: 'Mirror at Blind Intersections', description: 'Mount convex dome mirrors at the corner of the racking aisles.', impact: 'Forklifts can see pedestrians before turning the corner.', difficulty: 'Medium' },
    { id: 'mod-13', category: 'Workstation Organization', impactLevel: 'Moderate', title: 'Point-of-Use Garbage Compaction', description: 'Attach a small, manual ram to the trash can to crush cardboard without leaving the cell.', impact: 'Halves the frequency of trips to the main dumpster.', difficulty: 'Medium' },
    { id: 'mod-14', category: 'Material Flow', impactLevel: 'Moderate', title: 'Supermarket Racks', description: 'Organize raw materials into a flow-through rack where material handlers load the back and operators pull the front.', impact: 'Enforces strict FIFO and keeps handlers out of the operator\'s space.', difficulty: 'Medium' },
    { id: 'mod-15', category: 'Ergonomics', impactLevel: 'Moderate', title: 'Adjustable Height Workbenches', description: 'Replace fixed legs with electric or hand-crank adjustable bases.', impact: 'Allows a 6\'4" and a 5\'2" operator to both work without back pain.', difficulty: 'Medium' },

    // HEAVY HITTER 
    { id: 'hh-1', category: 'Motion Waste', impactLevel: 'Heavy Hitter', title: 'U-Shaped Cell Layout', description: 'Reconfigure a linear assembly line into a U-shape so the start and end processes are adjacent.', impact: 'Allows a single operator to run the whole line with zero walk-back time.', difficulty: 'Hard' },
    { id: 'hh-2', category: 'Material Flow', impactLevel: 'Heavy Hitter', title: 'Automated Milk Run Delivery', description: 'Implement a tugger/cart system (or AGV) that runs a scheduled 30-minute route to restock all cells, eliminating individual forklifts.', impact: 'Transforms plant traffic, cuts WIP by 50%, and keeps operators in their cells.', difficulty: 'Hard' },
    { id: 'hh-3', category: 'Visual Management', impactLevel: 'Heavy Hitter', title: 'Digital Andon & Paced Scoreboards', description: 'Install large screens at every line showing real-time target vs. actual metrics, tied straight to machine PLCs.', impact: 'Creates immediate visibility into pacing and downtime root causes.', difficulty: 'Hard' },
    { id: 'hh-4', category: 'Workstation Organization', impactLevel: 'Heavy Hitter', title: 'Drop-Through Assembly Fixtures', description: 'Custom engineer fixtures where the finished part drops through a hole directly onto a conveyor below.', impact: 'Zero manual handling of finished goods.', difficulty: 'Hard' },
    { id: 'hh-5', category: 'Safety', impactLevel: 'Heavy Hitter', title: 'Light Curtains', description: 'Install infrared light curtains that immediately halt the machine cycle if a hand breaches the plane.', impact: 'Completely engineers out the risk of pinch-point amputations.', difficulty: 'Hard' },
    { id: 'hh-6', category: 'Ergonomics', impactLevel: 'Heavy Hitter', title: 'Zero-Gravity Manipulators', description: 'Install pneumatic jib cranes that make 50kg parts feel totally weightless for the operator to guide into place.', impact: 'Zero heavy lifting injuries.', difficulty: 'Hard' },
    { id: 'hh-7', category: 'General', impactLevel: 'Heavy Hitter', title: 'ERP Kanban Integration', description: 'When a visual kanban bin is emptied and scanned, it automatically triggers a supplier purchase order via API.', impact: 'Eliminates human error in purchasing and prevents massive stockouts.', difficulty: 'Hard' },
    { id: 'hh-8', category: 'Material Flow', impactLevel: 'Heavy Hitter', title: 'Point-of-Use Extrusion', description: 'Move the sub-component manufacturing machine directly next to the assembly line that uses it.', impact: 'Eliminates transport batches and storage entirely.', difficulty: 'Hard' },
    { id: 'hh-9', category: 'Visual Management', impactLevel: 'Heavy Hitter', title: 'Pick-to-Light Systems', description: 'Install LED lights above parts bins that illuminate in the exact sequence the operator needs to pick them for a specific recipe.', impact: 'Completely engineers out wrong-part-picking defects.', difficulty: 'Hard' },
    { id: 'hh-10', category: 'Motion Waste', impactLevel: 'Heavy Hitter', title: 'Rotary Index Tables', description: 'Replace a static bench with a spinning wheel table. Operator loads one side, robot works on the other side simultaneously.', impact: 'Operators never wait for the machine cycle to finish.', difficulty: 'Hard' }
];

// Combine all of the expansion packs into the master exported array
export const JFI_IDEAS: JFIIdea[] = [
    ...ORIGINAL_JFI_IDEAS,
    ...JFI_OFFICE,
    ...JFI_PERSONAL,
    ...JFI_PERSONAL_2,
    ...JFI_MANUFACTURING_EXTENDED,
    ...JFI_MASS_EXPANSION,
    ...JFI_HOME_LEAN,
    ...JFI_LOGISTICS
];

export function getRandomJFI(impactLevel?: JFIImpactLevel | 'Random'): JFIIdea {
    let pool = JFI_IDEAS;
    if (impactLevel && impactLevel !== 'Random') {
        pool = JFI_IDEAS.filter(i => i.impactLevel === impactLevel);
    }
    return pool[Math.floor(Math.random() * pool.length)];
}
