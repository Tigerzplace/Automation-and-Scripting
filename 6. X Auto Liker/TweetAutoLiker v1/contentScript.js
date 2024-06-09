
console.log('content script executed.');
chrome.runtime.onMessage.addListener(fromPopup);
let likesDone = 0;





async function main_body() {
  await delay(1000);
  // Assign the async function to a variable and wait for the result
  const already_liked_Count = await likeTweets();

  console.log("");

  const removedCount = await removeReplies();

  console.log("");

  if (removedCount === 0 && already_liked_Count === 0) {
    console.log("Both clear: calling click");

    const click_return = await click_function();
    console.log("After click return:");
    console.log("");

    if (click_return) {
      console.log("👍 success...");

      // Delay for 4 seconds before returning
      await delay(3000);
      likesDone++;
      console.log("sending message to bg with total : " + likesDone);
      chrome.runtime.sendMessage({ action: "total_done", newText: "" + likesDone });

    } else {
      console.log("👍 clicking fail so calling again...");
      // Delay for 4 seconds before returning

    }
  } else {
    console.log("There are Already 👍 and ↩ to remove first.");
    // Send a message to the background script
    chrome.runtime.sendMessage({ action: "user_message", newText: "again clearing." });
    let body = await main_body();
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




// Function to keep track of SVG elements based on their path attributes
function trackSvgElementsByPathAttributes() {
  // Array to store matched SVG elements
  const matchedSvgElements = [];

  // Get all SVG elements on the page
  const svgElements = document.querySelectorAll('svg');

  // Loop through each SVG element
  svgElements.forEach(svgElement => {
    // Check if the SVG element has a path child element
    const pathElement = svgElement.querySelector('path');

    // If a path child element exists and its d attribute matches the specified value, add the SVG element to the array
    if (pathElement && pathElement.getAttribute('d') === 'M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z') {
      matchedSvgElements.push(svgElement); // Add the SVG element to the array
    }
  });

  // Return the array of matched SVG elements
  return matchedSvgElements;
}






// Function to click on a specific SVG element based on its 0 in the array
async function click_function() {
  let return_value = 0;
  // Return a promise immediately
  return new Promise((resolve, reject) => {
    try {
      const trackedSvgElements = trackSvgElementsByPathAttributes();
      setTimeout(() => {
        resolve(return_value);
      }, 2000);
      if (0 < trackedSvgElements.length) {
        // Create and dispatch a click event
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        setTimeout(() => {
          resolve(return_value);
        }, 1000);
        trackedSvgElements[0].dispatchEvent(clickEvent);
        //  console.log("👍");

        chrome.runtime.sendMessage({ action: "user_message", newText: "Liked 👍" });


        //const clear_liked=await likeTweets();
        setTimeout(() => {
          resolve(return_value);
        }, 2000);
        return_value = 1;
      } else {
        setTimeout(() => {
          resolve(return_value);
        }, 1000);
        console.error('Clicking index Error : Invalid 0:', 0);
        return_value = 0;
      }



    } catch (e) {
      reject(`Error: ${e}`);
    }
  });
}






// Define the async function
// Define the async function to remove replies
async function removeReplies() {
  console.log("Removing replies");
  const articleElements = document.querySelectorAll('article');
  let removedCount = 0;
  removed_total = 0;
  for (let i = 0; i < articleElements.length; i++) {
    let articleElement = articleElements[i];
    if (articleElement.textContent.includes('Replying to')) {
      // Change the background color to black
      articleElement.style.backgroundColor = 'black';

      // Wait for (i+1) seconds
      await new Promise(resolve => setTimeout(resolve, (i + 2) * 1000));

      // Remove the article element
      articleElement.remove();
      removedCount++;
    }
  }

  if (removedCount) {
    chrome.runtime.sendMessage({ action: "user_message", newText: "↩ : " + removedCount });
  }

  return removedCount;
}

// Define the async function to like tweets
async function likeTweets() {
  chrome.runtime.sendMessage({ action: "user_message", newText: "Already Liked posts are being removed..." });
  const articleElements = document.querySelectorAll('article');
  let removedCount = 0;

  for (let i = 0; i < articleElements.length; i++) {
    let articleElement = articleElements[i];
    const unlikeButton = articleElement.querySelector('button[role="button"][data-testid="unlike"]');
    if (unlikeButton) {
      // Change the background color to black
      articleElement.style.backgroundColor = 'green';

      // Wait for (i+1) seconds
      await new Promise(resolve => setTimeout(resolve, (i + 2) * 1000));

      // Remove the article element
      articleElement.remove();
      removedCount++;
    }
  }

  if (removedCount) {
    chrome.runtime.sendMessage({ action: "user_message", newText: `removed: ${removedCount}` });
    console.log(`Removed ${removedCount} 👍🏽.`);
  }

  return removedCount;
}








function fromPopup(request, sender, sendResponse) {
  try {
    // console.log(`fromPopup --> action: ${request.action}`);



    if (request.action == 'like') {

      //console.log(`Action recieved: ${request.action}`);
      //console.log(`Calling Main()`);





      // Select the path element by its 'd' attribute
      var pathElement = document.querySelector('path[d="M12 4c-4.418 0-8 3.58-8 8s3.582 8 8 8c3.806 0 6.993-2.66 7.802-6.22l1.95.44C20.742 18.67 16.76 22 12 22 6.477 22 2 17.52 2 12S6.477 2 12 2c3.272 0 6.176 1.57 8 4V3.5h2v6h-6v-2h2.616C17.175 5.39 14.749 4 12 4z"]');

      // Check if the path element exists
      if (pathElement) {
        // If the path element exists, you can perform operations on it here
        console.log("Error:", "Something went wrong. Try reloading. New post may be not in page or not loaded...");
      } else {
        console.log("No error in page loading");

        const m_body = (async () => { main_body() })();

      }





    } // likesDone

    if (request.action == 'end') {
      likesDone = 0;
    }




    if (request.action == 'stop') {
      console.log(`Action recieved: ${request.action}`);
    } // likesDone









  } catch (error) {
    console.error(`FB side: ${error}`);
    // sendResponse({ status: error.message });
  }







} //popup function










