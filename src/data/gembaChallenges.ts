export interface GembaChallenge {
    id: string;
    icon: string;
    category: string;
    action: string;
    scenario: string;
    insight: string;
    impact: string;
    xp: number;
}

export const GEMBA_CHALLENGES: GembaChallenge[] = [
    // --------------------------------------------------
    // CATEGORY 1: Observation Challenges
    // --------------------------------------------------
    {
        id: "c1", icon: "👀", category: "Observation Challenges",
        action: "Stand in one spot and observe a process for exactly 5 minutes without helping.",
        scenario: "Watch a workflow carefully. Take notes on where hesitation or confusion occurs.",
        insight: "Go see the reality of the floor without immediate bias. That is the first step to improving it.",
        impact: "You will often see root causes that are invisible during normal rushed work.", xp: 20
    },
    {
        id: "c2", icon: "🚶", category: "Observation Challenges",
        action: "Walk your area and find one thing that always slows you down.",
        scenario: "Follow the path of a typical task. Notice where you have to pause, wait, or detour.",
        insight: "Friction is a clue. Notice what annoys you—that's where the waste lives.",
        impact: "Removing even a small daily friction saves hours over a year.", xp: 15
    },
    {
        id: "c3", icon: "🕵️", category: "Observation Challenges",
        action: "Follow a piece of information from start to finish.",
        scenario: "Trace an order, an email, or a piece of paper. Count how many times it gets handed off.",
        insight: "Handoffs are the enemy of speed. Every handoff introduces risk and delay.",
        impact: "Streamlining information flow decreases turnaround time exponentially.", xp: 25
    },
    {
        id: "c4", icon: "🔭", category: "Observation Challenges",
        action: "Look for someone creating a 'workaround' and ask them why.",
        scenario: "Notice someone using a makeshift tool, adjusting a machine weirdly, or ignoring a standard.",
        insight: "Workarounds are the team's cry for a better standard process.",
        impact: "Fixing the root issue eliminates the need for unsafe or slow workarounds.", xp: 20
    },
    {
        id: "c5", icon: "🤔", category: "Observation Challenges",
        action: "Notice the first thing you do each morning that adds zero value to the customer.",
        scenario: "Observe your morning routine. Booting up slow software? Searching for a tool?",
        insight: "Starting the day with friction kills momentum. Fix the morning start.",
        impact: "A smoother start cascades into a more productive day.", xp: 15
    },
    {
        id: "c6", icon: "👁️", category: "Observation Challenges",
        action: "Watch a machine or tool in use. Notice any strange noises or vibrations.",
        scenario: "Don't just look, listen. Is the equipment struggling more than it used to?",
        insight: "Equipment talks if you listen closely. Early detection saves major downtime.",
        impact: "Preventative maintenance is always cheaper than reactive repair.", xp: 20
    },
    {
        id: "c7", icon: "🕒", category: "Observation Challenges",
        action: "Observe a meeting. Notice how many minutes pass before an actual decision is made.",
        scenario: "Track the time spent on status updates vs. problem solving.",
        insight: "Meetings should be for collaboration and decisions, not just reading out loud.",
        impact: "Reclaiming 10 minutes from a daily meeting saves hours of payroll weekly.", xp: 15
    },
    {
        id: "c8", icon: "👟", category: "Observation Challenges",
        action: "Look down at the floor. Notice where the wear patterns are heaviest.",
        scenario: "Excessive wear patterns often indicate excessive travel or motion waste.",
        insight: "The physical environment records our habits. Let the floor show you the flow.",
        impact: "Redesigning the layout based on wear patterns drastically reduces travel time.", xp: 20
    },
    {
        id: "c9", icon: "🔍", category: "Observation Challenges",
        action: "Find a metric on a dashboard that hasn't changed in a month.",
        scenario: "Look at your KPIs. Are we measuring something just to measure it?",
        insight: "If a metric doesn't drive action, it's just visual noise.",
        impact: "Eliminating dead metrics sharpens focus on what actually matters.", xp: 15
    },
    {
        id: "c10", icon: "👥", category: "Observation Challenges",
        action: "Observe a shift change or handover. Notice where knowledge gets dropped.",
        scenario: "Watch the passing of the baton. Is the next person completely ready to go?",
        insight: "A smooth handover is the difference between a running start and a stumble.",
        impact: "Fixing shift changes eliminates the first 30 minutes of daily confusion.", xp: 25
    },
    {
        id: "c11", icon: "🚪", category: "Observation Challenges",
        action: "Notice how many doors or physical barriers you open in an hour.",
        scenario: "Count every time you have to open a door, unlock a cabinet, or move a physical barrier.",
        insight: "Physical barriers create psychological barriers to flow.",
        impact: "Removing unnecessary doors or locks speeds up the entire facility.", xp: 15
    },
    {
        id: "c12", icon: "💡", category: "Observation Challenges",
        action: "Find one dark or poorly lit area where work actually happens.",
        scenario: "Look for shadows. Is someone straining to see a detail or read a label?",
        insight: "You cannot improve what you cannot clearly see.",
        impact: "Proper lighting instantly improves quality and boosts morale.", xp: 15
    },

    // --------------------------------------------------
    // CATEGORY 2: Waste Identification
    // --------------------------------------------------
    {
        id: "c13", icon: "⏳", category: "Waste Identification",
        action: "Notice someone waiting for something. Ask them what they are waiting on.",
        scenario: "Waiting for an approval, a computer to load, or a part to arrive.",
        insight: "Waiting is the most demoralizing form of waste. It disrespects the worker's time.",
        impact: "Eliminating wait time instantly increases capacity without working harder.", xp: 20
    },
    {
        id: "c14", icon: "🗑️", category: "Waste Identification",
        action: "Find a trash can overflowing or misplaced.",
        scenario: "Look at the waste receptacles. Are they too far from the work? Are they the wrong size?",
        insight: "Even handling trash is a process that can be leaned out.",
        impact: "Moving a bin 5 feet closer saves thousands of steps a year.", xp: 10
    },
    {
        id: "c15", icon: "🖨️", category: "Waste Identification",
        action: "Identify a piece of paper printed today that will just be thrown away tomorrow.",
        scenario: "Look for daily reports, redundant shipping labels, or cover sheets.",
        insight: "If the information lives digitally, keeping it physical is usually overprocessing.",
        impact: "Saves money on toner, paper, and the time taken to manage it.", xp: 15
    },
    {
        id: "c16", icon: "🔁", category: "Waste Identification",
        action: "Find a task where data is entered into a system more than once.",
        scenario: "Are you typing data from an email into a spreadsheet, and then into an ERP?",
        insight: "Double entry is a magnet for human error and wasted time.",
        impact: "Automating or eliminating duplicate entry reclaims hours of administrative time.", xp: 25
    },
    {
        id: "c17", icon: "❌", category: "Waste Identification",
        action: "Notice a defect or error that was caught before it reached the customer.",
        scenario: "Look for a scrap bin, a rework pile, or a deleted draft. Ask why the error occurred.",
        insight: "Catching an error is good. Preventing it from ever happening again is Kaizen.",
        impact: "Fixing the root cause reduces the cost of internal failure and rework.", xp: 20
    },
    {
        id: "c18", icon: "📦", category: "Waste Identification",
        action: "Find a supply closet or drawer that is overstocked.",
        scenario: "Look for items we have 50 of, but only use 1 of per month.",
        insight: "Excess inventory ties up cash and hides the real usage rate.",
        impact: "Reducing inventory frees up physical space and capital.", xp: 15
    },
    {
        id: "c19", icon: "🚚", category: "Waste Identification",
        action: "Identify something being transported unnecessarily.",
        scenario: "Are we moving parts from A to B, just to move them to C later?",
        insight: "Transportation adds zero value to the actual product.",
        impact: "Moving processes closer together eliminates forklift and walking traffic.", xp: 20
    },
    {
        id: "c20", icon: "💻", category: "Waste Identification",
        action: "Find a software feature your team pays for but never uses.",
        scenario: "Look at your SaaS stack. Are we paying for premium tiers we don't need?",
        insight: "Digital overproduction is still a waste of resources.",
        impact: "Software cleanups save direct cash flow immediately.", xp: 25
    },
    {
        id: "c21", icon: "🧾", category: "Waste Identification",
        action: "Identify an approval step that is nothing more than a rubber stamp.",
        scenario: "When was the last time this manager actually rejected this form?",
        insight: "If an approval step is automatic, it provides no actual control, only delay.",
        impact: "Empowering the frontline to make the call speeds up the entire flow.", xp: 20
    },
    {
        id: "c22", icon: "🧹", category: "Waste Identification",
        action: "Find a tool that is dirty just because it hasn't been cleaned, affecting its use.",
        scenario: "A dirty sensor, a sticky keyboard, a greasy handle.",
        insight: "Dirt causes friction. Cleaning is literally inspection.",
        impact: "A clean tool works perfectly every time and boosts operator pride.", xp: 15
    },
    {
        id: "c23", icon: "🔂", category: "Waste Identification",
        action: "Notice an email thread that should have been a 2-minute conversation.",
        scenario: "Look for a chain with 10+ replies of people just clarifying things.",
        insight: "Overcommunication via the wrong medium is a massive hidden waste.",
        impact: "Switching to voice/face-to-face resolves ambiguity instantly.", xp: 15
    },
    {
        id: "c24", icon: "📦", category: "Waste Identification",
        action: "Find packaging that is excessively difficult to open or dispose of.",
        scenario: "Are we fighting shrink wrap and zip ties just to get to our raw materials?",
        insight: "Inbound friction slows down the very start of the value stream.",
        impact: "Working with vendors to improve packaging speeds up receiving.", xp: 20
    },

    // --------------------------------------------------
    // CATEGORY 3: Motion Improvement
    // --------------------------------------------------
    {
        id: "c25", icon: "🏃", category: "Motion Improvement",
        action: "Walk your area and count the steps to the nearest printer or shared tool.",
        scenario: "If you walk 20 steps to the printer 5 times a day, that's wasting time.",
        insight: "Walking adds no value to the product. It's just motion.",
        impact: "Moving tools to the point of use saves miles of walking per year.", xp: 15
    },
    {
        id: "c26", icon: "🤸", category: "Motion Improvement",
        action: "Notice whenever you have to stretch, bend, or reach uncomfortably.",
        scenario: "Are supplies on the bottom shelf? Are you reaching across a wide desk?",
        insight: "Ergonomic strain is a warning light for bad process design.",
        impact: "Bringing work into the ergonomic 'strike zone' increases speed and safety.", xp: 20
    },
    {
        id: "c27", icon: "🖱️", category: "Motion Improvement",
        action: "Count the number of mouse clicks to complete a routine digital task.",
        scenario: "If it takes 8 clicks to log a completed order, can a shortcut make it 2?",
        insight: "Digital motion waste tires the brain just like physical motion tires the body.",
        impact: "Keyboard shortcuts and UI improvements compound rapidly over thousands of uses.", xp: 15
    },
    {
        id: "c28", icon: "🔄", category: "Motion Improvement",
        action: "Find a process where you have to put an item down just to pick it up again.",
        scenario: "Are you picking a part out of a bin, putting it on a table, then picking it up to assemble it?",
        insight: "Every time you let go of the value, you lose efficiency.",
        impact: "Creating continuous flow eliminates double-handling.", xp: 25
    },
    {
        id: "c29", icon: "🧰", category: "Motion Improvement",
        action: "Identify a tool that isn't stored exactly in the orientation it needs to be used.",
        scenario: "Do you have to flip a drill around or untangle a scanner cord before using it?",
        insight: "The best storage makes the tool ready for immediate use.",
        impact: "Orientation-ready holsters save complex hand motions.", xp: 20
    },
    {
        id: "c30", icon: "👀", category: "Motion Improvement",
        action: "Notice how often you have to turn your head away from your work to look at instructions/screens.",
        scenario: "Is the monitor to the side while the work is in front of you?",
        insight: "Eye motion is still motion. Neck strain is real.",
        impact: "Aligning information with the physical work reduces cognitive fatigue.", xp: 15
    },
    {
        id: "c31", icon: "🖇️", category: "Motion Improvement",
        action: "Find a drawer you open more than 10 times a day.",
        scenario: "Why is an incredibly common item hidden behind a closed door?",
        insight: "If you use it constantly, it should be exposed and accessible.",
        impact: "Removing the drawer barrier saves thousands of pulls a month.", xp: 15
    },
    {
        id: "c32", icon: "🛒", category: "Motion Improvement",
        action: "Observe someone carrying something heavy by hand. Should it be on wheels?",
        scenario: "Look for people carrying boxes or parts across the floor.",
        insight: "Lifting and carrying is slow and dangerous. Let the wheels do the work.",
        impact: "Adding casters to everything reduces strain and speeds up movement.", xp: 20
    },
    {
        id: "c33", icon: "✂️", category: "Motion Improvement",
        action: "Find a task where you use scissors or a knife constantly. Can you use a dispenser instead?",
        scenario: "Cutting tape, cutting string, opening boxes.",
        insight: "Cutting is an extra motion. Pre-cut or automated dispensers eliminate it.",
        impact: "A $20 dispenser can save 15 minutes of cutting time every single day.", xp: 15
    },
    {
        id: "c34", icon: "🔌", category: "Motion Improvement",
        action: "Follow the cords under your desk or workstation. Are they tangled or snagging?",
        scenario: "Look for cords that catch your feet or prevent a tool from reaching easily.",
        insight: "Cable management isn't just aesthetic; it prevents literal friction and tangles.",
        impact: "Clean cable routing prevents equipment damage and frustration.", xp: 10
    },
    {
        id: "c35", icon: "🚪", category: "Motion Improvement",
        action: "Identify a door that swings the wrong way for the flow of traffic.",
        scenario: "Do you have to stop a cart, pull a door, prop it, and then push the cart?",
        insight: "Building architecture often fights process architecture.",
        impact: "Re-hanging a door or removing it creates smooth, uninterrupted flow.", xp: 25
    },
    {
        id: "c36", icon: "⌨️", category: "Motion Improvement",
        action: "Notice when you use the mouse to navigate a menu that has a keyboard shortcut.",
        scenario: "Copy/paste from a menu instead of Ctrl+C / Ctrl+V.",
        insight: "Keep your hands on the keyboard to maintain digital flow.",
        impact: "Learning 3 new shortcuts saves immense digital motion.", xp: 10
    },

    // --------------------------------------------------
    // CATEGORY 4: Process Clarity
    // --------------------------------------------------
    {
        id: "c37", icon: "🤷", category: "Process Clarity",
        action: "Ask a coworker how to do a task. Does their answer match the written standard?",
        scenario: "Check if the 'tribal knowledge' matches the official SOP.",
        insight: "If the standard isn't being followed, either the training failed or the standard is wrong.",
        impact: "Aligning reality with the documentation ensures consistent quality.", xp: 20
    },
    {
        id: "c38", icon: "📝", category: "Process Clarity",
        action: "Find a document or label that is filled with industry jargon unnecessary for the operator.",
        scenario: "Are we using huge acronyms for simple tasks?",
        insight: "Complexity is not a badge of honor. Clarity is.",
        impact: "Plain language reduces training time and prevents misinterpretation errors.", xp: 15
    },
    {
        id: "c39", icon: "📉", category: "Process Clarity",
        action: "Look at a wall chart or dashboard. Can you understand if we are winning or losing in 3 seconds?",
        scenario: "A good visual management board requires zero explanation.",
        insight: "If you have to read the fine print to know the status, it's not visual management.",
        impact: "Clear visuals drive immediate corrective actions without meetings.", xp: 25
    },
    {
        id: "c40", icon: "🎨", category: "Process Clarity",
        action: "Find a process step that relies entirely on someone's memory.",
        scenario: "Does someone have to 'just remember' to flip a switch at 3 PM?",
        insight: "Human memory is a terrible quality control system.",
        impact: "Creating a checklist or visual reminder prevents inevitable fatigue-based errors.", xp: 20
    },
    {
        id: "c41", icon: "🚥", category: "Process Clarity",
        action: "Identify a status indicator that is ambiguous. (e.g. What does a flashing yellow light mean?)",
        scenario: "Does everyone agree on what the signal means?",
        insight: "Ambiguity breeds hesitation. Signals must be binary and obvious.",
        impact: "Clear signals allow immediate reaction to machine or process states.", xp: 15
    },
    {
        id: "c42", icon: "🗂️", category: "Process Clarity",
        action: "Search for a specific digital file. If it takes more than 10 seconds, the file system is broken.",
        scenario: "Look for the latest version of a team SOP matrix.",
        insight: "Digital 5S is necessary for clarity. A messy drive is a messy mind.",
        impact: "A clear folder structure saves hours of collective searching per week.", xp: 15
    },
    {
        id: "c43", icon: "📋", category: "Process Clarity",
        action: "Find a form (digital or physical) that asks for information nobody actually uses.",
        scenario: "Do we really need the vendor's fax number on this intake sheet?",
        insight: "Collecting useless data is a tax on the frontline worker.",
        impact: "Pruning forms reduces data entry time and makes the process leaner.", xp: 20
    },
    {
        id: "c44", icon: "❓", category: "Process Clarity",
        action: "Identify an error message that tells you that you are wrong, but not how to fix it.",
        scenario: "Software saying 'Invalid input' without specifying format.",
        insight: "An error message should be a helpful constraint, not a dead end.",
        impact: "Updating error states to be instructive prevents frustration and help-desk tickets.", xp: 15
    },
    {
        id: "c45", icon: "⚖️", category: "Process Clarity",
        action: "Find a task done variably and write down the absolutely best known way to do it.",
        scenario: "Document a simple 'standard' for a task you do often so the next person can just follow the recipe.",
        insight: "If you don't have a standard baseline, you can't improve upon it.",
        impact: "Allows for consistent quality and easy cross-training.", xp: 30
    },
    {
        id: "c46", icon: "🏷️", category: "Process Clarity",
        action: "Implement a 2-second visual cue to make a standard clear.",
        scenario: "Add red tape to the floor, or a max/min line to a supply bin.",
        insight: "Visual management ensures anyone can tell normal from abnormal immediately.",
        impact: "Reduces 'where does this go?' questions to zero.", xp: 20
    },
    {
        id: "c47", icon: "🎯", category: "Process Clarity",
        action: "Look at the daily goal board. Is it clear exactly what the goal is for THIS hour?",
        scenario: "Daily goals are too big. Hourly goals drive pacing.",
        insight: "You can't win the day if you don't know if you are winning the hour.",
        impact: "Hourly pacing highlights downtime immediately, rather than at the end of the shift.", xp: 25
    },
    {
        id: "c48", icon: "📚", category: "Process Clarity",
        action: "Find an SOP binder that is covered in dust. Why isn't it being used?",
        scenario: "Are the instructions too dense? Obsolete? Hidden?",
        insight: "A dusty standard isn't standard work; it's just a book.",
        impact: "Moving instructions from binders to point-of-use visual placards revives the standard.", xp: 15
    },

    // --------------------------------------------------
    // CATEGORY 5: Safety Awareness
    // --------------------------------------------------
    {
        id: "c49", icon: "⚠️", category: "Safety Awareness",
        action: "Walk the floor and spot one trip hazard.",
        scenario: "An extension cord across a walkway, a pallet sticking out, or a loose rug.",
        insight: "Safety is the foundational prerequisite for all standard work.",
        impact: "Fixing a trip hazard prevents devastating injuries before they happen.", xp: 25
    },
    {
        id: "c50", icon: "🔥", category: "Safety Awareness",
        action: "Locate the nearest fire extinguisher. Is anything blocking access to it?",
        scenario: "Is there a cart parked in front of the emergency equipment?",
        insight: "Safety equipment must be 100% accessible 100% of the time. No exceptions.",
        impact: "Maintains vital facility compliance and emergency readiness.", xp: 20
    },
    {
        id: "c51", icon: "🕶️", category: "Safety Awareness",
        action: "Notice if someone is working without proper PPE, or if the PPE is uncomfortable.",
        scenario: "Safety glasses scratched? Gloves don't fit? This leads to non-compliance.",
        insight: "If safety gear is painful to wear, the process is broken.",
        impact: "Providing proper fitting PPE ensures workers actually protect themselves.", xp: 25
    },
    {
        id: "c52", icon: "🎧", category: "Safety Awareness",
        action: "Spend 1 minute listening to the ambient noise. Is it loud enough to require ear protection?",
        scenario: "Hearing loss is gradual. Notice the baseline volume.",
        insight: "We often get used to environments that are slowly harming us.",
        impact: "Addressing noise at the source prevents long-term health degradation.", xp: 15
    },
    {
        id: "c53", icon: "💡", category: "Safety Awareness",
        action: "Find a sharp edge or corner that people frequently walk past or bump into.",
        scenario: "The corner of a metal shelf, a protruding bolt.",
        insight: "The environment should be forgiving to the inevitable human misstep.",
        impact: "Adding foam guards or grinding down edges removes micro-injuries.", xp: 20
    },
    {
        id: "c54", icon: "📦", category: "Safety Awareness",
        action: "Look at the top shelves. Are heavy items stored above chest height?",
        scenario: "Gravity is unforgiving. Heavy items up high are a disaster waiting to happen.",
        insight: "Design storage defensively.",
        impact: "Moving heavy items low prevents back strains and falling object risks.", xp: 20
    },
    {
        id: "c55", icon: "💧", category: "Safety Awareness",
        action: "Spot a liquid spill, leak, or condensation patch that hasn't been cleaned.",
        scenario: "Water near a cooler, oil near a machine.",
        insight: "A leak is the machine telling you it's sick. A spill is a slip hazard.",
        impact: "Addressing leaks improves machine life and facility safety.", xp: 15
    },
    {
        id: "c56", icon: "🔌", category: "Safety Awareness",
        action: "Check a wall outlet or power strip. Is it overloaded or daisy-chained?",
        scenario: "Plugging a power strip into another power strip.",
        insight: "Electrical safety is often ignored for convenience.",
        impact: "Fixing electrical loads prevents facility fires.", xp: 25
    },
    {
        id: "c57", icon: "🚪", category: "Safety Awareness",
        action: "Look at a high-traffic pedestrian door. Does it have a clear window to see who is coming?",
        scenario: "Blind corners and solid doors cause collisions.",
        insight: "Visibility equals safety.",
        impact: "Adding mirrors or windows to blind spots prevents facility accidents.", xp: 20
    },
    {
        id: "c58", icon: "🧹", category: "Safety Awareness",
        action: "Find a spot where dust, metal shavings, or debris gather heavily.",
        scenario: "Airborne particulates are a respiratory hazard.",
        insight: "A clean facility is inherently a safer facility.",
        impact: "Improving extraction/ventilation protects worker lung health.", xp: 15
    },
    {
        id: "c59", icon: "🚗", category: "Safety Awareness",
        action: "Observe the forklift/pedestrian crosswalks. Do pedestrians actually stop?",
        scenario: "Is the culture respecting the painted lines?",
        insight: "Lines on the floor don't matter if the culture ignores them.",
        impact: "Reinforcing crosswalk protocols prevents fatal accidents.", xp: 25
    },
    {
        id: "c60", icon: "💊", category: "Safety Awareness",
        action: "Check the first aid station. Is it heavily depleted of bandaids?",
        scenario: "A lack of bandaids means people are getting minor cuts frequently.",
        insight: "First aid usage is a lagging indicator of a hidden hazard.",
        impact: "Investigating why people need bandaids reveals the true root cause.", xp: 20
    },

    // --------------------------------------------------
    // CATEGORY 6: Communication Friction
    // --------------------------------------------------
    {
        id: "c61", icon: "📧", category: "Communication Friction",
        action: "Find an email you receive daily that you never actually read.",
        scenario: "Automated reports, reply-all chains.",
        insight: "Digital clutter creates mental fatigue and hides important messages.",
        impact: "Setting up auto-filters or unsubscribing clears the communication channel.", xp: 15
    },
    {
        id: "c62", icon: "🗣️", category: "Communication Friction",
        action: "Go to the Gemba and ask a frontline worker what bugs them today.",
        scenario: "Ask someone doing the actual work what makes their job harder.",
        insight: "The best solutions always come from the people currently dealing with the friction.",
        impact: "Builds trust and uncovers realities management often misses.", xp: 25
    },
    {
        id: "c63", icon: "🔇", category: "Communication Friction",
        action: "Notice a time when you had to repeat yourself because the environment is too loud.",
        scenario: "Shouting across a conveyor belt.",
        insight: "If you can't communicate easily, mistakes will be made.",
        impact: "Installing radios or moving meeting spots improves clarity.", xp: 15
    },
    {
        id: "c64", icon: "💬", category: "Communication Friction",
        action: "Identify a piece of slang or jargon used by your department that confuses other departments.",
        scenario: "Does shipping understand what engineering means when they say 'rev 2'?",
        insight: "Silos develop their own languages, which breaks cross-functional flow.",
        impact: "Standardizing terminology prevents costly cross-department errors.", xp: 20
    },
    {
        id: "c65", icon: "📅", category: "Communication Friction",
        action: "Look at your calendar. Find a recurring meeting that lacks an agenda.",
        scenario: "Meetings without agendas are just socialization with payroll costs.",
        insight: "A meeting without a goal achieves nothing.",
        impact: "Demanding agendas reclaims hours of wasted calendar time.", xp: 20
    },
    {
        id: "c66", icon: "📢", category: "Communication Friction",
        action: "Notice an overhead announcement or page that you completely tune out.",
        scenario: "If announcements happen constantly, they become white noise.",
        insight: "Over-alarming creates alarm fatigue.",
        impact: "Reducing broadcast volume increases response rates to true emergencies.", xp: 15
    },
    {
        id: "c67", icon: "📝", category: "Communication Friction",
        action: "Find a hand-written note taped to a machine or wall.",
        scenario: "Post-it notes saying 'Don't touch this knob'.",
        insight: "Hand-written notes mean the official system failed to communicate vital info.",
        impact: "Formalizing the rogue note into a real standard secures the knowledge.", xp: 20
    },
    {
        id: "c68", icon: "🤝", category: "Communication Friction",
        action: "Notice a knowledge silo. Teach one person a 5-minute task only you know.",
        scenario: "Verbally guide a teammate through a task so you aren't the only point of failure.",
        insight: "Knowledge silos create brittle processes that break when someone is sick.",
        impact: "Increases team flexibility and resilience.", xp: 30
    },
    {
        id: "c69", icon: "🤷", category: "Communication Friction",
        action: "Identify a request you submitted where you have zero visibility on its status.",
        scenario: "Sending an IT ticket into the 'black hole'.",
        insight: "Lack of status visibility generates anxiety and status-check emails.",
        impact: "Adding visual tracking (like a Kanban board) kills status-update emails.", xp: 20
    },
    {
        id: "c70", icon: "🌍", category: "Communication Friction",
        action: "Notice a sign or document that isn't translated for a non-native speaking employee.",
        scenario: "Critical safety warnings perfectly written in a language the operator cannot read.",
        insight: "Communication only matters if the receiver understands it.",
        impact: "Bilingual visuals ensure safety and inclusion.", xp: 25
    },
    {
        id: "c71", icon: "📞", category: "Communication Friction",
        action: "Count how many different apps/channels you use to message your team.",
        scenario: "Teams, Slack, SMS, Email, WhatsApp.",
        insight: "Fragmented communication channels lead to lost information.",
        impact: "Consolidating to fewer channels ensures nobody misses the memo.", xp: 15
    },
    {
        id: "c72", icon: "❓", category: "Communication Friction",
        action: "Notice when a leader answers a question with 'I don't know, let me check.'",
        scenario: "Is the data hard to pull? Why don't they have the pulse of the area?",
        insight: "Information should flow up automatically, not require an expedition.",
        impact: "Improving dashboard visibility allows leaders to lead instead of hunt for data.", xp: 20
    },

    // --------------------------------------------------
    // CATEGORY 7: Material Flow
    // --------------------------------------------------
    {
        id: "c73", icon: "📦", category: "Material Flow",
        action: "Notice a pile of inventory that hasn't moved in a week.",
        scenario: "Look for materials sitting idle. Ask why we are batching so much instead of flowing it.",
        insight: "Inventory hides problems and ties up capital.",
        impact: "Reducing inventory frees space and highlights workflow bottlenecks.", xp: 25
    },
    {
        id: "c74", icon: "🛑", category: "Material Flow",
        action: "Find a bottleneck. Where is material piling up in front of a workstation?",
        scenario: "The station before it is fast, but this station is slow.",
        insight: "The bottleneck dictates the speed of the entire factory.",
        impact: "Elevating the bottleneck creates massive throughput gains.", xp: 30
    },
    {
        id: "c75", icon: "🛒", category: "Material Flow",
        action: "Identify a cart or pallet holding only 10% of its total capacity.",
        scenario: "Moving a massive pallet with a single small box on it.",
        insight: "Mismatched container sizes waste space and transportation effort.",
        impact: "Right-sizing material handling equipment saves floor space.", xp: 15
    },
    {
        id: "c76", icon: "🕸️", category: "Material Flow",
        action: "Spot a raw material or part covered in dust.",
        scenario: "Dust means it has been sitting still for a long time.",
        insight: "Overpurchasing creates dead stock.",
        impact: "Liquidating or returning dead stock frees up valuable square footage.", xp: 20
    },
    {
        id: "c77", icon: "🛣️", category: "Material Flow",
        action: "Trace the path of a part. Does it cross its own path (spaghetti flow)?",
        scenario: "Does the part travel to the back of the building, then back to the front?",
        insight: "Spaghetti flow is the antithesis of lean design.",
        impact: "Rearranging workstations into a cell prevents miles of product travel.", xp: 25
    },
    {
        id: "c78", icon: "🚧", category: "Material Flow",
        action: "Find an aisle that is partially blocked by material.",
        scenario: "Pallets encroaching on the walkway.",
        insight: "Blocked aisles slow down forklifts and create safety hazards.",
        impact: "Enforcing floor markings maintains clear arteries for flow.", xp: 15
    },
    {
        id: "c79", icon: "⏳", category: "Material Flow",
        action: "Notice an operator leaving their station to go hunt for parts.",
        scenario: "The material handler didn't restock in time.",
        insight: "Operators should add value, not act as fetchers.",
        impact: "Implementing a water-spider or kanban system keeps operators working.", xp: 25
    },
    {
        id: "c80", icon: "📉", category: "Material Flow",
        action: "Look for a work-in-progress (WIP) area that has no maximum limit defined.",
        scenario: "People just keep piling unfinished goods on a table until it falls off.",
        insight: "Without WIP limits, overproduction runs rampant.",
        impact: "Implementing a WIP cap drastically reduces lead times.", xp: 20
    },
    {
        id: "c81", icon: "🗑️", category: "Material Flow",
        action: "Find good materials mixed in with scrap or recycling.",
        scenario: "Look in the scrap bin. Are there usable parts there?",
        insight: "Poor segregation wastes money directly.",
        impact: "Clear visuals on bins prevent throwing cash in the trash.", xp: 15
    },
    {
        id: "c82", icon: "🏷️", category: "Material Flow",
        action: "Notice a container of parts that has no label or an old, wrong label.",
        scenario: "A box of bolts with a label that says 'Wiring harness'.",
        insight: "Mislabeled materials guarantee incorrect assembly downstream.",
        impact: "Strict labeling rules ensure quality at the source.", xp: 20
    },
    {
        id: "c83", icon: "📦", category: "Material Flow",
        action: "Observe an inbound delivery. How long does it sit on the dock before being put away?",
        scenario: "Is the dock congested?",
        insight: "The dock is the heart valve of the plant. If it's clogged, nothing flows.",
        impact: "Speeding up receiving keeps the production lines fed.", xp: 20
    },
    {
        id: "c84", icon: "🔄", category: "Material Flow",
        action: "Look for the oldest inventory in an area. Is it FIFO (First in, First out)?",
        scenario: "Are people pulling from the front of the shelf, leaving the back to expire?",
        insight: "Without gravity racks or FIFO rules, older material degrades.",
        impact: "Implement flow racks to ensure inventory remains fresh.", xp: 25
    },

    // --------------------------------------------------
    // CATEGORY 8: Workplace Organization
    // --------------------------------------------------
    {
        id: "c85", icon: "🧹", category: "Workplace Organization",
        action: "Look for something that causes confusion and label it.",
        scenario: "Pick a drawer, a digital folder, or a tool rack. Make it obvious what belongs there.",
        insight: "A clearly organized workspace drastically reduces the cognitive load on the team.",
        impact: "Eliminates the waste of searching, saving minutes perfectly every day.", xp: 20
    },
    {
        id: "c86", icon: "❓", category: "Workplace Organization",
        action: "Find a tool or item that hasn't been used in over a month.",
        scenario: "A specialty wrench, an old printer, a broken chair.",
        insight: "If it's not needed for current production, it is just clutter.",
        impact: "Sorting out the unnecessary reclaims valuable square footage.", xp: 15
    },
    {
        id: "c87", icon: "📏", category: "Workplace Organization",
        action: "Check a shadow board. Is something missing?",
        scenario: "Look at the tool pegboard. Are there empty outlines?",
        insight: "The genius of a shadow board is that it makes missing tools instantly obvious.",
        impact: "Reduces time lost hunting for borrowed tools.", xp: 15
    },
    {
        id: "c88", icon: "🗑️", category: "Workplace Organization",
        action: "Look inside a desk drawer or tool chest. Does it look like a junk drawer?",
        scenario: "Screws mixed with pens mixed with candy wrappers.",
        insight: "Hidden messes still drain mental energy when you have to dig through them.",
        impact: "Adding drawer organizers creates calm and speed.", xp: 10
    },
    {
        id: "c89", icon: "🎨", category: "Workplace Organization",
        action: "Find an area where boundaries are unclear. Add tape.",
        scenario: "Where exactly should the pallet jack be parked?",
        insight: "A place for everything, and everything in its place.",
        impact: "Tape removes ambiguity and enforces discipline.", xp: 20
    },
    {
        id: "c90", icon: "🧴", category: "Workplace Organization",
        action: "Check the cleaning supplies. Are they organized and available?",
        scenario: "You can't sustain a clean environment if the brooms are hidden.",
        insight: "Make doing the right thing the easiest thing to do.",
        impact: "Accessible cleaning stations encourage operators to shine their area.", xp: 15
    },
    {
        id: "c91", icon: "🖇️", category: "Workplace Organization",
        action: "Find papers tacked to a corkboard. Are any of them older than a year?",
        scenario: "The bulletin board of forgotten memos.",
        insight: "Visual clutter makes people ignore the important new information.",
        impact: "Clearing dead visuals brings focus to current goals.", xp: 10
    },
    {
        id: "c92", icon: "📱", category: "Workplace Organization",
        action: "Digital 5S: How many icons are on your computer desktop?",
        scenario: "Is your background mostly icons?",
        insight: "Digital searching is a massive waste of modern time.",
        impact: "A clean desktop speeds up computing and reduces stress.", xp: 10
    },
    {
        id: "c93", icon: "🗄️", category: "Workplace Organization",
        action: "Look on top of cabinets or machines. Are things being stored on the 'roof'?",
        scenario: "Storing empty boxes on top of lockers.",
        insight: "Flat surfaces attract clutter like gravity.",
        impact: "Installing slanted tops on cabinets prevents the accumulation of junk.", xp: 15
    },
    {
        id: "c94", icon: "✂️", category: "Workplace Organization",
        action: "Spot personal items mixed with work items in a communal area.",
        scenario: "Someone's coffee mug in the QA measuring equipment zone.",
        insight: "Communal zones must be strictly standardized.",
        impact: "Creating dedicated personal shelves keeps the work zones sterile.", xp: 10
    },
    {
        id: "c95", icon: "🧰", category: "Workplace Organization",
        action: "Look at the maintenance toolbox. Is it mobile or stationary?",
        scenario: "Does the tech have to walk back and forth for tools?",
        insight: "Bringing the workshop to the defect is faster than walking to the workshop.",
        impact: "Mobile shadow boards speed up repair times.", xp: 15
    },
    {
        id: "c96", icon: "🌟", category: "Workplace Organization",
        action: "Identify the cleanest, most organized workstation in the plant.",
        scenario: "Find the local champion of 5S.",
        insight: "Success leaves clues. Study the best.",
        impact: "Praising the standard setter encourages others to elevate their game.", xp: 20
    },

    // --------------------------------------------------
    // CATEGORY 9: Quality Improvement
    // --------------------------------------------------
    {
        id: "c97", icon: "🚧", category: "Quality Improvement",
        action: "Find a common mistake and physically make it impossible to do wrong (Poka-Yoke).",
        scenario: "Don't just retrain; physically or procedurally prevent the error.",
        insight: "Don't blame people; fix the system that allows the error to occur.",
        impact: "Eliminates rework completely, guaranteeing quality at the source.", xp: 35
    },
    {
        id: "c98", icon: "🔍", category: "Quality Improvement",
        action: "Watch an inspection step. Are they passing defects downstream?",
        scenario: "Is the QA standard ambiguous? 'Make sure it looks good.'",
        insight: "If the standard is subjective, your quality will be variable.",
        impact: "Creating binary boundary samples (Accept/Reject) locks in quality.", xp: 25
    },
    {
        id: "c99", icon: "📸", category: "Quality Improvement",
        action: "Notice a defect. Did it originate at this station, or come from upstream?",
        scenario: "Are we doing value-add work on parts that are already broken?",
        insight: "Never pass a defect forward. Stop the line.",
        impact: "Stopping defects early prevents wasting time on dead parts.", xp: 30
    },
    {
        id: "c100", icon: "📏", category: "Quality Improvement",
        action: "Check a measuring tool (caliper, scale). Is it calibrated?",
        scenario: "When was the last sticker date?",
        insight: "If you measure with a broken ruler, every cut is wrong.",
        impact: "Strict calibration schedules ensure the bedrock of quality.", xp: 15
    },
    {
        id: "c101", icon: "🔁", category: "Quality Improvement",
        action: "Identify a report, signature, or review step that nobody actually uses.",
        scenario: "Are you double-checking something that doesn't need it?",
        insight: "Doing something well that shouldn't be done at all is overprocessing waste.",
        impact: "Reclaims time for actual value-adding tasks.", xp: 20
    },
    {
        id: "c102", icon: "🛠️", category: "Quality Improvement",
        action: "Look for temporary fixes involving tape, zip-ties, or cardboard.",
        scenario: "A piece of cardboard used as a shim.",
        insight: "Temporary fixes have a habit of becoming permanent liabilities.",
        impact: "Engineering a real solution restores process stability.", xp: 25
    },
    {
        id: "c103", icon: "🔬", category: "Quality Improvement",
        action: "Ask an operator how they know they did a 'good job'.",
        scenario: "Do they have direct, immediate feedback, or do they wait for a report?",
        insight: "Feedback should be immediate and visual.",
        impact: "Immediate feedback allows instant micro-corrections.", xp: 20
    },
    {
        id: "c104", icon: "📦", category: "Quality Improvement",
        action: "Observe how finished products are packed. Is the packaging protecting the value?",
        scenario: "Are corners getting crushed in the box?",
        insight: "The last touch is often where quality is lost.",
        impact: "Upgrading packaging prevents costly returns and unhappy customers.", xp: 15
    },
    {
        id: "c105", icon: "📝", category: "Quality Improvement",
        action: "Find a spot where illegible handwriting causes issues.",
        scenario: "Can't read the lot number on the travel ticket?",
        insight: "Bad handwriting is a systemic defect.",
        impact: "Switching to digital tablets or pre-printed barcodes eliminates the entire category of error.", xp: 20
    },
    {
        id: "c106", icon: "🌡️", category: "Quality Improvement",
        action: "Is the environment (temp, humidity) affecting the process or material?",
        scenario: "Does the tape not stick because it's too cold?",
        insight: "The environment is an invisible machine input.",
        impact: "Controlling ambient conditions stabilizes sensitive processes.", xp: 15
    },
    {
        id: "c107", icon: "📋", category: "Quality Improvement",
        action: "Find an outdated version of a form being used on the floor.",
        scenario: "Someone photocopied a 5-year old form.",
        insight: "Version control of documents is critical to standard work.",
        impact: "Using a central digital system ensures everyone uses the latest standard.", xp: 15
    },
    {
        id: "c108", icon: "🚨", category: "Quality Improvement",
        action: "If a defect happens right now, how does the operator alert the team?",
        scenario: "Do they shout? Andon cord? Light?",
        insight: "Raising the alarm should be frictionless.",
        impact: "A clear Andon system limits the spread of bad quality immediately.", xp: 25
    },

    // --------------------------------------------------
    // CATEGORY 10: Employee Experience
    // --------------------------------------------------
    {
        id: "c109", icon: "🤝", category: "Employee Experience",
        action: "Find someone struggling with a task and ask them how you can help fix the process.",
        scenario: "Instead of telling them how to do it faster, ask them what tools would make it easier.",
        insight: "Lean thrives on respect for the people doing the actual work.",
        impact: "Empowers the frontline and builds a culture of continuous improvement.", xp: 25
    },
    {
        id: "c110", icon: "💡", category: "Employee Experience",
        action: "Find a 2-second improvement and fix it right now.",
        scenario: "Find something that bugs you and fix it immediately. Don't wait for permission.",
        insight: "Small daily fixes build an unstoppable culture of Kaizen.",
        impact: "A 2-second fix boosts morale immediately and saves hours incrementally.", xp: 30
    },
    {
        id: "c111", icon: "☕", category: "Employee Experience",
        action: "Check the break room. Is it an environment that actually allows people to recharge?",
        scenario: "Is it dirty? Broken microwave?",
        insight: "Respect for people extends beyond the assembly line.",
        impact: "A respected team respects the product.", xp: 15
    },
    {
        id: "c112", icon: "🌡️", category: "Employee Experience",
        action: "Notice the temperature or airflow at a workstation.",
        scenario: "Are people wearing coats inside, or sweating near a machine?",
        insight: "Physical discomfort drains mental focus.",
        impact: "Adding fans or adjusting vents keeps workers focused and safe.", xp: 15
    },
    {
        id: "c113", icon: "🎯", category: "Employee Experience",
        action: "Ask a teammate what their biggest frustration is today.",
        scenario: "Just listen. Don't immediately solve it, just understand the friction.",
        insight: "Sometimes the most valuable action is acknowledging the problem.",
        impact: "Builds psychological safety and uncovers hidden systemic issues.", xp: 20
    },
    {
        id: "c114", icon: "🏆", category: "Employee Experience",
        action: "Recognize someone out loud for following a standard or making a fix.",
        scenario: "Say 'Good catch' when someone stops the line for a defect.",
        insight: "What gets praised gets repeated.",
        impact: "Positive reinforcement cements a lean culture far faster than criticism.", xp: 25
    },
    {
        id: "c115", icon: "🧰", category: "Employee Experience",
        action: "Identify a tool that people hate using because it's heavy, old, or awkward.",
        scenario: "The scanner that constantly drops connection.",
        insight: "Bad tools are an insult to good workers.",
        impact: "Spending $100 on a better tool pays off in morale and speed instantly.", xp: 20
    },
    {
        id: "c116", icon: "🪑", category: "Employee Experience",
        action: "Look at the chairs or anti-fatigue mats. Are they worn out?",
        scenario: "A mat that is flat provides no relief.",
        insight: "Ergonomics is an investment in human capital.",
        impact: "Replacing worn mats prevents back pain and absenteeism.", xp: 15
    },
    {
        id: "c117", icon: "🕒", category: "Employee Experience",
        action: "Notice how often people have to work through lunch or stay late to hit goals.",
        scenario: "If overtime is constant, the process is fundamentally broken.",
        insight: "Heroics are not a sustainable business model.",
        impact: "Level-loading the work schedule prevents burnout.", xp: 25
    },
    {
        id: "c118", icon: "📋", category: "Employee Experience",
        action: "Look at an onboarding document or training manual. Is it welcoming?",
        scenario: "Does it read like a legal threat or a helpful guide?",
        insight: "The first week sets the cultural tone for an employee's entire tenure.",
        impact: "Humanizing training accelerates integration into the team.", xp: 15
    },
    {
        id: "c119", icon: "🙋", category: "Employee Experience",
        action: "Observe a daily standup meeting. Does the leader talk 90% of the time?",
        scenario: "Is it a dictation or a dialogue?",
        insight: "Leaders should ask questions, not just give orders.",
        impact: "Flipping the ratio engages the team's problem-solving brains.", xp: 20
    },
    {
        id: "c120", icon: "🛡️", category: "Employee Experience",
        action: "Notice a time when someone made a mistake. How did the team react?",
        scenario: "Did they blame the person, or investigate the process?",
        insight: "A culture of blame creates a culture of hiding mistakes.",
        impact: "Focusing on the process builds a fearless, high-performance team.", xp: 30
    }
];
