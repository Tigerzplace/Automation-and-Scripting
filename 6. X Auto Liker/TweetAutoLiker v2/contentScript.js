console.log('Content script executed.');
chrome.runtime.onMessage.addListener(fromPopup);
let likesDone = 0;

async function mainBody() {
  await delay(1000);
  const alreadyLikedCount = await likeTweets();
  const removedCount = await removeReplies();

  if (removedCount === 0 && alreadyLikedCount === 0) {
    const clickReturn = await clickFunction();
    if (clickReturn) {
      await delay(3000);
      likesDone++;
      chrome.runtime.sendMessage({ action: "total_done", newText: "" + likesDone });
    } else {
      console.log("Clicking failed, retrying...");
    }
  } else {
    chrome.runtime.sendMessage({ action: "user_message", newText: "Clearing already liked and replies." });
    await mainBody();
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function trackSvgElementsByPathAttributes() {
  const matchedSvgElements = [];
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svgElement => {
    const pathElement = svgElement.querySelector('path');
    if (pathElement && pathElement.getAttribute('d') === 'M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z') {
      matchedSvgElements.push(svgElement);
    }
  });
  return matchedSvgElements;
}

async function clickFunction() {
  return new Promise((resolve, reject) => {
    try {
      const trackedSvgElements = trackSvgElementsByPathAttributes();
      if (trackedSvgElements.length > 0) {
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        trackedSvgElements[0].dispatchEvent(clickEvent);
        chrome.runtime.sendMessage({ action: "user_message", newText: "Liked 👍" });
        resolve(1);
      } else {
        console.error('Error: No valid SVG elements found for clicking.');
        resolve(0);
      }
    } catch (e) {
      reject(`Error: ${e}`);
    }
  });
}

async function removeReplies() {
  const articleElements = document.querySelectorAll('article');
  let removedCount = 0;
  for (let i = 0; i < articleElements.length; i++) {
    let articleElement = articleElements[i];
    if (articleElement.textContent.includes('Replying to')) {
      articleElement.style.backgroundColor = 'black';
      await delay((i + 2) * 1000);
      articleElement.remove();
      removedCount++;
    }
  }
  if (removedCount) {
    chrome.runtime.sendMessage({ action: "user_message", newText: `↩ : ${removedCount}` });
  }
  return removedCount;
}

async function likeTweets() {
  const articleElements = document.querySelectorAll('article');
  let removedCount = 0;
  for (let i = 0; i < articleElements.length; i++) {
    let articleElement = articleElements[i];
    const unlikeButton = articleElement.querySelector('button[role="button"][data-testid="unlike"]');
    if (unlikeButton) {
      articleElement.style.backgroundColor = 'green';
      await delay((i + 2) * 1000);
      articleElement.remove();
      removedCount++;
    }
  }
  if (removedCount) {
    chrome.runtime.sendMessage({ action: "user_message", newText: `removed: ${removedCount}` });
  }
  return removedCount;
}

function fromPopup(request, sender, sendResponse) {
  if (request.action == 'like') {
    mainBody();
  } else if (request.action == 'end') {
    likesDone = 0;
  } else if (request.action == 'stop') {
    console.log(`Action received: ${request.action}`);
  }
}