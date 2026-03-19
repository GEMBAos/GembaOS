export interface QuizOption {
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

export const LEAN_QUIZZES: LeanQuiz[] = [
    {
        "scenario": "PROCESS MAP:\n- Mold (29m)\n- Trim (6m)\n\nTo balance the line, you tell the Trimmer to slow down and take 29 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 6m pace and then cross-train or help the Molder for 23m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 6m and Mold takes 29m, the Trimmer has 23m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 29m.",
                "impactText": "While output stays gated, you lost 23 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (4m)\n- Sew (14m)\n- Inspect (3m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "15 units, based on the fastest step (Cut).",
                "impactText": "Producing 15 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "4 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 14 minute bottleneck = 4 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "10 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 14m constraint = 4 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (3m)\n- Sew (19m)\n- Inspect (3m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "20 units, based on the fastest step (Cut).",
                "impactText": "Producing 20 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 19 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "9 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 19m constraint = 3 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a housing every 50 seconds (Takt Time).\nYour current cycle time to install it is 71 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 50s, you make one every 71s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 71s, you are slower than the 50s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (71s) > Takt Time (50s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (12m)\n- Grind (4m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 5.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 12m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 12m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (13m)\n- Grind (4m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.6 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 13m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 13m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "Your assembly line requires a bracket every 66 seconds (Takt Time).\nYour current cycle time to install it is 71 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 66s, you make one every 71s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 71s, you are slower than the 66s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (71s) > Takt Time (66s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (14m)\n- Inspect (4m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "4 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 14 minute bottleneck = 4 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "10 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 14m constraint = 4 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (5m)\n- Weld (14m)\n- Grind (4m)\n\nYou hire a faster Welder who completes their step in 9 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.3 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 14m to 9m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.7 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 9 minute bottleneck = 6.7 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "12.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (5m) does nothing because Weld (9m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 14m to 9m), the entire line's output increases immediately."
    },
    {
        "scenario": "Your assembly line requires a sensor every 44 seconds (Takt Time).\nYour current cycle time to install it is 54 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 44s, you make one every 54s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 54s, you are slower than the 44s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (54s) > Takt Time (44s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (24m)\n- Trim (5m)\n\nTo balance the line, you tell the Trimmer to slow down and take 24 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 5m pace and then cross-train or help the Molder for 19m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 5m and Mold takes 24m, the Trimmer has 19m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 24m.",
                "impactText": "While output stays gated, you lost 19 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (4m)\n- Weld (15m)\n- Grind (4m)\n\nYou hire a faster Welder who completes their step in 8 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 15m to 8m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "7.5 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 8 minute bottleneck = 7.5 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "15.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (4m) does nothing because Weld (8m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 15m to 8m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (6m)\n- Sew (17m)\n- Inspect (2m)\n- Pack (2m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "10 units, based on the fastest step (Cut).",
                "impactText": "Producing 10 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 17 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "8 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 17m constraint = 3 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (4m)\n- Weld (13m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 8 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.6 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 13m to 8m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "7.5 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 8 minute bottleneck = 7.5 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "15.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (4m) does nothing because Weld (8m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 13m to 8m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (5m)\n- Weld (15m)\n- Grind (4m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 15m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "12.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (5m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 15m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "Your assembly line requires a bracket every 43 seconds (Takt Time).\nYour current cycle time to install it is 67 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 43s, you make one every 67s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 67s, you are slower than the 43s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (67s) > Takt Time (43s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (26m)\n- Trim (5m)\n\nTo balance the line, you tell the Trimmer to slow down and take 26 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 5m pace and then cross-train or help the Molder for 21m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 5m and Mold takes 26m, the Trimmer has 21m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 26m.",
                "impactText": "While output stays gated, you lost 21 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Before an operator starts, they walk 3 mins to grab tools, 3 mins to get parts, and 6 mins returning.\n(12 mins total walk per cycle).\n\nAt 15 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "750 hours a year walking.",
                "impactText": "Correct! Math: 12 mins * 15 cycles = 180 mins/day. That's 750 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "187 hours a year walking.",
                "impactText": "Math error. 12 mins * 15 cycles is 180 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "180 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "12 mins of walking per cycle = 750 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Before an operator starts, they walk 3 mins to grab tools, 1 mins to get parts, and 4 mins returning.\n(8 mins total walk per cycle).\n\nAt 21 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "700 hours a year walking.",
                "impactText": "Correct! Math: 8 mins * 21 cycles = 168 mins/day. That's 700 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "175 hours a year walking.",
                "impactText": "Math error. 8 mins * 21 cycles is 168 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "168 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "8 mins of walking per cycle = 700 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a door panel every 63 seconds (Takt Time).\nYour current cycle time to install it is 87 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 63s, you make one every 87s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 87s, you are slower than the 63s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (87s) > Takt Time (63s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (12m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 8 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 5.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 12m to 8m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "7.5 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 8 minute bottleneck = 7.5 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (8m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 12m to 8m), the entire line's output increases immediately."
    },
    {
        "scenario": "Your assembly line requires a sensor every 65 seconds (Takt Time).\nYour current cycle time to install it is 70 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 65s, you make one every 70s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 70s, you are slower than the 65s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (70s) > Takt Time (65s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Before an operator starts, they walk 2 mins to grab tools, 3 mins to get parts, and 5 mins returning.\n(10 mins total walk per cycle).\n\nAt 17 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "708 hours a year walking.",
                "impactText": "Correct! Math: 10 mins * 17 cycles = 170 mins/day. That's 708 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "177 hours a year walking.",
                "impactText": "Math error. 10 mins * 17 cycles is 170 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "170 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "10 mins of walking per cycle = 708 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (23m)\n- Trim (5m)\n\nTo balance the line, you tell the Trimmer to slow down and take 23 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 5m pace and then cross-train or help the Molder for 18m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 5m and Mold takes 23m, the Trimmer has 18m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 23m.",
                "impactText": "While output stays gated, you lost 18 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Before an operator starts, they walk 2 mins to grab tools, 3 mins to get parts, and 5 mins returning.\n(10 mins total walk per cycle).\n\nAt 19 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "791 hours a year walking.",
                "impactText": "Correct! Math: 10 mins * 19 cycles = 190 mins/day. That's 791 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "197 hours a year walking.",
                "impactText": "Math error. 10 mins * 19 cycles is 190 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "190 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "10 mins of walking per cycle = 791 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a door panel every 61 seconds (Takt Time).\nYour current cycle time to install it is 82 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 61s, you make one every 82s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 82s, you are slower than the 61s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (82s) > Takt Time (61s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a door panel every 65 seconds (Takt Time).\nYour current cycle time to install it is 83 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 65s, you make one every 83s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 83s, you are slower than the 65s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (83s) > Takt Time (65s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (13m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.6 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 13m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 13m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (4m)\n- Sew (19m)\n- Inspect (2m)\n- Pack (2m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "15 units, based on the fastest step (Cut).",
                "impactText": "Producing 15 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 19 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "8 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 19m constraint = 3 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a motor every 65 seconds (Takt Time).\nYour current cycle time to install it is 79 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 65s, you make one every 79s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 79s, you are slower than the 65s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (79s) > Takt Time (65s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (6m)\n- Sew (19m)\n- Inspect (3m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "10 units, based on the fastest step (Cut).",
                "impactText": "Producing 10 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 19 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "8 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 19m constraint = 3 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (29m)\n- Trim (5m)\n\nTo balance the line, you tell the Trimmer to slow down and take 29 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 5m pace and then cross-train or help the Molder for 24m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 5m and Mold takes 29m, the Trimmer has 24m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 29m.",
                "impactText": "While output stays gated, you lost 24 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (3m)\n- Weld (16m)\n- Grind (4m)\n\nYou hire a faster Welder who completes their step in 8 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 3.8 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 16m to 8m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "7.5 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 8 minute bottleneck = 7.5 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "20.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (3m) does nothing because Weld (8m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 16m to 8m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (14m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.3 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 14m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 14m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "Your assembly line requires a bracket every 57 seconds (Takt Time).\nYour current cycle time to install it is 72 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 57s, you make one every 72s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 72s, you are slower than the 57s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (72s) > Takt Time (57s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 1 mins to get parts, and 2 mins returning.\n(4 mins total walk per cycle).\n\nAt 23 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "383 hours a year walking.",
                "impactText": "Correct! Math: 4 mins * 23 cycles = 92 mins/day. That's 383 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "95 hours a year walking.",
                "impactText": "Math error. 4 mins * 23 cycles is 92 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "92 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "4 mins of walking per cycle = 383 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a housing every 68 seconds (Takt Time).\nYour current cycle time to install it is 76 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 68s, you make one every 76s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 76s, you are slower than the 68s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (76s) > Takt Time (68s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Before an operator starts, they walk 3 mins to grab tools, 3 mins to get parts, and 6 mins returning.\n(12 mins total walk per cycle).\n\nAt 24 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "1200 hours a year walking.",
                "impactText": "Correct! Math: 12 mins * 24 cycles = 288 mins/day. That's 1200 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "300 hours a year walking.",
                "impactText": "Math error. 12 mins * 24 cycles is 288 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "288 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "12 mins of walking per cycle = 1200 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a door panel every 60 seconds (Takt Time).\nYour current cycle time to install it is 71 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 60s, you make one every 71s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 71s, you are slower than the 60s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (71s) > Takt Time (60s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a motor every 69 seconds (Takt Time).\nYour current cycle time to install it is 91 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 69s, you make one every 91s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 91s, you are slower than the 69s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (91s) > Takt Time (69s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 2 mins to get parts, and 3 mins returning.\n(6 mins total walk per cycle).\n\nAt 17 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "425 hours a year walking.",
                "impactText": "Correct! Math: 6 mins * 17 cycles = 102 mins/day. That's 425 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "106 hours a year walking.",
                "impactText": "Math error. 6 mins * 17 cycles is 102 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "102 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "6 mins of walking per cycle = 425 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (25m)\n- Trim (3m)\n\nTo balance the line, you tell the Trimmer to slow down and take 25 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 3m pace and then cross-train or help the Molder for 22m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 3m and Mold takes 25m, the Trimmer has 22m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 25m.",
                "impactText": "While output stays gated, you lost 22 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 1 mins to get parts, and 2 mins returning.\n(4 mins total walk per cycle).\n\nAt 20 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "333 hours a year walking.",
                "impactText": "Correct! Math: 4 mins * 20 cycles = 80 mins/day. That's 333 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "83 hours a year walking.",
                "impactText": "Math error. 4 mins * 20 cycles is 80 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "80 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "4 mins of walking per cycle = 333 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 1 mins to get parts, and 2 mins returning.\n(4 mins total walk per cycle).\n\nAt 18 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "300 hours a year walking.",
                "impactText": "Correct! Math: 4 mins * 18 cycles = 72 mins/day. That's 300 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "75 hours a year walking.",
                "impactText": "Math error. 4 mins * 18 cycles is 72 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "72 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "4 mins of walking per cycle = 300 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (5m)\n- Sew (10m)\n- Inspect (3m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "12 units, based on the fastest step (Cut).",
                "impactText": "Producing 12 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "6 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "12 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 10m constraint = 6 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (24m)\n- Trim (4m)\n\nTo balance the line, you tell the Trimmer to slow down and take 24 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 4m pace and then cross-train or help the Molder for 20m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 4m and Mold takes 24m, the Trimmer has 20m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 24m.",
                "impactText": "While output stays gated, you lost 20 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a motor every 59 seconds (Takt Time).\nYour current cycle time to install it is 68 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 59s, you make one every 68s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 68s, you are slower than the 59s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (68s) > Takt Time (59s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (5m)\n- Sew (12m)\n- Inspect (3m)\n- Pack (2m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "12 units, based on the fastest step (Cut).",
                "impactText": "Producing 12 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "5 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 12 minute bottleneck = 5 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "10 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 12m constraint = 5 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (15m)\n- Inspect (3m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "4 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 15 minute bottleneck = 4 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "10 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 15m constraint = 4 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (27m)\n- Trim (6m)\n\nTo balance the line, you tell the Trimmer to slow down and take 27 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 6m pace and then cross-train or help the Molder for 21m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 6m and Mold takes 27m, the Trimmer has 21m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 27m.",
                "impactText": "While output stays gated, you lost 21 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (20m)\n- Trim (5m)\n\nTo balance the line, you tell the Trimmer to slow down and take 20 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 5m pace and then cross-train or help the Molder for 15m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 5m and Mold takes 20m, the Trimmer has 15m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 20m.",
                "impactText": "While output stays gated, you lost 15 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a housing every 69 seconds (Takt Time).\nYour current cycle time to install it is 75 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 69s, you make one every 75s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 75s, you are slower than the 69s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (75s) > Takt Time (69s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a bracket every 62 seconds (Takt Time).\nYour current cycle time to install it is 73 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 62s, you make one every 73s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 73s, you are slower than the 62s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (73s) > Takt Time (62s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (15m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 9 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 15m to 9m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.7 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 9 minute bottleneck = 6.7 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (9m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 15m to 9m), the entire line's output increases immediately."
    },
    {
        "scenario": "Your assembly line requires a sensor every 45 seconds (Takt Time).\nYour current cycle time to install it is 50 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 45s, you make one every 50s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 50s, you are slower than the 45s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (50s) > Takt Time (45s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (21m)\n- Trim (4m)\n\nTo balance the line, you tell the Trimmer to slow down and take 21 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 4m pace and then cross-train or help the Molder for 17m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 4m and Mold takes 21m, the Trimmer has 17m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 21m.",
                "impactText": "While output stays gated, you lost 17 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (5m)\n- Weld (13m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.6 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 13m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "12.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (5m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 13m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "Your assembly line requires a door panel every 62 seconds (Takt Time).\nYour current cycle time to install it is 71 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 62s, you make one every 71s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 71s, you are slower than the 62s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (71s) > Takt Time (62s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (4m)\n- Sew (18m)\n- Inspect (3m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "15 units, based on the fastest step (Cut).",
                "impactText": "Producing 15 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 18 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "9 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 18m constraint = 3 parts/hr."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 3 mins to get parts, and 4 mins returning.\n(8 mins total walk per cycle).\n\nAt 23 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "766 hours a year walking.",
                "impactText": "Correct! Math: 8 mins * 23 cycles = 184 mins/day. That's 766 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "191 hours a year walking.",
                "impactText": "Math error. 8 mins * 23 cycles is 184 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "184 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "8 mins of walking per cycle = 766 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a motor every 68 seconds (Takt Time).\nYour current cycle time to install it is 86 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 68s, you make one every 86s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 86s, you are slower than the 68s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (86s) > Takt Time (68s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (16m)\n- Inspect (2m)\n- Pack (2m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 16 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "10 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 16m constraint = 3 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a housing every 54 seconds (Takt Time).\nYour current cycle time to install it is 59 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 54s, you make one every 59s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 59s, you are slower than the 54s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (59s) > Takt Time (54s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a door panel every 41 seconds (Takt Time).\nYour current cycle time to install it is 61 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 41s, you make one every 61s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 61s, you are slower than the 41s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (61s) > Takt Time (41s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (27m)\n- Trim (5m)\n\nTo balance the line, you tell the Trimmer to slow down and take 27 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 5m pace and then cross-train or help the Molder for 22m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 5m and Mold takes 27m, the Trimmer has 22m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 27m.",
                "impactText": "While output stays gated, you lost 22 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (4m)\n- Weld (14m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 8 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.3 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 14m to 8m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "7.5 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 8 minute bottleneck = 7.5 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "15.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (4m) does nothing because Weld (8m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 14m to 8m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (5m)\n- Weld (12m)\n- Grind (4m)\n\nYou hire a faster Welder who completes their step in 9 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 5.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 12m to 9m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.7 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 9 minute bottleneck = 6.7 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "12.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (5m) does nothing because Weld (9m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 12m to 9m), the entire line's output increases immediately."
    },
    {
        "scenario": "Before an operator starts, they walk 3 mins to grab tools, 1 mins to get parts, and 4 mins returning.\n(8 mins total walk per cycle).\n\nAt 20 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "666 hours a year walking.",
                "impactText": "Correct! Math: 8 mins * 20 cycles = 160 mins/day. That's 666 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "166 hours a year walking.",
                "impactText": "Math error. 8 mins * 20 cycles is 160 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "160 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "8 mins of walking per cycle = 666 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a bracket every 48 seconds (Takt Time).\nYour current cycle time to install it is 56 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 48s, you make one every 56s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 56s, you are slower than the 48s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (56s) > Takt Time (48s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (4m)\n- Sew (18m)\n- Inspect (2m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "15 units, based on the fastest step (Cut).",
                "impactText": "Producing 15 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 18 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "8 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 18m constraint = 3 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (22m)\n- Trim (4m)\n\nTo balance the line, you tell the Trimmer to slow down and take 22 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 4m pace and then cross-train or help the Molder for 18m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 4m and Mold takes 22m, the Trimmer has 18m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 22m.",
                "impactText": "While output stays gated, you lost 18 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (5m)\n- Weld (14m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.3 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 14m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "12.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (5m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 14m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (3m)\n- Sew (10m)\n- Inspect (3m)\n- Pack (2m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "20 units, based on the fastest step (Cut).",
                "impactText": "Producing 20 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "6 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "13 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 10m constraint = 6 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a door panel every 42 seconds (Takt Time).\nYour current cycle time to install it is 51 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 42s, you make one every 51s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 51s, you are slower than the 42s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (51s) > Takt Time (42s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (4m)\n- Sew (19m)\n- Inspect (1m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "15 units, based on the fastest step (Cut).",
                "impactText": "Producing 15 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 19 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "8 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 19m constraint = 3 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (28m)\n- Trim (6m)\n\nTo balance the line, you tell the Trimmer to slow down and take 28 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 6m pace and then cross-train or help the Molder for 22m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 6m and Mold takes 28m, the Trimmer has 22m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 28m.",
                "impactText": "While output stays gated, you lost 22 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a bracket every 65 seconds (Takt Time).\nYour current cycle time to install it is 77 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 65s, you make one every 77s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 77s, you are slower than the 65s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (77s) > Takt Time (65s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Before an operator starts, they walk 2 mins to grab tools, 3 mins to get parts, and 5 mins returning.\n(10 mins total walk per cycle).\n\nAt 24 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "1000 hours a year walking.",
                "impactText": "Correct! Math: 10 mins * 24 cycles = 240 mins/day. That's 1000 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "250 hours a year walking.",
                "impactText": "Math error. 10 mins * 24 cycles is 240 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "240 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "10 mins of walking per cycle = 1000 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (16m)\n- Inspect (4m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 16 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "10 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 16m constraint = 3 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (26m)\n- Trim (4m)\n\nTo balance the line, you tell the Trimmer to slow down and take 26 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 4m pace and then cross-train or help the Molder for 22m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 4m and Mold takes 26m, the Trimmer has 22m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 26m.",
                "impactText": "While output stays gated, you lost 22 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a motor every 40 seconds (Takt Time).\nYour current cycle time to install it is 56 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 40s, you make one every 56s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 56s, you are slower than the 40s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (56s) > Takt Time (40s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (29m)\n- Trim (3m)\n\nTo balance the line, you tell the Trimmer to slow down and take 29 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 3m pace and then cross-train or help the Molder for 26m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 3m and Mold takes 29m, the Trimmer has 26m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 29m.",
                "impactText": "While output stays gated, you lost 26 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (5m)\n- Sew (11m)\n- Inspect (3m)\n- Pack (2m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "12 units, based on the fastest step (Cut).",
                "impactText": "Producing 12 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "5 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 11 minute bottleneck = 5 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "11 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 11m constraint = 5 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a motor every 49 seconds (Takt Time).\nYour current cycle time to install it is 63 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 49s, you make one every 63s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 63s, you are slower than the 49s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (63s) > Takt Time (49s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a sensor every 57 seconds (Takt Time).\nYour current cycle time to install it is 72 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 57s, you make one every 72s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 72s, you are slower than the 57s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (72s) > Takt Time (57s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (5m)\n- Weld (13m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 9 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.6 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 13m to 9m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.7 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 9 minute bottleneck = 6.7 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "12.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (5m) does nothing because Weld (9m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 13m to 9m), the entire line's output increases immediately."
    },
    {
        "scenario": "Your assembly line requires a bracket every 66 seconds (Takt Time).\nYour current cycle time to install it is 90 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 66s, you make one every 90s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 90s, you are slower than the 66s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (90s) > Takt Time (66s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (26m)\n- Trim (6m)\n\nTo balance the line, you tell the Trimmer to slow down and take 26 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 6m pace and then cross-train or help the Molder for 20m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 6m and Mold takes 26m, the Trimmer has 20m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 26m.",
                "impactText": "While output stays gated, you lost 20 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (22m)\n- Trim (7m)\n\nTo balance the line, you tell the Trimmer to slow down and take 22 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 7m pace and then cross-train or help the Molder for 15m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 7m and Mold takes 22m, the Trimmer has 15m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 22m.",
                "impactText": "While output stays gated, you lost 15 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a housing every 48 seconds (Takt Time).\nYour current cycle time to install it is 62 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 48s, you make one every 62s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 62s, you are slower than the 48s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (62s) > Takt Time (48s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a bracket every 54 seconds (Takt Time).\nYour current cycle time to install it is 69 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 54s, you make one every 69s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 69s, you are slower than the 54s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (69s) > Takt Time (54s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 2 mins to get parts, and 3 mins returning.\n(6 mins total walk per cycle).\n\nAt 23 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "575 hours a year walking.",
                "impactText": "Correct! Math: 6 mins * 23 cycles = 138 mins/day. That's 575 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "143 hours a year walking.",
                "impactText": "Math error. 6 mins * 23 cycles is 138 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "138 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "6 mins of walking per cycle = 575 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (12m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 9 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 5.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 12m to 9m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.7 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 9 minute bottleneck = 6.7 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (9m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 12m to 9m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (6m)\n- Sew (11m)\n- Inspect (1m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "10 units, based on the fastest step (Cut).",
                "impactText": "Producing 10 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "5 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 11 minute bottleneck = 5 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "12 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 11m constraint = 5 parts/hr."
    },
    {
        "scenario": "Before an operator starts, they walk 2 mins to grab tools, 2 mins to get parts, and 4 mins returning.\n(8 mins total walk per cycle).\n\nAt 21 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "700 hours a year walking.",
                "impactText": "Correct! Math: 8 mins * 21 cycles = 168 mins/day. That's 700 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "175 hours a year walking.",
                "impactText": "Math error. 8 mins * 21 cycles is 168 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "168 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "8 mins of walking per cycle = 700 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a door panel every 54 seconds (Takt Time).\nYour current cycle time to install it is 59 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 54s, you make one every 59s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 59s, you are slower than the 54s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (59s) > Takt Time (54s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (4m)\n- Sew (17m)\n- Inspect (2m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "15 units, based on the fastest step (Cut).",
                "impactText": "Producing 15 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 17 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "9 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 17m constraint = 3 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (3m)\n- Weld (14m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 8 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.3 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 14m to 8m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "7.5 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 8 minute bottleneck = 7.5 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "20.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (3m) does nothing because Weld (8m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 14m to 8m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (25m)\n- Trim (5m)\n\nTo balance the line, you tell the Trimmer to slow down and take 25 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 5m pace and then cross-train or help the Molder for 20m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 5m and Mold takes 25m, the Trimmer has 20m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 25m.",
                "impactText": "While output stays gated, you lost 20 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (19m)\n- Inspect (3m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 19 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "8 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 19m constraint = 3 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a motor every 60 seconds (Takt Time).\nYour current cycle time to install it is 84 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 60s, you make one every 84s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 84s, you are slower than the 60s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (84s) > Takt Time (60s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Before an operator starts, they walk 2 mins to grab tools, 1 mins to get parts, and 3 mins returning.\n(6 mins total walk per cycle).\n\nAt 23 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "575 hours a year walking.",
                "impactText": "Correct! Math: 6 mins * 23 cycles = 138 mins/day. That's 575 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "143 hours a year walking.",
                "impactText": "Math error. 6 mins * 23 cycles is 138 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "138 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "6 mins of walking per cycle = 575 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a bracket every 64 seconds (Takt Time).\nYour current cycle time to install it is 80 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 64s, you make one every 80s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 80s, you are slower than the 64s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (80s) > Takt Time (64s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (20m)\n- Trim (3m)\n\nTo balance the line, you tell the Trimmer to slow down and take 20 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 3m pace and then cross-train or help the Molder for 17m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 3m and Mold takes 20m, the Trimmer has 17m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 20m.",
                "impactText": "While output stays gated, you lost 17 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (25m)\n- Trim (7m)\n\nTo balance the line, you tell the Trimmer to slow down and take 25 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 7m pace and then cross-train or help the Molder for 18m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 7m and Mold takes 25m, the Trimmer has 18m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 25m.",
                "impactText": "While output stays gated, you lost 18 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (12m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 8 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 5.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 12m to 8m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "7.5 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 8 minute bottleneck = 7.5 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (8m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 12m to 8m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (21m)\n- Trim (5m)\n\nTo balance the line, you tell the Trimmer to slow down and take 21 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 5m pace and then cross-train or help the Molder for 16m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 5m and Mold takes 21m, the Trimmer has 16m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 21m.",
                "impactText": "While output stays gated, you lost 16 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a motor every 69 seconds (Takt Time).\nYour current cycle time to install it is 81 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 69s, you make one every 81s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 81s, you are slower than the 69s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (81s) > Takt Time (69s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (19m)\n- Inspect (2m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 19 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "9 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 19m constraint = 3 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (23m)\n- Trim (4m)\n\nTo balance the line, you tell the Trimmer to slow down and take 23 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 4m pace and then cross-train or help the Molder for 19m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 4m and Mold takes 23m, the Trimmer has 19m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 23m.",
                "impactText": "While output stays gated, you lost 19 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a housing every 41 seconds (Takt Time).\nYour current cycle time to install it is 59 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 41s, you make one every 59s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 59s, you are slower than the 41s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (59s) > Takt Time (41s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a sensor every 69 seconds (Takt Time).\nYour current cycle time to install it is 84 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 69s, you make one every 84s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 84s, you are slower than the 69s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (84s) > Takt Time (69s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Before an operator starts, they walk 2 mins to grab tools, 1 mins to get parts, and 3 mins returning.\n(6 mins total walk per cycle).\n\nAt 18 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "450 hours a year walking.",
                "impactText": "Correct! Math: 6 mins * 18 cycles = 108 mins/day. That's 450 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "112 hours a year walking.",
                "impactText": "Math error. 6 mins * 18 cycles is 108 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "108 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "6 mins of walking per cycle = 450 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (3m)\n- Sew (11m)\n- Inspect (1m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "20 units, based on the fastest step (Cut).",
                "impactText": "Producing 20 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "5 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 11 minute bottleneck = 5 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "15 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 11m constraint = 5 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (21m)\n- Trim (7m)\n\nTo balance the line, you tell the Trimmer to slow down and take 21 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 7m pace and then cross-train or help the Molder for 14m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 7m and Mold takes 21m, the Trimmer has 14m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 21m.",
                "impactText": "While output stays gated, you lost 14 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a door panel every 49 seconds (Takt Time).\nYour current cycle time to install it is 66 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 49s, you make one every 66s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 66s, you are slower than the 49s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (66s) > Takt Time (49s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Before an operator starts, they walk 2 mins to grab tools, 3 mins to get parts, and 5 mins returning.\n(10 mins total walk per cycle).\n\nAt 22 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "916 hours a year walking.",
                "impactText": "Correct! Math: 10 mins * 22 cycles = 220 mins/day. That's 916 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "229 hours a year walking.",
                "impactText": "Math error. 10 mins * 22 cycles is 220 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "220 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "10 mins of walking per cycle = 916 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (20m)\n- Trim (7m)\n\nTo balance the line, you tell the Trimmer to slow down and take 20 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 7m pace and then cross-train or help the Molder for 13m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 7m and Mold takes 20m, the Trimmer has 13m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 20m.",
                "impactText": "While output stays gated, you lost 13 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a sensor every 42 seconds (Takt Time).\nYour current cycle time to install it is 56 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 42s, you make one every 56s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 56s, you are slower than the 42s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (56s) > Takt Time (42s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (28m)\n- Trim (3m)\n\nTo balance the line, you tell the Trimmer to slow down and take 28 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 3m pace and then cross-train or help the Molder for 25m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 3m and Mold takes 28m, the Trimmer has 25m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 28m.",
                "impactText": "While output stays gated, you lost 25 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Before an operator starts, they walk 3 mins to grab tools, 3 mins to get parts, and 6 mins returning.\n(12 mins total walk per cycle).\n\nAt 20 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "1000 hours a year walking.",
                "impactText": "Correct! Math: 12 mins * 20 cycles = 240 mins/day. That's 1000 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "250 hours a year walking.",
                "impactText": "Math error. 12 mins * 20 cycles is 240 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "240 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "12 mins of walking per cycle = 1000 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a bracket every 58 seconds (Takt Time).\nYour current cycle time to install it is 82 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 58s, you make one every 82s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 82s, you are slower than the 58s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (82s) > Takt Time (58s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 1 mins to get parts, and 2 mins returning.\n(4 mins total walk per cycle).\n\nAt 24 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "400 hours a year walking.",
                "impactText": "Correct! Math: 4 mins * 24 cycles = 96 mins/day. That's 400 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "100 hours a year walking.",
                "impactText": "Math error. 4 mins * 24 cycles is 96 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "96 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "4 mins of walking per cycle = 400 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (4m)\n- Sew (14m)\n- Inspect (4m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "15 units, based on the fastest step (Cut).",
                "impactText": "Producing 15 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "4 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 14 minute bottleneck = 4 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "9 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 14m constraint = 4 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (5m)\n- Sew (16m)\n- Inspect (1m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "12 units, based on the fastest step (Cut).",
                "impactText": "Producing 12 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 16 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "10 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 16m constraint = 3 parts/hr."
    },
    {
        "scenario": "Before an operator starts, they walk 2 mins to grab tools, 2 mins to get parts, and 4 mins returning.\n(8 mins total walk per cycle).\n\nAt 15 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "500 hours a year walking.",
                "impactText": "Correct! Math: 8 mins * 15 cycles = 120 mins/day. That's 500 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "125 hours a year walking.",
                "impactText": "Math error. 8 mins * 15 cycles is 120 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "120 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "8 mins of walking per cycle = 500 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a housing every 47 seconds (Takt Time).\nYour current cycle time to install it is 60 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 47s, you make one every 60s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 60s, you are slower than the 47s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (60s) > Takt Time (47s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (14m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.3 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 14m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 14m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (4m)\n- Weld (15m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 15m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "15.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (4m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 15m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (3m)\n- Sew (19m)\n- Inspect (3m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "20 units, based on the fastest step (Cut).",
                "impactText": "Producing 20 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 19 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "8 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 19m constraint = 3 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (5m)\n- Sew (14m)\n- Inspect (1m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "12 units, based on the fastest step (Cut).",
                "impactText": "Producing 12 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "4 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 14 minute bottleneck = 4 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "11 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 14m constraint = 4 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a bracket every 53 seconds (Takt Time).\nYour current cycle time to install it is 58 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 53s, you make one every 58s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 58s, you are slower than the 53s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (58s) > Takt Time (53s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (5m)\n- Weld (15m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 9 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 15m to 9m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.7 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 9 minute bottleneck = 6.7 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "12.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (5m) does nothing because Weld (9m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 15m to 9m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (27m)\n- Trim (4m)\n\nTo balance the line, you tell the Trimmer to slow down and take 27 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 4m pace and then cross-train or help the Molder for 23m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 4m and Mold takes 27m, the Trimmer has 23m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 27m.",
                "impactText": "While output stays gated, you lost 23 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a bracket every 48 seconds (Takt Time).\nYour current cycle time to install it is 67 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 48s, you make one every 67s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 67s, you are slower than the 48s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (67s) > Takt Time (48s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (3m)\n- Weld (12m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 9 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 5.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 12m to 9m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.7 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 9 minute bottleneck = 6.7 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "20.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (3m) does nothing because Weld (9m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 12m to 9m), the entire line's output increases immediately."
    },
    {
        "scenario": "Before an operator starts, they walk 2 mins to grab tools, 2 mins to get parts, and 4 mins returning.\n(8 mins total walk per cycle).\n\nAt 22 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "733 hours a year walking.",
                "impactText": "Correct! Math: 8 mins * 22 cycles = 176 mins/day. That's 733 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "183 hours a year walking.",
                "impactText": "Math error. 8 mins * 22 cycles is 176 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "176 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "8 mins of walking per cycle = 733 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Before an operator starts, they walk 3 mins to grab tools, 1 mins to get parts, and 4 mins returning.\n(8 mins total walk per cycle).\n\nAt 22 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "733 hours a year walking.",
                "impactText": "Correct! Math: 8 mins * 22 cycles = 176 mins/day. That's 733 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "183 hours a year walking.",
                "impactText": "Math error. 8 mins * 22 cycles is 176 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "176 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "8 mins of walking per cycle = 733 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (4m)\n- Weld (15m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 8 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 15m to 8m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "7.5 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 8 minute bottleneck = 7.5 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "15.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (4m) does nothing because Weld (8m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 15m to 8m), the entire line's output increases immediately."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 3 mins to get parts, and 4 mins returning.\n(8 mins total walk per cycle).\n\nAt 20 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "666 hours a year walking.",
                "impactText": "Correct! Math: 8 mins * 20 cycles = 160 mins/day. That's 666 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "166 hours a year walking.",
                "impactText": "Math error. 8 mins * 20 cycles is 160 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "160 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "8 mins of walking per cycle = 666 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (5m)\n- Weld (16m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 8 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 3.8 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 16m to 8m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "7.5 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 8 minute bottleneck = 7.5 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "12.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (5m) does nothing because Weld (8m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 16m to 8m), the entire line's output increases immediately."
    },
    {
        "scenario": "Before an operator starts, they walk 2 mins to grab tools, 2 mins to get parts, and 4 mins returning.\n(8 mins total walk per cycle).\n\nAt 18 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "600 hours a year walking.",
                "impactText": "Correct! Math: 8 mins * 18 cycles = 144 mins/day. That's 600 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "150 hours a year walking.",
                "impactText": "Math error. 8 mins * 18 cycles is 144 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "144 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "8 mins of walking per cycle = 600 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (4m)\n- Sew (11m)\n- Inspect (2m)\n- Pack (2m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "15 units, based on the fastest step (Cut).",
                "impactText": "Producing 15 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "5 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 11 minute bottleneck = 5 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "12 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 11m constraint = 5 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (14m)\n- Inspect (2m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "4 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 14 minute bottleneck = 4 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "11 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 14m constraint = 4 parts/hr."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 3 mins to get parts, and 4 mins returning.\n(8 mins total walk per cycle).\n\nAt 16 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "533 hours a year walking.",
                "impactText": "Correct! Math: 8 mins * 16 cycles = 128 mins/day. That's 533 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "133 hours a year walking.",
                "impactText": "Math error. 8 mins * 16 cycles is 128 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "128 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "8 mins of walking per cycle = 533 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a bracket every 69 seconds (Takt Time).\nYour current cycle time to install it is 93 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 69s, you make one every 93s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 93s, you are slower than the 69s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (93s) > Takt Time (69s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (23m)\n- Trim (3m)\n\nTo balance the line, you tell the Trimmer to slow down and take 23 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 3m pace and then cross-train or help the Molder for 20m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 3m and Mold takes 23m, the Trimmer has 20m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 23m.",
                "impactText": "While output stays gated, you lost 20 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (3m)\n- Sew (11m)\n- Inspect (1m)\n- Pack (2m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "20 units, based on the fastest step (Cut).",
                "impactText": "Producing 20 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "5 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 11 minute bottleneck = 5 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "14 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 11m constraint = 5 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (5m)\n- Sew (13m)\n- Inspect (2m)\n- Pack (2m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "12 units, based on the fastest step (Cut).",
                "impactText": "Producing 12 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "4 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 13 minute bottleneck = 4 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "10 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 13m constraint = 4 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (13m)\n- Inspect (1m)\n- Pack (2m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "4 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 13 minute bottleneck = 4 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "13 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 13m constraint = 4 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a sensor every 54 seconds (Takt Time).\nYour current cycle time to install it is 67 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 54s, you make one every 67s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 67s, you are slower than the 54s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (67s) > Takt Time (54s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (16m)\n- Inspect (1m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 16 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "10 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 16m constraint = 3 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (12m)\n- Grind (4m)\n\nYou hire a faster Welder who completes their step in 9 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 5.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 12m to 9m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.7 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 9 minute bottleneck = 6.7 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (9m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 12m to 9m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (4m)\n- Weld (12m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 8 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 5.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 12m to 8m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "7.5 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 8 minute bottleneck = 7.5 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "15.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (4m) does nothing because Weld (8m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 12m to 8m), the entire line's output increases immediately."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 3 mins to get parts, and 4 mins returning.\n(8 mins total walk per cycle).\n\nAt 15 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "500 hours a year walking.",
                "impactText": "Correct! Math: 8 mins * 15 cycles = 120 mins/day. That's 500 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "125 hours a year walking.",
                "impactText": "Math error. 8 mins * 15 cycles is 120 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "120 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "8 mins of walking per cycle = 500 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Before an operator starts, they walk 3 mins to grab tools, 2 mins to get parts, and 5 mins returning.\n(10 mins total walk per cycle).\n\nAt 22 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "916 hours a year walking.",
                "impactText": "Correct! Math: 10 mins * 22 cycles = 220 mins/day. That's 916 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "229 hours a year walking.",
                "impactText": "Math error. 10 mins * 22 cycles is 220 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "220 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "10 mins of walking per cycle = 916 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a bracket every 59 seconds (Takt Time).\nYour current cycle time to install it is 79 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 59s, you make one every 79s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 79s, you are slower than the 59s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (79s) > Takt Time (59s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a bracket every 46 seconds (Takt Time).\nYour current cycle time to install it is 61 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 46s, you make one every 61s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 61s, you are slower than the 46s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (61s) > Takt Time (46s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (14m)\n- Inspect (2m)\n- Pack (2m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "4 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 14 minute bottleneck = 4 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "12 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 14m constraint = 4 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (5m)\n- Sew (17m)\n- Inspect (1m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "12 units, based on the fastest step (Cut).",
                "impactText": "Producing 12 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 17 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "9 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 17m constraint = 3 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a bracket every 64 seconds (Takt Time).\nYour current cycle time to install it is 73 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 64s, you make one every 73s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 73s, you are slower than the 64s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (73s) > Takt Time (64s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (4m)\n- Sew (16m)\n- Inspect (4m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "15 units, based on the fastest step (Cut).",
                "impactText": "Producing 15 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 16 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "9 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 16m constraint = 3 parts/hr."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 2 mins to get parts, and 3 mins returning.\n(6 mins total walk per cycle).\n\nAt 22 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "550 hours a year walking.",
                "impactText": "Correct! Math: 6 mins * 22 cycles = 132 mins/day. That's 550 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "137 hours a year walking.",
                "impactText": "Math error. 6 mins * 22 cycles is 132 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "132 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "6 mins of walking per cycle = 550 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a door panel every 46 seconds (Takt Time).\nYour current cycle time to install it is 60 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 46s, you make one every 60s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 60s, you are slower than the 46s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (60s) > Takt Time (46s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (15m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 9 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 15m to 9m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.7 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 9 minute bottleneck = 6.7 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (9m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 15m to 9m), the entire line's output increases immediately."
    },
    {
        "scenario": "Your assembly line requires a housing every 51 seconds (Takt Time).\nYour current cycle time to install it is 62 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 51s, you make one every 62s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 62s, you are slower than the 51s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (62s) > Takt Time (51s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (3m)\n- Weld (16m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 9 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 3.8 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 16m to 9m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.7 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 9 minute bottleneck = 6.7 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "20.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (3m) does nothing because Weld (9m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 16m to 9m), the entire line's output increases immediately."
    },
    {
        "scenario": "Before an operator starts, they walk 2 mins to grab tools, 3 mins to get parts, and 5 mins returning.\n(10 mins total walk per cycle).\n\nAt 15 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "625 hours a year walking.",
                "impactText": "Correct! Math: 10 mins * 15 cycles = 150 mins/day. That's 625 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "156 hours a year walking.",
                "impactText": "Math error. 10 mins * 15 cycles is 150 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "150 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "10 mins of walking per cycle = 625 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (11m)\n- Inspect (1m)\n- Pack (2m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "5 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 11 minute bottleneck = 5 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "15 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 11m constraint = 5 parts/hr."
    },
    {
        "scenario": "Before an operator starts, they walk 2 mins to grab tools, 1 mins to get parts, and 3 mins returning.\n(6 mins total walk per cycle).\n\nAt 21 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "525 hours a year walking.",
                "impactText": "Correct! Math: 6 mins * 21 cycles = 126 mins/day. That's 525 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "131 hours a year walking.",
                "impactText": "Math error. 6 mins * 21 cycles is 126 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "126 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "6 mins of walking per cycle = 525 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 2 mins to get parts, and 3 mins returning.\n(6 mins total walk per cycle).\n\nAt 18 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "450 hours a year walking.",
                "impactText": "Correct! Math: 6 mins * 18 cycles = 108 mins/day. That's 450 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "112 hours a year walking.",
                "impactText": "Math error. 6 mins * 18 cycles is 108 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "108 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "6 mins of walking per cycle = 450 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a door panel every 46 seconds (Takt Time).\nYour current cycle time to install it is 52 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 46s, you make one every 52s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 52s, you are slower than the 46s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (52s) > Takt Time (46s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a motor every 60 seconds (Takt Time).\nYour current cycle time to install it is 74 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 60s, you make one every 74s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 74s, you are slower than the 60s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (74s) > Takt Time (60s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (14m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 9 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.3 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 14m to 9m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.7 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 9 minute bottleneck = 6.7 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (9m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 14m to 9m), the entire line's output increases immediately."
    },
    {
        "scenario": "Before an operator starts, they walk 3 mins to grab tools, 2 mins to get parts, and 5 mins returning.\n(10 mins total walk per cycle).\n\nAt 20 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "833 hours a year walking.",
                "impactText": "Correct! Math: 10 mins * 20 cycles = 200 mins/day. That's 833 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "208 hours a year walking.",
                "impactText": "Math error. 10 mins * 20 cycles is 200 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "200 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "10 mins of walking per cycle = 833 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (22m)\n- Trim (6m)\n\nTo balance the line, you tell the Trimmer to slow down and take 22 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 6m pace and then cross-train or help the Molder for 16m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 6m and Mold takes 22m, the Trimmer has 16m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 22m.",
                "impactText": "While output stays gated, you lost 16 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (5m)\n- Sew (17m)\n- Inspect (3m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "12 units, based on the fastest step (Cut).",
                "impactText": "Producing 12 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 17 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "8 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 17m constraint = 3 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a housing every 47 seconds (Takt Time).\nYour current cycle time to install it is 67 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 47s, you make one every 67s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 67s, you are slower than the 47s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (67s) > Takt Time (47s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (4m)\n- Weld (14m)\n- Grind (4m)\n\nYou hire a faster Welder who completes their step in 8 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.3 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 14m to 8m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "7.5 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 8 minute bottleneck = 7.5 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "15.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (4m) does nothing because Weld (8m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 14m to 8m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (3m)\n- Weld (12m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 8 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 5.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 12m to 8m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "7.5 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 8 minute bottleneck = 7.5 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "20.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (3m) does nothing because Weld (8m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 12m to 8m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (28m)\n- Trim (7m)\n\nTo balance the line, you tell the Trimmer to slow down and take 28 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 7m pace and then cross-train or help the Molder for 21m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 7m and Mold takes 28m, the Trimmer has 21m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 28m.",
                "impactText": "While output stays gated, you lost 21 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a motor every 50 seconds (Takt Time).\nYour current cycle time to install it is 70 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 50s, you make one every 70s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 70s, you are slower than the 50s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (70s) > Takt Time (50s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (5m)\n- Weld (12m)\n- Grind (4m)\n\nYou hire a faster Welder who completes their step in 8 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 5.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 12m to 8m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "7.5 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 8 minute bottleneck = 7.5 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "12.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (5m) does nothing because Weld (8m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 12m to 8m), the entire line's output increases immediately."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 2 mins to get parts, and 3 mins returning.\n(6 mins total walk per cycle).\n\nAt 24 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "600 hours a year walking.",
                "impactText": "Correct! Math: 6 mins * 24 cycles = 144 mins/day. That's 600 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "150 hours a year walking.",
                "impactText": "Math error. 6 mins * 24 cycles is 144 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "144 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "6 mins of walking per cycle = 600 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a bracket every 62 seconds (Takt Time).\nYour current cycle time to install it is 84 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 62s, you make one every 84s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 84s, you are slower than the 62s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (84s) > Takt Time (62s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (3m)\n- Sew (18m)\n- Inspect (3m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "20 units, based on the fastest step (Cut).",
                "impactText": "Producing 20 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 18 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "8 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 18m constraint = 3 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a sensor every 47 seconds (Takt Time).\nYour current cycle time to install it is 69 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 47s, you make one every 69s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 69s, you are slower than the 47s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (69s) > Takt Time (47s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a housing every 54 seconds (Takt Time).\nYour current cycle time to install it is 61 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 54s, you make one every 61s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 61s, you are slower than the 54s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (61s) > Takt Time (54s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (27m)\n- Trim (3m)\n\nTo balance the line, you tell the Trimmer to slow down and take 27 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 3m pace and then cross-train or help the Molder for 24m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 3m and Mold takes 27m, the Trimmer has 24m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 27m.",
                "impactText": "While output stays gated, you lost 24 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Before an operator starts, they walk 2 mins to grab tools, 1 mins to get parts, and 3 mins returning.\n(6 mins total walk per cycle).\n\nAt 19 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "475 hours a year walking.",
                "impactText": "Correct! Math: 6 mins * 19 cycles = 114 mins/day. That's 475 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "118 hours a year walking.",
                "impactText": "Math error. 6 mins * 19 cycles is 114 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "114 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "6 mins of walking per cycle = 475 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (3m)\n- Sew (12m)\n- Inspect (4m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "20 units, based on the fastest step (Cut).",
                "impactText": "Producing 20 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "5 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 12 minute bottleneck = 5 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "10 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 12m constraint = 5 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (3m)\n- Sew (19m)\n- Inspect (2m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "20 units, based on the fastest step (Cut).",
                "impactText": "Producing 20 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 19 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "8 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 19m constraint = 3 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (26m)\n- Trim (3m)\n\nTo balance the line, you tell the Trimmer to slow down and take 26 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 3m pace and then cross-train or help the Molder for 23m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 3m and Mold takes 26m, the Trimmer has 23m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 26m.",
                "impactText": "While output stays gated, you lost 23 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (25m)\n- Trim (4m)\n\nTo balance the line, you tell the Trimmer to slow down and take 25 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 4m pace and then cross-train or help the Molder for 21m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 4m and Mold takes 25m, the Trimmer has 21m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 25m.",
                "impactText": "While output stays gated, you lost 21 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a door panel every 69 seconds (Takt Time).\nYour current cycle time to install it is 76 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 69s, you make one every 76s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 76s, you are slower than the 69s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (76s) > Takt Time (69s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (6m)\n- Sew (16m)\n- Inspect (3m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "10 units, based on the fastest step (Cut).",
                "impactText": "Producing 10 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 16 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "8 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 16m constraint = 3 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a bracket every 48 seconds (Takt Time).\nYour current cycle time to install it is 63 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 48s, you make one every 63s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 63s, you are slower than the 48s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (63s) > Takt Time (48s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a housing every 62 seconds (Takt Time).\nYour current cycle time to install it is 79 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 62s, you make one every 79s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 79s, you are slower than the 62s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (79s) > Takt Time (62s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (5m)\n- Sew (18m)\n- Inspect (2m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "12 units, based on the fastest step (Cut).",
                "impactText": "Producing 12 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 18 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "8 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 18m constraint = 3 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a sensor every 64 seconds (Takt Time).\nYour current cycle time to install it is 69 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 64s, you make one every 69s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 69s, you are slower than the 64s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (69s) > Takt Time (64s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (29m)\n- Trim (7m)\n\nTo balance the line, you tell the Trimmer to slow down and take 29 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 7m pace and then cross-train or help the Molder for 22m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 7m and Mold takes 29m, the Trimmer has 22m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 29m.",
                "impactText": "While output stays gated, you lost 22 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 1 mins to get parts, and 2 mins returning.\n(4 mins total walk per cycle).\n\nAt 21 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "350 hours a year walking.",
                "impactText": "Correct! Math: 4 mins * 21 cycles = 84 mins/day. That's 350 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "87 hours a year walking.",
                "impactText": "Math error. 4 mins * 21 cycles is 84 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "84 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "4 mins of walking per cycle = 350 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Your assembly line requires a housing every 66 seconds (Takt Time).\nYour current cycle time to install it is 74 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 66s, you make one every 74s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 74s, you are slower than the 66s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (74s) > Takt Time (66s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (4m)\n- Weld (14m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.3 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 14m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "15.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (4m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 14m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (16m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 9 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 3.8 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 16m to 9m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.7 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 9 minute bottleneck = 6.7 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (9m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 16m to 9m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (19m)\n- Inspect (4m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 19 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "8 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 19m constraint = 3 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (3m)\n- Weld (15m)\n- Grind (4m)\n\nYou hire a faster Welder who completes their step in 8 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 15m to 8m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "7.5 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 8 minute bottleneck = 7.5 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "20.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (3m) does nothing because Weld (8m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 15m to 8m), the entire line's output increases immediately."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 1 mins to get parts, and 2 mins returning.\n(4 mins total walk per cycle).\n\nAt 22 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "366 hours a year walking.",
                "impactText": "Correct! Math: 4 mins * 22 cycles = 88 mins/day. That's 366 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "91 hours a year walking.",
                "impactText": "Math error. 4 mins * 22 cycles is 88 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "88 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "4 mins of walking per cycle = 366 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (18m)\n- Inspect (3m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 18 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "10 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 18m constraint = 3 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (24m)\n- Trim (3m)\n\nTo balance the line, you tell the Trimmer to slow down and take 24 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 3m pace and then cross-train or help the Molder for 21m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 3m and Mold takes 24m, the Trimmer has 21m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 24m.",
                "impactText": "While output stays gated, you lost 21 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (29m)\n- Trim (4m)\n\nTo balance the line, you tell the Trimmer to slow down and take 29 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 4m pace and then cross-train or help the Molder for 25m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 4m and Mold takes 29m, the Trimmer has 25m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 29m.",
                "impactText": "While output stays gated, you lost 25 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a motor every 57 seconds (Takt Time).\nYour current cycle time to install it is 74 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 57s, you make one every 74s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 74s, you are slower than the 57s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (74s) > Takt Time (57s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (21m)\n- Trim (3m)\n\nTo balance the line, you tell the Trimmer to slow down and take 21 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 3m pace and then cross-train or help the Molder for 18m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 3m and Mold takes 21m, the Trimmer has 18m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 21m.",
                "impactText": "While output stays gated, you lost 18 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (26m)\n- Trim (7m)\n\nTo balance the line, you tell the Trimmer to slow down and take 26 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 7m pace and then cross-train or help the Molder for 19m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 7m and Mold takes 26m, the Trimmer has 19m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 26m.",
                "impactText": "While output stays gated, you lost 19 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a housing every 58 seconds (Takt Time).\nYour current cycle time to install it is 71 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 58s, you make one every 71s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 71s, you are slower than the 58s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (71s) > Takt Time (58s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Before an operator starts, they walk 3 mins to grab tools, 1 mins to get parts, and 4 mins returning.\n(8 mins total walk per cycle).\n\nAt 18 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "600 hours a year walking.",
                "impactText": "Correct! Math: 8 mins * 18 cycles = 144 mins/day. That's 600 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "150 hours a year walking.",
                "impactText": "Math error. 8 mins * 18 cycles is 144 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "144 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "8 mins of walking per cycle = 600 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (28m)\n- Trim (5m)\n\nTo balance the line, you tell the Trimmer to slow down and take 28 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 5m pace and then cross-train or help the Molder for 23m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 5m and Mold takes 28m, the Trimmer has 23m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 28m.",
                "impactText": "While output stays gated, you lost 23 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a bracket every 57 seconds (Takt Time).\nYour current cycle time to install it is 69 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 57s, you make one every 69s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 69s, you are slower than the 57s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (69s) > Takt Time (57s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (5m)\n- Sew (12m)\n- Inspect (4m)\n- Pack (2m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "12 units, based on the fastest step (Cut).",
                "impactText": "Producing 12 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "5 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 12 minute bottleneck = 5 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "10 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 12m constraint = 5 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (28m)\n- Trim (4m)\n\nTo balance the line, you tell the Trimmer to slow down and take 28 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 4m pace and then cross-train or help the Molder for 24m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 4m and Mold takes 28m, the Trimmer has 24m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 28m.",
                "impactText": "While output stays gated, you lost 24 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 1 mins to get parts, and 2 mins returning.\n(4 mins total walk per cycle).\n\nAt 17 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "283 hours a year walking.",
                "impactText": "Correct! Math: 4 mins * 17 cycles = 68 mins/day. That's 283 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "70 hours a year walking.",
                "impactText": "Math error. 4 mins * 17 cycles is 68 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "68 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "4 mins of walking per cycle = 283 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (12m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 5.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 12m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 12m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "Before an operator starts, they walk 3 mins to grab tools, 3 mins to get parts, and 6 mins returning.\n(12 mins total walk per cycle).\n\nAt 23 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "1150 hours a year walking.",
                "impactText": "Correct! Math: 12 mins * 23 cycles = 276 mins/day. That's 1150 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "287 hours a year walking.",
                "impactText": "Math error. 12 mins * 23 cycles is 276 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "276 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "12 mins of walking per cycle = 1150 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (10m)\n- Inspect (4m)\n- Pack (2m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "6 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "13 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 10m constraint = 6 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (5m)\n- Sew (16m)\n- Inspect (2m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "12 units, based on the fastest step (Cut).",
                "impactText": "Producing 12 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "3 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 16 minute bottleneck = 3 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "10 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 16m constraint = 3 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (24m)\n- Trim (7m)\n\nTo balance the line, you tell the Trimmer to slow down and take 24 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 7m pace and then cross-train or help the Molder for 17m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 7m and Mold takes 24m, the Trimmer has 17m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 24m.",
                "impactText": "While output stays gated, you lost 17 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "Your assembly line requires a housing every 47 seconds (Takt Time).\nYour current cycle time to install it is 66 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 47s, you make one every 66s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 66s, you are slower than the 47s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (66s) > Takt Time (47s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (3m)\n- Weld (12m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 5.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 12m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "20.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (3m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 12m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (12m)\n- Inspect (2m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "5 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 12 minute bottleneck = 5 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "12 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 12m constraint = 5 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a motor every 46 seconds (Takt Time).\nYour current cycle time to install it is 55 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 46s, you make one every 55s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 55s, you are slower than the 46s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (55s) > Takt Time (46s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (5m)\n- Weld (16m)\n- Grind (4m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 3.8 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 16m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "12.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (5m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 16m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (6m)\n- Sew (10m)\n- Inspect (2m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "10 units, based on the fastest step (Cut).",
                "impactText": "Producing 10 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "6 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "12 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 10m constraint = 6 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (4m)\n- Weld (15m)\n- Grind (4m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.0 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 15m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "15.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (4m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 15m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (6m)\n- Weld (16m)\n- Grind (4m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 3.8 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 16m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "10.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (6m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 16m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (11m)\n- Inspect (1m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "5 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 11 minute bottleneck = 5 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "16 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 11m constraint = 5 parts/hr."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 2 mins to get parts, and 3 mins returning.\n(6 mins total walk per cycle).\n\nAt 20 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "500 hours a year walking.",
                "impactText": "Correct! Math: 6 mins * 20 cycles = 120 mins/day. That's 500 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "125 hours a year walking.",
                "impactText": "Math error. 6 mins * 20 cycles is 120 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "120 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "6 mins of walking per cycle = 500 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (5m)\n- Sew (15m)\n- Inspect (4m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "12 units, based on the fastest step (Cut).",
                "impactText": "Producing 12 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "4 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 15 minute bottleneck = 4 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "9 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 15m constraint = 4 parts/hr."
    },
    {
        "scenario": "Your assembly line requires a motor every 45 seconds (Takt Time).\nYour current cycle time to install it is 59 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 45s, you make one every 59s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 59s, you are slower than the 45s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (59s) > Takt Time (45s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a sensor every 44 seconds (Takt Time).\nYour current cycle time to install it is 51 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 44s, you make one every 51s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 51s, you are slower than the 44s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (51s) > Takt Time (44s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a motor every 68 seconds (Takt Time).\nYour current cycle time to install it is 74 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 68s, you make one every 74s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 74s, you are slower than the 68s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (74s) > Takt Time (68s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a housing every 61 seconds (Takt Time).\nYour current cycle time to install it is 69 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 61s, you make one every 69s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 69s, you are slower than the 61s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (69s) > Takt Time (61s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "Your assembly line requires a door panel every 50 seconds (Takt Time).\nYour current cycle time to install it is 62 seconds.\n\nWhat happens?",
        "options": [
            {
                "text": "You meet customer demand perfectly.",
                "impactText": "Math error: Customer wants one every 50s, you make one every 62s. You will fall behind.",
                "isOptimal": false
            },
            {
                "text": "You overproduce and create inventory.",
                "impactText": "If it takes you 62s, you are slower than the 50s demand. You underproduce.",
                "isOptimal": false
            },
            {
                "text": "You miss customer delivery targets and require overtime.",
                "impactText": "Correct! If Cycle Time (62s) > Takt Time (50s), you cannot meet demand without adding shifts or improving the process.",
                "isOptimal": true
            }
        ],
        "keyTakeaway": "Cycle Time > Takt Time = Falling Behind. Cycle Time < Takt Time = Overproduction. Aim to match them."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (4m)\n- Sew (12m)\n- Inspect (2m)\n- Pack (1m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "15 units, based on the fastest step (Cut).",
                "impactText": "Producing 15 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "5 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 12 minute bottleneck = 5 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "12 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 12m constraint = 5 parts/hr."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (4m)\n- Weld (13m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 9 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 4.6 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 13m to 9m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.7 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 9 minute bottleneck = 6.7 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "15.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (4m) does nothing because Weld (9m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 13m to 9m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (3m)\n- Weld (16m)\n- Grind (3m)\n\nYou hire a faster Welder who completes their step in 10 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 3.8 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 16m to 10m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.0 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 10 minute bottleneck = 6.0 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "20.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (3m) does nothing because Weld (10m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 16m to 10m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Prep (5m)\n- Weld (16m)\n- Grind (5m)\n\nYou hire a faster Welder who completes their step in 9 minutes.\nWhat is the new hourly output?",
        "options": [
            {
                "text": "It remains 3.8 parts per hour.",
                "impactText": "Incorrect. The bottleneck changed from 16m to 9m, so throughput goes up.",
                "isOptimal": false
            },
            {
                "text": "6.7 parts per hour.",
                "impactText": "Correct! Mathematics: 60 minutes / 9 minute bottleneck = 6.7 units per hour. You elevated the constraint.",
                "isOptimal": true
            },
            {
                "text": "12.0 parts per hour if Prep speeds up.",
                "impactText": "Speeding up Prep (5m) does nothing because Weld (9m) is still the bottleneck.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "When you improve the bottleneck (Weld from 16m to 9m), the entire line's output increases immediately."
    },
    {
        "scenario": "PROCESS MAP:\n- Mold (20m)\n- Trim (4m)\n\nTo balance the line, you tell the Trimmer to slow down and take 20 minutes to look busy. Is this Lean?",
        "options": [
            {
                "text": "Yes, because everyone is working continuously.",
                "impactText": "This is a common trap. You are filling time with artificial work, which masks the imbalance.",
                "isOptimal": false
            },
            {
                "text": "No. The Trimmer should work at a 4m pace and then cross-train or help the Molder for 16m.",
                "impactText": "Correct! Embrace the imbalance. If Trim takes 4m and Mold takes 20m, the Trimmer has 16m of free capacity to help elsewhere.",
                "isOptimal": true
            },
            {
                "text": "It doesn't matter, output is still gated by 20m.",
                "impactText": "While output stays gated, you lost 16 minutes of labor capacity per part doing fake work.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Never stretch work to fill time. If a step is much faster than the bottleneck, utilize that operator's free capacity elsewhere."
    },
    {
        "scenario": "PROCESS MAP:\n- Cut (2m)\n- Sew (13m)\n- Inspect (4m)\n- Pack (3m)\n\nWhat is the maximum throughput of this line in one 60-minute hour?",
        "options": [
            {
                "text": "30 units, based on the fastest step (Cut).",
                "impactText": "Producing 30 units builds a pile of unfinished inventory in front of the Sewer. This is overproduction waste.",
                "isOptimal": false
            },
            {
                "text": "4 units, because the Sew step governs the entire line.",
                "impactText": "Correct! Mathematics: 60 minutes / 13 minute bottleneck = 4 units per hour maximum.",
                "isOptimal": true
            },
            {
                "text": "10 units, the average of all the times.",
                "impactText": "Averages hide the truth in Lean. Throughput is dictated entirely by the slowest constraint, not the average.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "Your system can only produce as fast as its slowest step (The Bottleneck). 60m / 13m constraint = 4 parts/hr."
    },
    {
        "scenario": "Before an operator starts, they walk 1 mins to grab tools, 3 mins to get parts, and 4 mins returning.\n(8 mins total walk per cycle).\n\nAt 21 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "700 hours a year walking.",
                "impactText": "Correct! Math: 8 mins * 21 cycles = 168 mins/day. That's 700 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "175 hours a year walking.",
                "impactText": "Math error. 8 mins * 21 cycles is 168 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "168 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "8 mins of walking per cycle = 700 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    },
    {
        "scenario": "Before an operator starts, they walk 2 mins to grab tools, 3 mins to get parts, and 5 mins returning.\n(10 mins total walk per cycle).\n\nAt 16 cycles a day, what is the annual walk waste? (250 days/yr)",
        "options": [
            {
                "text": "666 hours a year walking.",
                "impactText": "Correct! Math: 10 mins * 16 cycles = 160 mins/day. That's 666 hours a year just walking!",
                "isOptimal": true
            },
            {
                "text": "166 hours a year walking.",
                "impactText": "Math error. 10 mins * 16 cycles is 160 minutes EVERY DAY. It adds up massively.",
                "isOptimal": false
            },
            {
                "text": "160 hours a year walking.",
                "impactText": "Mixed up minutes and hours. But regardless, it's a massive drain on productivity.",
                "isOptimal": false
            }
        ],
        "keyTakeaway": "10 mins of walking per cycle = 666 HOURS a year. A kitting cart beside the operator eliminates weeks of walking waste."
    }
];