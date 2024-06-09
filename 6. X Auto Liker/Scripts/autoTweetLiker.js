function asyncFunction(value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      var count = 0;

      function removeReplies() {
        const articleElements = document.querySelectorAll("article");
        let removedCount = 0;

        // Iterate through each article element
        articleElements.forEach((articleElement) => {
          if (articleElement.textContent.includes("Replying to")) {
            // Remove the article element
            articleElement.remove();
            removedCount++;
          }
        });

        console.log(`Removed ${removedCount} "Replying to".`);
        return removedCount;
      }

      function removeArticlesWithUnlikeButton() {
        const articleElements = document.querySelectorAll("article");
        let removedCount = 0;

        // Iterate through each article element
        articleElements.forEach((articleElement) => {
          const unlikeButton = articleElement.querySelector(
            'button[role="button"][data-testid="unlike"]'
          );
          if (unlikeButton) {
            // Remove the article element
            articleElement.remove();
            removedCount++;
          }
        });

        console.log(`Removed ${removedCount} already liked".`);

        return removedCount;
      }

      // Function to keep track of SVG elements based on their path attributes
      function trackSvgElementsByPathAttributes() {
        // Array to store matched SVG elements
        const matchedSvgElements = [];

        // Get all SVG elements on the page
        const svgElements = document.querySelectorAll("svg");

        // Loop through each SVG element
        svgElements.forEach((svgElement) => {
          // Check if the SVG element has a path child element
          const pathElement = svgElement.querySelector("path");

          // If a path child element exists and its d attribute matches the specified value, add the SVG element to the array
          if (
            pathElement &&
            pathElement.getAttribute("d") ===
              "M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
          ) {
            matchedSvgElements.push(svgElement); // Add the SVG element to the array
          }
        });

        // Return the array of matched SVG elements
        return matchedSvgElements;
      }

      // Example: Call the function to get an array of matched SVG elements
      const trackedSvgElements = trackSvgElementsByPathAttributes();
      console.log(trackedSvgElements.length);

      // Function to click on a specific SVG element based on its 0 in the array
      function click_function() {
        const trackedSvgElements = trackSvgElementsByPathAttributes();

        if (0 >= 0 && 0 < trackedSvgElements.length) {
          // Create and dispatch a click event
          const clickEvent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          });
          trackedSvgElements[0].dispatchEvent(clickEvent);
          console.log("Liked...");
        } else {
          console.error("Clicking index Error : Invalid 0:", 0);
        }
      }

      async function waitTwoSeconds() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 2000); // 2-second delay
        });
      }

      async function main() {
        let removedCount;
        count++;
        // Remove articles with "Unlike" button until none left
        do {
          removedCount = await removeArticlesWithUnlikeButton();
          await waitTwoSeconds();
        } while (removedCount !== 0);

        // Remove replies
        removedCount = await removeReplies();
        // If there are still replies left, keep removing until none left
        while (removedCount !== 0) {
          await waitTwoSeconds();
          removedCount = await removeReplies();
        }

        // Check articles again
        do {
          removedCount = await removeArticlesWithUnlikeButton();
          await waitTwoSeconds();
        } while (removedCount !== 0);

        // Check replies again
        removedCount = await removeReplies();
        // If there are still replies left, keep removing until none left
        while (removedCount !== 0) {
          await waitTwoSeconds();
          removedCount = await removeReplies();
        }

        click_function();
        console.log("Liked");

        if (count < value) {
          main();
          console.log("Again searching for post | Total post done :" + count);
        } else {
          console.log("Task completed...");
        }
      }

      // Start the process
      main();

      resolve();
    }, Math.random() * 2000); // Random wait time between 0 to 3 seconds
  });
}

async function getUserInputAndRunAsyncFunction() {
  let userInput = prompt("Enter a value:");
  console.log("Total to like : ", userInput);
  await asyncFunction(userInput);
}

getUserInputAndRunAsyncFunction();
