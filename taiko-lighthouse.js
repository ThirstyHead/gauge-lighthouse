
const lighthouse = require('lighthouse/core/index.cjs');
const { openBrowser, goto, closeBrowser } = require('taiko');
(async () => {
    try {
        await openBrowser();
        await goto('https://gauge.org');
    } catch (error) {
        console.error(error);
    } finally {
        await closeBrowser();
    }
})();
