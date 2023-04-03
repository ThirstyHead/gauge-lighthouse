/* globals gauge*/
"use strict";
const path = require('path');
const {
    openBrowser,
    closeBrowser,
    goto,
    currentURL,
    client
} = require('taiko');
const assert = require("assert");
const headless = process.env.headless_chrome.toLowerCase() === 'true';

//////////////////////////
// Lighthouse integration
//////////////////////////
// const lighthouse = require('lighthouse');
// import {lighthouse} from 'lighthouse';
const lighthouse = require('lighthouse/core/index.cjs');
const fs = require('fs');

beforeSuite(async () => {
    await openBrowser({
        headless: headless
    })
});

afterSuite(async () => {
    await closeBrowser();
});

// Return a screenshot file name
gauge.customScreenshotWriter = async function () {
    const screenshotFilePath = path.join(process.env['gauge_screenshots_dir'],
        `screenshot-${process.hrtime.bigint()}.png`);

    await screenshot({
        path: screenshotFilePath
    });
    return path.basename(screenshotFilePath);
};

step("Visit <url>", async (url) => {
    try{
        await goto(url, {timeout:60000});
    } catch(e){ 
        console.log(e.message);
    }
});

step("Lighthouse report <filename>", async (filename) => {
    let url = await currentURL();
    const port = await client()
                       .webSocketUrl.split('/devtools/')[0]
                       .replace('ws://', '')
                       .split(':')[1];
    const options = {output: 'html', onlyCategories: ['accessibility'], port, logLevel:'error'};
    let runnerResult = await lighthouse(url, options);
    fs.writeFileSync(`${filename}.html`, runnerResult.report);
    console.log('Report written for', runnerResult.lhr.finalUrl);
    console.log('Accessibility score was', runnerResult.lhr.categories.accessibility.score * 100);
});
