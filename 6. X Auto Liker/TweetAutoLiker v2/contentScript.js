console.log('Content script executed.');
chrome.runtime.onMessage.addListener(fromPopup);
let likesDone = 0;

async function mainBody() {
  const alreadyLikedCount = await removelikedTweets();
  console.log(`alreadyLikedCount: ${alreadyLikedCount}`);
  const removedCount = await removeReplies();
  console.log(`removedCount: ${removedCount}`);
  await delay(1000);
  if (!removedCount && !alreadyLikedCount) {
    console.log(`!removedCount && !alreadyLikedCoun`);
    const clickReturn = await clickFunction();
    console.log(`clickReturn: ${clickReturn}`);
    if (clickReturn) {
      await delay(1000);
      likesDone++;
      chrome.runtime.sendMessage({ action: "total_done", newText: "" + likesDone });
    } else {
      console.log("Clicking failed, retrying...");
    }
  } else {
    chrome.runtime.sendMessage({ action: "user_message", newText: "Clearing already liked and replies." });
     setTimeout(mainBody, 1000);
  } // removedCount === 0
} // main


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



async function clickFunction() {
  return new Promise((resolve, reject) => {
    try {
      let liked = false;
      const svgElements = document.querySelectorAll('svg');
      console.log(`svgElements: ${svgElements.length}`);
      const pathElement = document.querySelector('svg path[d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"]');
      if (pathElement) {
        const svgElement = pathElement.closest('svg');
        if (svgElement) {
          console.log(`Matched SVG element found`);
          svgElement.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          chrome.runtime.sendMessage({ action: "user_message", newText: "Liked 👍" });
          liked = true;
        }
      } // if pathElement
      if (!liked) {
        console.error('Error: No valid SVG elements found for clicking.');
      }
      resolve(liked);
    } catch (e) {
      reject(`Error: ${e}`);
    }
  });
}

async function removeReplies() {
  console.log('removeReplies');
  return new Promise((resolve, reject) => {

      const articleElements = Array.from(document.querySelectorAll('article'));
      let removedCount = 0;
      console.log(`removeReplies: ${articleElements.length}`);
      articleElements.forEach(articleElement => {
        if (articleElement.textContent.includes('Replying to')) {
          articleElement.style.backgroundColor = 'black';
          articleElement.remove();
          delay(1000);
          removedCount++;
        }
      });

      if (removedCount) {
        chrome.runtime.sendMessage({ action: "user_message", newText: `↩ : ${removedCount}` });
      }
      
      const observer = new MutationObserver((mutations, obs) => {
        if (!document.querySelector('article button[role="button"][data-testid="unlike"]')) {
          obs.disconnect();
          resolve(removedCount);
        }
      });
  
      observer.observe(document.body, { childList: true, subtree: true });

  });
}


async function removelikedTweets() {
  console.log('removelikedTweets');
  return new Promise((resolve, reject) => {
    console.log('Promise');
    
    const articleElements = Array.from(document.querySelectorAll('article'));
    let removedCount = 0;
    console.log(`removelikedTweets: ${articleElements.length}`);
    
    articleElements.forEach(articleElement => {
      const unlikeButton = articleElement.querySelector('button[role="button"][data-testid="unlike"]');
      if (unlikeButton) {
        articleElement.style.backgroundColor = 'green';
        delay(1000);
        articleElement.remove();
        removedCount++;
      }
    });

    if (removedCount) {
      chrome.runtime.sendMessage({ action: "user_message", newText: `removed: ${removedCount}` });
    }

    const observer = new MutationObserver((mutations, obs) => {
      if (!document.querySelector('article button[role="button"][data-testid="unlike"]')) {
        obs.disconnect();
        resolve(removedCount);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}


async function removelikedTweets_new() {
  console.log('removelikedTweets');
  return new Promise((resolve, reject) => {
    console.log('Promise');

    const articleElements = Array.from(document.querySelectorAll('article'));
    let removedCount = 0;
    console.log(`removelikedTweets: ${articleElements.length}`);

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const removeElementWithDelay = async (element) => {
      await delay(1000);  // 1 second delay
      element.remove();
      await delay(1000);  // 1 second delay
    };

    const tasks = articleElements.map(async articleElement => {
      const unlikeButton = articleElement.querySelector('button[role="button"][data-testid="unlike"]');
      if (unlikeButton) {
        articleElement.style.backgroundColor = 'green';
        await removeElementWithDelay(articleElement);
        removedCount++;
      }
    });

    Promise.all(tasks).then(() => {
      if (removedCount) {
        chrome.runtime.sendMessage({ action: "user_message", newText: `removed: ${removedCount}` });
      }
      resolve(removedCount);
    });
  });
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