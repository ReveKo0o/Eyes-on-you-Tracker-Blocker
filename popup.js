document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleShieldBtn');
  const powerSvg = document.getElementById('powerSvg');
  const countDisplay = document.getElementById('countDisplay');
  const logList = document.getElementById('logList');
  const addWhitelistBtn = document.getElementById('addWhitelistBtn');
  const whitelistList = document.getElementById('whitelistList');

  function updateUI() {
    chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
      if (!response) return;
      
      countDisplay.textContent = response.blockedCount;
      
      if (response.isShieldActive) {
        powerSvg.style.color = "#ff00ff"; // mor
      } else {
        powerSvg.style.color = "#ff3333"; // kırmızı
      }

      //  blocked logs
      if (response.blockedUrls && response.blockedUrls.length > 0) {
        logList.innerHTML = "";
        response.blockedUrls.forEach(url => {
          const div = document.createElement('div');
          div.className = "log-item";
          div.textContent = url;
          logList.appendChild(div);
        });
      } else {
        logList.innerHTML = '<div class="log-item">looking for any trace</div>';
      }

      // show whitelist and remove button 
      if (response.whitelist && response.whitelist.length > 0) {
        whitelistList.innerHTML = "";
        response.whitelist.forEach(domain => {
          const div = document.createElement('div');
          div.className = "whitelist-item";
          div.innerHTML = `<span>${domain}</span> <button class="delete-wl" data-domain="${domain}">✕</button>`;
          whitelistList.appendChild(div);
        });

        //  whitelist confirmation
        document.querySelectorAll('.delete-wl').forEach(delBtn => {
          delBtn.addEventListener('click', (e) => {
            const domainToRemove = e.target.getAttribute('data-domain');
            chrome.runtime.sendMessage({ action: "removeWhitelist", domain: domainToRemove }, () => {
              updateUI();
            });
          });
        });
      } else {
        whitelistList.innerHTML = '<div class="whitelist-item" style="color:#555;">No whitelisted sites</div>';
      }
    });
  }

  updateUI();


  toggleBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "toggleShield" }, () => {
      updateUI();
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    });
  });

  
  addWhitelistBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        try {
          const urlObj = new URL(tabs[0].url);
          const domain = urlObj.hostname;
          if (!domain) return;

          chrome.runtime.sendMessage({ action: "addWhitelist", domain: domain }, (response) => {
            if (response && response.success) {
              updateUI();
              chrome.tabs.reload(tabs[0].id); // Sayfayı yenile ki reklam engelleyici o sitede tamamen devre dışı kalsın
            }
          });
        } catch (err) {
          console.error("Invalid URL");
        }
      }
    });
  });
});
