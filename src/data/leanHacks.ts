export interface LeanHack {
  title: string;
  fact: string;
}

export const LEAN_HACKS: LeanHack[] = [
  {
    title: "The 3-Second Rule",
    fact: "If it takes more than 3 seconds to find a tool, your 5S needs work. Use shadow boards to make missing items instantly obvious."
  },
  {
    title: "Point of Use Storage",
    fact: "Store materials exactly where they are consumed, not in a central warehouse. Every step taken to fetch parts is wasted motion."
  },
  {
    title: "Visual Standards",
    fact: "A standard is only useful if someone can tell it's being followed at a glance. Replace text instructions with photos of the 'good' state."
  },
  {
    title: "Two-Bin Kanban",
    fact: "Never run out of fasteners. Keep two bins. When the front bin is empty, move it back to trigger a reorder, and pull from the second bin."
  },
  {
    title: "One-Piece Flow",
    fact: "Batching hides defects. Moving one item at a time through the process exposes bottlenecks and prevents mass-rework."
  },
  {
    title: "Spaghetti Diagrams",
    fact: "Draw the physical path an operator takes. You'll be shocked at the wasted movement. Redesign the cell to minimize walking."
  },
  {
    title: "Stop the Line (Jidoka)",
    fact: "Empower every worker to stop production when a defect is spotted. Fixing it now is exponentially cheaper than fixing it later."
  },
  {
    title: "Error Proofing (Poka-Yoke)",
    fact: "Design parts so they can only be assembled the correct way. If a pin is off-center, it cannot be inserted backwards."
  }
];
