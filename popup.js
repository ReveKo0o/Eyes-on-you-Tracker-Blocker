document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleShieldBtn');
  const powerSvg = document.getElementById('powerSvg');
  const countDisplay = document.getElementById('countDisplay');
  const logList = document.getElementById('logList');

  function updateUI() {
    chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
      if (!response) return;
      
      countDisplay.textContent = response.blockedCount;
      
      // on purple, off red its tested with other colors u change however if u want 
      if (response.isShieldActive) {
        powerSvg.style.color = "#ff00ff"; // purp
      } else {
        powerSvg.style.color = "#ff3333"; // red
      }

      if (response.blockedUrls && response.blockedUrls.length > 0) {
        logList.innerHTML = "";
        response.blockedUrls.forEach(url => {
          const div = document.createElement('div');
          div.className = "log-item";
          div.textContent = url;
          logList.appendChild(div);
        });
      } else {
        logList.innerHTML = '<div class="log-item">No log rn.</div>';
      }
    });
  }

  updateUI();

  // refresh thing down there 
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
});