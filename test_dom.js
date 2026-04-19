const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
dom.window.document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const sec = dom.window.document.getElementById('roi-calculator-section');
        console.log("Section HTML length:", sec ? sec.innerHTML.length : "NOT FOUND");
        console.log("Errors:", dom.window.errors ? dom.window.errors : "None captured");
        process.exit(0);
    }, 2000); // give it time
});
