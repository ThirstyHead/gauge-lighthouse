
const lighthouse = require('lighthouse/core/index.cjs');
const {
    openBrowser,
    closeBrowser,
    goto,
    currentURL,
    client
} = require('taiko');
const fs = require('fs');

(async () => {
    try {
        await openBrowser();
        await goto('https://gauge.org');

        //Lighthouse
        let url = await currentURL();
        const port = await client()
                           .webSocketUrl.split('/devtools/')[0]
                           .replace('ws://', '')
                           .split(':')[1];
        const options = {output: 'html', onlyCategories: ['accessibility'], port, logLevel:'error'};
        let runnerResult = await lighthouse(url, options);
        fs.writeFileSync(`gauge-lighthouse-audit-from-taiko.html`, runnerResult.report);
        console.log('Report written for', runnerResult.lhr.finalUrl);
        console.log('Accessibility score was', runnerResult.lhr.categories.accessibility.score * 100);
    
    } catch (error) {
        console.error(error);
    } finally {
        await closeBrowser();
    }
})();
