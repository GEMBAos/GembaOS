import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        let filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(filePath));
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) { 
            results.push(filePath);
        }
    });
    return results;
}

const files = walk('./src');
let count = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let dirty = false;
    
    // Nuke inline purple and replace with neutral gray/white
    if (/#8b5cf6/g.test(content)) {
        content = content.replace(/#8b5cf6/g, '#71717a'); // Zinc-500 neutral gray
        dirty = true;
    }
    
    if (dirty) {
        fs.writeFileSync(file, content);
        count++;
        console.log('Nuked purple in:', file);
    }
});

console.log(`Purged purple from ${count} files.`);
