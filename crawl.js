const { JSDOM } = require('jsdom');

const brokenurls = [];

function getURLsfromHTML(htmlBody, baseURL) {
    var newBaseURL = null;
    const urls = [];    
    const dom = new JSDOM(htmlBody);
    dom.window.document.querySelectorAll('a').forEach((a) => {
        const href = a.getAttribute('href');
        if (!href) {
            return;
        }
        if ((href.slice(0, 1) === '/') || (href.slice(0, 1) === '#')) {
            //relative path
            try {
                if (baseURL.slice(-1) === '/') {
                    newBaseURL = baseURL.slice(0, -1);
                } else {
                    newBaseURL = baseURL;
                }
                console.log(`Checking Crawling ${newBaseURL}${href}`);
                const urlobj = new URL(`${newBaseURL}${href}`);
                urls.push(urlobj.href);
            } catch (err) {
                console.log(`Error with relative URL - - - > ${err.message}`);
                brokenurls.push(`${newBaseURL}${href}`);
            }
        } else {
            //absolute path
            try {
                console.log(`Checking Crawling ${href}`);
                const urlobj = new URL(href);
                urls.push(urlobj.href);
            } catch (err) {
                console.log(`Error with absolute URL - - - >  ${err.message}`);
            }
        }
    });
    return urls;
}


function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    if (hostPath.length > 0 && hostPath.endsWith('/')) {
        return hostPath.slice(0, -1);
    }
    return hostPath;
}

module.exports = {
    normalizeURL,
    getURLsfromHTML
}