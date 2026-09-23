let isShieldActive = true;
let blockedCount = 0;
let blockedUrls = [];

// this part does the same thing as uBlockorigin
const blockedPatterns = [
  "google-analytics.com",
  "googletagmanager.com",
  "hotjar.com",
  "doubleclick.net",
  "facebook.net",
  "adnxs.com",
  "criteo.com",
  "analytics",
  "tracker",
  "ads",
  "telemetry",
  "pixel",
  "stats",
  "banner",
  "fakepage.html",
  "collect",
  "metrics",
  "ping",
  "syndication",
  "s.youtube.com",
  "youtube.com/api/stats/ads",
  "youtube.com/pagead",
  "googleads.g.doubleclick.net",
  "static.doubleclick.net",
  "pagead2.googlesyndication.com",
  "google-analytics.com",
  "googletagmanager.com"

];

// catch and block 
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (!isShieldActive) return { cancel: false };

    const url = details.url;
    // not block anything about github
    if (url.includes("github.com") || url.includes("githubusercontent.com")) {
      return { cancel: false };
      }
    // check for log
    const isBlocked = blockedPatterns.some(pattern => url.includes(pattern));

    if (isBlocked) {
      blockedCount++;
      // add blocked things into the list (max 30)
      blockedUrls.unshift(url);
      if (blockedUrls.length > 30) blockedUrls.pop();
      
      return { cancel: true }; //block
    }
    
    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getStatus") {
    sendResponse({ isShieldActive, blockedCount, blockedUrls });
  } else if (request.action === "toggleShield") {
    isShieldActive = !isShieldActive;
    sendResponse({ isShieldActive });
  }
  return true;
});
