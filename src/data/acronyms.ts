export interface LeanAcronym {
    acronym: string;
    definition: string;
    context: string;
    submittedBy?: string;
    votes?: number;
}

export const INITIAL_ACRONYMS: LeanAcronym[] = [
    { acronym: "JFI", definition: "Just Fix It", context: "A 2-second improvement approach to eliminating waste immediately.", votes: 42 },
    { acronym: "ROI", definition: "Return on Investment", context: "Performance measure used to evaluate the efficiency of an investment.", votes: 15 },
    { acronym: "OTD", definition: "On Time Delivery", context: "Metric measuring the amount of shipments delivered on or before the promised date.", votes: 24 },
    { acronym: "WIP", definition: "Work In Process", context: "Partially finished goods waiting for completion or value creation.", votes: 38 },
    { acronym: "SMED", definition: "Single-Minute Exchange of Dies", context: "System for dramatically reducing the time it takes to complete equipment changeovers.", votes: 20 },
    { acronym: "PDCA", definition: "Plan-Do-Check-Act", context: "Iterative four-step management method used for control and continuous improvement.", votes: 31 },
    { acronym: "TPM", definition: "Total Productive Maintenance", context: "System of maintaining and improving the integrity of production and quality systems.", votes: 19 },
    { acronym: "GEMBA", definition: "The actual place", context: "Where value is created; the shop floor or frontline.", votes: 55 },
    { acronym: "OEE", definition: "Overall Equipment Effectiveness", context: "A standard for measuring manufacturing productivity.", votes: 28 }
];
