chrome.action.onClicked.addListener(async () => {
  chrome.windows.getLastFocused(null, () => {
    chrome.tabs.query({ active: true, highlighted: true }, (tab) => {
      const currentHost = getHostName(tab[0].url);
      if (currentHost === 'x.com') {
        chrome.storage.local.set({ tabId: tab[0].id }, () => {
          console.log(`Tab ID is set to ${tab[0].id}`);
        });
        closeWindowsByTitle("Tweet AutoLiker");
        chrome.windows.create({
          url: chrome.runtime.getURL("popup.html"),
          type: "popup",
          width: 400,
          height: 550
        });
      } else {
        console.log('No tab with x.com found in the current window.');
        chrome.windows.create({
          url: chrome.runtime.getURL("noTarget.html"),
          type: "popup",
          width: 338,
          height: 343
        });
      }
    });
  });
});

function closeWindowsByTitle(title) {
  chrome.windows.getAll({ populate: true }, (windows) => {
    windows.forEach((win) => {
      win.tabs.forEach((tab) => {
        if (tab.title.includes(title)) {
          chrome.windows.remove(win.id, () => {
            if (chrome.runtime.lastError) {
              console.error(`Error closing window ${win.id}: ${chrome.runtime.lastError.message}`);
            } else {
              console.log(`Window with title "${title}" closed successfully.`);
            }
          });
        }
      });
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateBadge') {
    chrome.action.setBadgeText({ text: request.count.toString() });
  } else if (request.action === 'clearBadge') {
    chrome.action.setBadgeText({ text: '' });
  } else if (request.action === 'user_message' || request.action === 'total_done') {
    chrome.runtime.sendMessage(request.newText.toString());
  }
});

function getHostName(url) {
  const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  return match && match[2] ? match[2] : null;
}