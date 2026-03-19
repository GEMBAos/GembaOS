import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetPath = path.join(__dirname, '..', 'src', 'data', 'leanQuizzes.ts');

const templates = [
    // Template 1: Bottleneck throughput (Process Map)
    {
        generate: () => {
            const cut = Math.floor(Math.random() * 5) + 2;
            const sew = Math.floor(Math.random() * 10) + 10; // Bottleneck
            const inspect = Math.floor(Math.random() * 4) + 1;
            const pack = Math.floor(Math.random() * 3) + 1;
            const hour = 60;
            const throughput = Math.floor(hour / sew);
            const wrong1 = Math.floor(hour / cut);
            const wrong2 = Math.floor(hour / ((cut + sew + inspect + pack) / 4));

            return {
                scenario: `PROCESS MAP:\n- Cut (${cut}m)\n- Sew (${sew}m)\n- Inspect (${inspect}m)\n- Pack (${pack}m)\n\nWhat is the maximum throughput of this line in one ${hour}-minute hour?`,
                options: [
                    { text: `${wrong1} units, based on the fastest step (Cut).`, impactText: `Producing ${wrong1} units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.`, isOptimal: false },
                    { text: `${throughput} units, because the Sew step governs the entire line.`, impactText: `Correct! Mathematics: ${hour} minutes / ${sew} minute bottleneck = ${throughput} units per hour maximum.`, isOptimal: true },
                    { text: `${wrong2} units, the average of all the times.`, impactText: `Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.`, isOptimal: false }
                ],
                keyTakeaway: `Your system can only produce as fast as its slowest step (The Bottleneck). ${hour}m / ${sew}m constraint = ${throughput} parts/hr.`
            };
        }
    },
    // Template 2: Improving the Bottleneck
    {
        generate: () => {
            const prep = Math.floor(Math.random() * 4) + 3;
            const weldOld = Math.floor(Math.random() * 5) + 12; // 12-16
            const grind = Math.floor(Math.random() * 3) + 3;
            const weldNew = Math.floor(Math.random() * 3) + 8; // 8-10, always less than weldOld but more than prep/grind
            const hour = 60;
            const oldThroughput = (hour / weldOld).toFixed(1);
            const newThroughput = (hour / weldNew).toFixed(1);

            return {
                scenario: `PROCESS MAP:\n- Prep (${prep}m)\n- Weld (${weldOld}m)\n- Grind (${grind}m)\n\nYou hire a faster Welder who completes their step in ${weldNew} minutes.\nWhat is the new hourly output?`,
                options: [
                    { text: `It remains ${oldThroughput} parts per hour.`, impactText: `Incorrect. The bottleneck changed from ${weldOld}m to ${weldNew}m, so throughput goes up.`, isOptimal: false },
                    { text: `${newThroughput} parts per hour.`, impactText: `Correct! Mathematics: ${hour} minutes / ${weldNew} minute bottleneck = ${newThroughput} units per hour. You elevated the constraint.`, isOptimal: true },
                    { text: `${(hour / prep).toFixed(1)} parts per hour if Prep speeds up.`, impactText: `Speeding up Prep (${prep}m) does nothing because Weld (${weldNew}m) is still the bottleneck.`, isOptimal: false }
                ],
                keyTakeaway: `When you improve the bottleneck (Weld from ${weldOld}m to ${weldNew}m), the entire line's output increases immediately.`
            };
        }
    },
    // Template 3: Cycle Time vs Takt Time
    {
        generate: () => {
            const takt = Math.floor(Math.random() * 30) + 40; // 40-70 seconds
            const cycle = Math.floor(Math.random() * 20) + takt + 5; // always higher than takt
            const parts = ['bracket', 'door panel', 'sensor', 'housing', 'motor'];
            const part = parts[Math.floor(Math.random() * parts.length)];

            return {
                scenario: `Your assembly line requires a ${part} every ${takt} seconds (Takt Time).\nYour current cycle time to install it is ${cycle} seconds.\n\nWhat happens?`,
                options: [
                    { text: `You meet customer demand perfectly.`, impactText: `Math error: Customer wants one every ${takt}s, you make one every ${cycle}s. You will fall behind.`, isOptimal: false },
                    { text: `You overproduce and create inventory.`, impactText: `If it takes you ${cycle}s, you are slower than the ${takt}s demand. You underproduce.`, isOptimal: false },
                    { text: `You miss customer delivery targets and require overtime.`, impactText: `Correct! If Cycle Time (${cycle}s) > Takt Time (${takt}s), you cannot meet demand without adding shifts or improving the process.`, isOptimal: true }
                ],
                keyTakeaway: `Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them.`
            };
        }
    },
    // Template 4: Walking Waste
    {
        generate: () => {
            const walk1 = Math.floor(Math.random() * 3) + 1;
            const walk2 = Math.floor(Math.random() * 3) + 1;
            const walk3 = walk1 + walk2; // 2 to 6
            const totalWalk = walk1 + walk2 + walk3;
            const cycles = Math.floor(Math.random() * 10) + 15; // 15-24
            const days = 250;
            const annualHours = Math.floor((totalWalk * cycles * days) / 60);

            return {
                scenario: `Before an operator starts, they walk ${walk1} mins to grab tools, ${walk2} mins to get parts, and ${walk3} mins returning.\n(${totalWalk} mins total walk per cycle).\n\nAt ${cycles} cycles a day, what is the annual walk waste? (250 days/yr)`,
                options: [
                    { text: `${annualHours} hours a year walking.`, impactText: `Correct! Math: ${totalWalk} mins * ${cycles} cycles = ${totalWalk * cycles} mins/day. That's ${annualHours} hours a year just walking!`, isOptimal: true },
                    { text: `${Math.floor(annualHours / 4)} hours a year walking.`, impactText: `Math error. ${totalWalk} mins * ${cycles} cycles is ${totalWalk * cycles} minutes EVERY DAY. It adds up massively.`, isOptimal: false },
                    { text: `${Math.floor(totalWalk * cycles)} hours a year walking.`, impactText: `Mixed up minutes and hours. But regardless, it's a massive drain on productivity.`, isOptimal: false }
                ],
                keyTakeaway: `${totalWalk} mins of walking per cycle = ${annualHours} HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste.`
            };
        }
    },
    // Template 5: Line Balancing / Artificial Work
    {
        generate: () => {
            const mold = Math.floor(Math.random() * 10) + 20; // 20-29
            const trim = Math.floor(Math.random() * 5) + 3; // 3-7
            const delta = mold - trim;

            return {
                scenario: `PROCESS MAP:\n- Mold (${mold}m)\n- Trim (${trim}m)\n\nTo balance the line, you tell the Trimmer to slow down and take ${mold} minutes to look busy. Is this Lean?`,
                options: [
                    { text: `Yes, because everyone is working continuously.`, impactText: `This is a common trap. You are filling time with artificial work, which masks the imbalance.`, isOptimal: false },
                    { text: `No. The Trimmer should work at a ${trim}m pace and then cross-train or help the Molder for ${delta}m.`, impactText: `Correct! Embrace the imbalance. If Trim takes ${trim}m and Mold takes ${mold}m, the Trimmer has ${delta}m of free capacity to help elsewhere.`, isOptimal: true },
                    { text: `It doesn't matter, output is still gated by ${mold}m.`, impactText: `While output stays gated, you lost ${delta} minutes of labor capacity per part doing fake work.`, isOptimal: false }
                ],
                keyTakeaway: `Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere.`
            };
        }
    }
];

const quizzes = [];
const uniqueScenarios = new Set();
let attempts = 0;

// Generate precisely 250 unique quizzes
while (quizzes.length < 250 && attempts < 5000) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const generated = template.generate();

    if (!uniqueScenarios.has(generated.scenario)) {
        uniqueScenarios.add(generated.scenario);
        quizzes.push(generated);
    }
    attempts++;
}

// Shuffle the array uniquely so it's random when mapped
quizzes.sort(() => Math.random() - 0.5);

const fileContent = `export interface QuizOption {
    text: string;
    impactText: string;
    isOptimal: boolean;
}

export interface LeanQuiz {
    scenario: string;
    imageUrl?: string;
    options: QuizOption[];
    keyTakeaway: string;
}

export const LEAN_QUIZZES: LeanQuiz[] = ${JSON.stringify(quizzes, null, 4)};`;

fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log('Successfully generated ' + quizzes.length + ' strictly unique Lean Quizzes in ' + attempts + ' attempts!');
