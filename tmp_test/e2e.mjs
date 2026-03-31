import puppeteer from 'puppeteer';

(async () => {
    console.log('Launching Host browser...');
    const hostBrowser = await puppeteer.launch({ headless: true });

    try {
        const hostPage = await hostBrowser.newPage();
        await hostPage.goto('http://localhost:5173/portal?v=2#/portal', { waitUntil: 'networkidle0' });

        await hostPage.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('GO TO THE GEMBA'));
            if(btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 1000));

        await hostPage.evaluate(() => {
            const items = document.querySelectorAll('*');
            for(let i=0; i<items.length; i++) {
                if(items[i].textContent === 'MOTION MAPPING') {
                    items[i].closest('.card')?.click();
                    break;
                }
            }
        });
        await new Promise(r => setTimeout(r, 1000));

        await hostPage.evaluate(() => {
            const items = document.querySelectorAll('h2');
            for(let i=0; i<items.length; i++) {
                if(items[i].textContent === 'HOST NEW SESSION') {
                    items[i].parentElement.click();
                    break;
                }
            }
        });
        await new Promise(r => setTimeout(r, 1000));

        await hostPage.evaluate(() => {
            const input = document.querySelector('input[type="text"]');
            if(input) input.value = 'E2E Test Area';
            
            const items = document.querySelectorAll('div');
            for(let i=0; i<items.length; i++) {
                if(items[i].textContent === 'BLANK CANVAS') {
                    items[i].parentElement.click();
                    break;
                }
            }
        });
        await new Promise(r => setTimeout(r, 500));
        
        await hostPage.evaluate(() => {
            const btns = document.querySelectorAll('button');
            for(let i=0; i<btns.length; i++) {
                if(btns[i].textContent.includes('LAUNCH SESSION')) {
                    btns[i].click();
                    break;
                }
            }
        });
        
        // Wait up to 5 seconds for the Access Code
        let accessCode = null;
        for(let attempt=0; attempt<10; attempt++) {
            await new Promise(r => setTimeout(r, 1000));
            accessCode = await hostPage.evaluate(() => {
                const divs = document.querySelectorAll('div');
                for(let i=0; i<divs.length; i++) {
                    if (divs[i].textContent.trim() === 'Direct Join Code:') {
                        return divs[i].nextElementSibling.textContent.trim();
                    }
                }
                return null;
            });
            if (accessCode) break;
        }

        if (!accessCode) {
            const html = await hostPage.evaluate(() => document.body.innerHTML);
            console.error('FAILED TO FIND JOIN CODE! \n\n=== HTML DUMP ===\n', html.substring(0, 1500));
            throw new Error('Failed to create host session or find join code.');
        }
        console.log('✅ Host Session Created! Join Code:', accessCode);

    } catch (e) {
        console.error('Test Failed:', e);
    } finally {
        await hostBrowser.close();
    }
})();
