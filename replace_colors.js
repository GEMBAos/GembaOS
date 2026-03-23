import { readFileSync, writeFileSync } from 'fs';

const file = 'src/components/tools/GoalGapMonitor.tsx';
let content = readFileSync(file, 'utf8');

// Replace standard backgrounds
content = content.replace(/rgba\(15, 23, 42, 0\.6\)/g, 'var(--bg-panel)');
content = content.replace(/rgba\(0,0,0,0\.3\)!important/g, 'var(--bg-dark)!important');
content = content.replace(/rgba\(0,0,0,0\.5\)!important/g, 'var(--bg-dark)!important');

// Replace standard texts
content = content.replace(/#64748b/g, 'var(--text-muted)');
content = content.replace(/#cbd5e1/g, 'var(--text-main)');
content = content.replace(/#94a3b8/g, 'var(--text-muted)');
content = content.replace(/#f8fafc/g, 'var(--text-main)');

// Replace standard borders
content = content.replace(/#475569!important/g, 'var(--border-color)!important');

// Branding
content = content.replace(/#38bdf8/g, 'var(--zone-yellow)');
content = content.replace(/#0284c7!important/g, 'var(--zone-yellow)!important');

// Ensure the main VFD output panel background isn't pure black if it contrasts weirdly, but #050608 is actually fine for industrial.

writeFileSync(file, content);
console.log('Replaced colors in GoalGapMonitor.tsx');
