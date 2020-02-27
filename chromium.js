const chrome = require('chrome-aws-lambda');
//const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-core');

async function getScreenshot(url, type, quality, fullPage) {
    const browser = await puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
        waitUntil: 'networkidle2',
    });


    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 1000 })
    console.log(url)
    await page.goto(url, { "waitUntil": "networkidle2" });
    await page.evaluate(async () => {
        const selectors = Array.from(document.querySelectorAll("iframe"));
        await Promise.all(selectors.map(img => {
            if (img.complete) return;
            return new Promise((resolve, reject) => {
                img.addEventListener('load', resolve);
            });
        }));
    })
    const file = await page.screenshot({ type, quality, fullPage });
    await browser.close();
    return file;
}

module.exports = { getScreenshot };