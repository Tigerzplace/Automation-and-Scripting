chrome.action.onClicked.addListener(async () => {
  chrome.windows.getLastFocused(null, function () {
    chrome.tabs.query({ active: true, highlighted: true }, function (tab) {
      var currentHost = getHostName(tab[0].url);
      if (currentHost == 'x.com') {

        // Save the tabId in chrome.storage
        chrome.storage.local.set({ tabId: tab[0].id }, function () {
          console.log('Tab ID is set to ' + tab[0].id);
        });

        closeWindowsByTitle("Tweet AutoLiker");
        // Open the popup

        chrome.windows.create({
          url: chrome.runtime.getURL("popup.html"),
          type: "popup",
          width: 400,
          height: 550
        });

        // Function to close all windows by title
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

      } else {
        console.log('No tab with x.com found in the current window.');
        // Open the popup
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
function sendTabId(id) {
  chrome.runtime.sendMessage({ action: "tab", tab_id: id });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateBadge') {

    chrome.action.setBadgeText({ text: request.count.toString() });


  } else if (request.action === 'clearBadge') {
    chrome.action.setBadgeText({ text: '' });
  }


  if (request.action === 'user_message') {
    //chrome.action.setBadgeText({ text: request.count.toString() });
    // console.log("background received to be forward to content.js");

    chrome.runtime.sendMessage(request.newText.toString());
  }


  if (request.action === 'total_done') {
    //chrome.action.setBadgeText({ text: request.count.toString() });
    // console.log("background received to be forward to content.js");
    console.log("Received total_done and forwarded to contentScript");
    chrome.runtime.sendMessage(request.newText.toString());
  }

})

function logCall(number) {
  console.log(`background.js - Call number: ${number}`);
}


// Function to check if any tab in the current window has the host x.com open
async function checkForXCom() {
  chrome.windows.getLastFocused(null, function () {
    chrome.tabs.query({ active: true, highlighted: true }, function (tab) {
      console.log(tab);
      var currentHost = getHostName(tab[0].url);
      if (currentHost == 'x.com') {
        return tab[0].id;
      } else {
        console.log('No tab with x.com found in the current window.');
        return 0;
      }
    });
  });
}

function getHostName(hostName) {
  var match = hostName.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {

    return match[2];
  }
  else {

    return null;
  }
}


