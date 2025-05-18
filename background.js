chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "factCheckSelection",
      title: "Fact-check selection",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "factCheckSelection") {
      const text = info.selectionText;
      if (text) {
        factCheckText(text).then(result => {
          chrome.storage.local.set({ lastSelection: result });
        });
      }
    }
  });
  
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "scanPosts") {
      let postsToCheck = message.posts.slice(0, 5);
      let results = [];
  
      postsToCheck.forEach(async (text) => {
        let res = await factCheckText(text);
        results.push({ text, verdict: res.label, details: res });
        chrome.storage.local.set({ factCheckResults: results });
      });
    }
  });
  
  async function factCheckText(text) {
    let { hfApiKey } = await chrome.storage.local.get('hfApiKey');
    if (!hfApiKey) {
      return { label: "unknown", score: 0, explanation: "API key missing." };
    }
  
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: text,
          parameters: { candidate_labels: ["True", "Misleading", "Inconclusive"] }
        })
      }
    );
    const json = await response.json();
    return { label: json.labels[0], score: json.scores[0], details: json };
  }
  