document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['factCheckResults', 'lastSelection'], data => {
      let autoDiv = document.getElementById('autoResults');
      (data.factCheckResults || []).forEach(item => {
        let div = document.createElement('div');
        div.className = `result ${item.verdict}`;
        div.textContent = `"${item.text.substring(0,50)}..." → ${item.verdict}`;
        autoDiv.appendChild(div);
      });
  
      let manDiv = document.getElementById('manualResult');
      if (data.lastSelection) {
        let div = document.createElement('div');
        div.className = `result ${data.lastSelection.label}`;
        div.textContent = `Selection: ${data.lastSelection.label} (${Math.round(data.lastSelection.score * 100)}%)`;
        manDiv.appendChild(div);
      }
    });
  });
  