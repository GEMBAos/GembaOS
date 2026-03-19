const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const archiveRoot = path.join(srcDir, 'project_archive');
const dirs = [
    path.join(archiveRoot, 'legacy_ui'),
    path.join(archiveRoot, 'unused_modules'),
    path.join(archiveRoot, 'experimental_features'),
    path.join(archiveRoot, 'hold_for_adaptation')
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const filesToArchive = [
    // Hubs
    { src: 'components/TrainingHub.tsx', dest: 'unused_modules', desc: 'Used for training curriculum delivery.' },
    { src: 'components/PerspectiveHub.tsx', dest: 'unused_modules', desc: 'Used for 3D spatial viewing.' },
    { src: 'components/ExecutionHub.tsx', dest: 'unused_modules', desc: 'Used for execution tracking and projects.' },
    { src: 'components/KamishibaiHub.tsx', dest: 'unused_modules', desc: 'Used for Kamishibai auditing.' },
    { src: 'components/CommunityHub.tsx', dest: 'unused_modules', desc: 'Used for social community features.' },
    { src: 'components/SignageHub.tsx', dest: 'unused_modules', desc: 'Used for digital signage displays.' },
    { src: 'components/ProjectCharter.tsx', dest: 'unused_modules', desc: 'Used to display project charter info.' },
    { src: 'components/RoadmapView.tsx', dest: 'unused_modules', desc: 'Used for longer term roadmap viewing.' },
    { src: 'components/QRHub.tsx', dest: 'unused_modules', desc: 'Used for QR code routing and location interactions.' },
    { src: 'components/ReportOut.tsx', dest: 'unused_modules', desc: 'Used for generating PDF or visual report outs.' },
    { src: 'components/AdminTools.tsx', dest: 'unused_modules', desc: 'Used for developer/admin backdoors.' },
    
    // Tools
    { src: 'components/tools/A3Template.tsx', dest: 'legacy_ui', desc: 'Used as an A3 problem-solving digital form.' },
    { src: 'components/tools/AcronymDictionary.tsx', dest: 'unused_modules', desc: 'Used as a dictionary for Lean acronyms.' },
    { src: 'components/tools/ActionItems.tsx', dest: 'unused_modules', desc: 'Used to track action tasks.' },
    { src: 'components/tools/CommunicationBestPractices.tsx', dest: 'unused_modules', desc: 'Used for communication guidelines.' },
    { src: 'components/tools/DailyGembaGrid.tsx', dest: 'unused_modules', desc: 'Used for daily challenge tracking.' },
    { src: 'components/tools/FinishedUnitMap.tsx', dest: 'unused_modules', desc: 'Used for tracking finished goods location mapping.' },
    { src: 'components/tools/FiveWhys.tsx', dest: 'unused_modules', desc: 'Used for 5-Whys root cause analysis.' },
    { src: 'components/tools/GanttChart.tsx', dest: 'unused_modules', desc: 'Used for Gantt schedule tracking.' },
    { src: 'components/tools/HardwareConsoleLayout.tsx', dest: 'legacy_ui', desc: 'Previous responsive framework structure.' },
    { src: 'components/tools/KPIDictionary.tsx', dest: 'unused_modules', desc: 'Used for defining KPIs.' },
    { src: 'components/tools/KPITracker.tsx', dest: 'unused_modules', desc: 'Used for KPI tracking charts.' },
    { src: 'components/tools/LSWBuilder.tsx', dest: 'unused_modules', desc: 'Used for building Leader Standard Work.' },
    { src: 'components/tools/LeanAcademy.tsx', dest: 'unused_modules', desc: 'Used as an embedded learning module.' },
    { src: 'components/tools/LocationAnalytics.tsx', dest: 'unused_modules', desc: 'Used for spatial analytics.' },
    { src: 'components/tools/PCMacroBuilder.tsx', dest: 'unused_modules', desc: 'Used for building PC macros/automation scripts mentally.' },
    { src: 'components/tools/TodayChallengeCard.tsx', dest: 'unused_modules', desc: 'Used for daily challenges.' },
    { src: 'components/tools/WeeklyBingoCard.tsx', dest: 'unused_modules', desc: 'Used as a gamified bingo card.' },
    
    // Hold for Adaptation
    { src: 'components/tools/LineBalanceBuilder.tsx', dest: 'hold_for_adaptation', desc: 'Currently holding for future modular adaptation.' },
    { src: 'components/tools/ProcessMap.tsx', dest: 'hold_for_adaptation', desc: 'Currently holding for future process mapping tool pieces.' },
    { src: 'components/tools/ValueStreamMap.tsx', dest: 'hold_for_adaptation', desc: 'Currently holding for VSM piece adaptation.' },
    { src: 'components/tools/DefectGuard.tsx', dest: 'hold_for_adaptation', desc: 'Currently holding for defect capture capability.' }
];

filesToArchive.forEach(file => {
    const fullPath = path.join(srcDir, file.src);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        const comment = `/**\n * ARCHIVE NOTICE\n * Original Use: ${file.desc}\n * Moved to: ${file.dest}\n */\n\n`;
        content = comment + content;
        
        const destPath = path.join(archiveRoot, file.dest, path.basename(file.src));
        fs.writeFileSync(destPath, content);
        fs.unlinkSync(fullPath);
        console.log(`Moved ${file.src} to ${file.dest}`);
    } else {
        console.log(`Warning: File not found ${file.src}`);
    }
});

console.log('Archive completed.');
