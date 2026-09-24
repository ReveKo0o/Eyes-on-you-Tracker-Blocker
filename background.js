let isShieldActive = true;
let blockedCount = 0;
let blockedUrls = [];

// Whitelist default
let whitelist = [
  "github.com",
  "githubusercontent.com"
];

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
  "pagead2.googlesyndication.com"
];

// catch and block 
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (!isShieldActive) return { cancel: false };

    const url = details.url;
    const initiator = details.initiator || "";

    // whitelist control
    const isWhitelisted = whitelist.some(domain => initiator.includes(domain) || url.includes(domain));
    if (isWhitelisted) {
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
    sendResponse({ isShieldActive, blockedCount, blockedUrls, whitelist });
  } else if (request.action === "toggleShield") {
    isShieldActive = !isShieldActive;
    sendResponse({ isShieldActive });
  } else if (request.action === "addWhitelist") {
    if (request.domain && !whitelist.includes(request.domain)) {
      whitelist.push(request.domain);
    }
    sendResponse({ success: true, whitelist });
  } else if (request.action === "removeWhitelist") {
    whitelist = whitelist.filter(d => d !== request.domain);
    sendResponse({ success: true, whitelist });
  }
  return true;
});
