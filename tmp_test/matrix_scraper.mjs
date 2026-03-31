import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const SCREENS = [
    { name: 'Portal', hash: '#/portal' },
    { name: 'Motion Mapper', hash: '#/motion-v2' },
    { name: 'Idea Engine', hash: '#/idea-engine' },
    { name: 'Lean Academy', hash: '#/lean-academy' },
    { name: 'Value Scanner', hash: '#/value-scanner' },
    { name: 'Process Check', hash: '#/process-check' },
    { name: 'Time Study', hash: '#/time-study' }
];

const VIEWPORTS = [
    { name: 'Desktop_Landscape', width: 1920, height: 1080, isMobile: false },
    { name: 'Tablet_Portrait', width: 768, height: 1024, isMobile: true },
    { name: 'Mobile_Portrait', width: 390, height: 844, isMobile: true, hasTouch: true },
    { name: 'Mobile_Landscape', width: 844, height: 390, isMobile: true, hasTouch: true }
];

(async () => {
    console.log('Starting Visual matrix crawler...');
    
    // Create gallery folder
    const outputDir = path.resolve('tmp_test/gallery');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    let mdOutput = '# Visual Testing Matrix Gallery\n\n';

    for (const view of VIEWPORTS) {
        mdOutput += `## Device: ${view.name} (${view.width}x${view.height})\n\n`;
        mdOutput += `\`\`\`carousel\n`;
        
        await page.setViewport({ width: view.width, height: view.height, isMobile: view.isMobile, hasTouch: view.hasTouch || false });
        
        let first = true;
        for (const screen of SCREENS) {
            console.log(`Testing [${view.name}] -> ${screen.name}`);
            
            // Go to base to clear states
            await page.goto(`http://localhost:5173/portal?v=2${screen.hash}`, { waitUntil: 'networkidle0' });
            
            // Bypass splash if present
            await page.evaluate(async () => {
                const splashBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('GO TO THE GEMBA'));
                if (splashBtn) splashBtn.click();
            });
            
            // Wait for internal hydration
            await new Promise(r => setTimeout(r, 2000));
            
            // Take Screenshot
            const fileName = `${view.name.replace(' ', '_')}_${screen.name.replace(' ', '_')}.png`;
            const filePath = path.join(outputDir, fileName);
            await page.screenshot({ path: filePath, fullPage: true });
            
            if (!first) mdOutput += `<!-- slide -->\n`;
            first = false;
            
            // Output absolute path for the AI to display in the walkthrough
            mdOutput += `![${view.name} - ${screen.name}](file:///${filePath.replace(/\\/g, '/')})\n`;
        }
        mdOutput += `\`\`\`\n\n`;
    }

    await browser.close();
    
    // Save the markdown template for the Walkthrough Generator
    fs.writeFileSync(path.join(outputDir, 'report.md'), mdOutput);
    console.log('✅ QA Matrix complete! Saved to ' + outputDir);

})();
