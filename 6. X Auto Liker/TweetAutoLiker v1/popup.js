
let tabId = 0;
let totalLikes = likeDone = 0;
// Get the element with the class 'heart'
const bu = document.querySelector('.heart');
const user_name = document.getElementById('user_name');
const domainCheckDiv = document.getElementById('domain-check');
const how_many = document.getElementById('how_many');
var running = true;


let a = 0;
let b = 0;


// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if the message is to change the text content
  if (message.action === "user_message") {
    // Update the text content of the div in popup.html
    //alert("sls success - popup.js need div to change"+message.newText.toString());
    if (running) {
      // Input string
      let strings = message.newText.toString();
      console.log("sls : " + strings);

      // Split the string by '|'
      let parts = strings.split('|');

      parts.forEach(part => {
        // Trim the part to remove leading and trailing whitespace
        part = part.trim();

        // Check for 'removed_liked' and add its value to 'a'
        if (part.startsWith('removed:')) {
          let value = parseInt(part.split(':')[1].trim());
          a += value;
        }

        // Check for '↩ :' and add its value to 'b'
        if (part.startsWith('↩ :')) {
          let value = parseInt(part.split(':')[1].trim());
          b += value;
        }


      });

      // Print the results
      console.log('a:', a);
      //console.log('b:', b);



      document.getElementById("Likes").innerText = "" + likeDone;
      document.getElementById("alreadyLike_status").innerText = "" + a;




      document.getElementById("status").innerText = "" + message.newText.toString();

    }
  }

  if (message.action === "total_done") {
    // Update the text content of the div in popup.html
    //alert("sls success - popup.js need div to change"+message.newText.toString());
    let inputValue = document.getElementById('input-number').value;
    totalLikes = parseInt(inputValue);




    document.getElementById('progress-bar').value = parseInt(message.newText.toString());

    chrome.action.setBadgeText({ text: (message.newText.toString()) });

    // Create a new click event
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });

    // Dispatch the click event on the heart element
    bu.dispatchEvent(clickEvent);


    console.log("Total remaining : " + message.newText.toString());



    document.getElementById("Likes").innerText = "" + likeDone;
    document.getElementById("alreadyLike_status").innerText = "" + a;




    if (parseInt(message.newText.toString()) < totalLikes) {


      if (running) {
        likeDone = parseInt(message.newText.toString());
        startLiking();
      }





    } else {
      console.log("End");
      if (running) {
        likeDone = parseInt(message.newText.toString());
        document.getElementById("Likes").innerText = "" + likeDone;
        document.getElementById("status").innerText = "";
      }
      document.getElementById("how_many").style.display = 'block';
      document.getElementById("input-number").style.display = 'block';
      document.getElementById("start-button").style.display = 'block';
      document.getElementById("stop-button").style.display = 'none';
      document.getElementById('progress-bar').style.display = "none";
      stopTimer();
      chrome.action.setBadgeText({ text: ("") });
      totalLikes = likeDone = 0;


      chrome.tabs.sendMessage(tabId, { action: "end" }, async function (response) {
        if (response) {
          console.log("End send to content too.");
        }
      });






    }
  }

  if (message.action === "tab") {
    tabId = parseInt(message.tab_id);
    console.log(tabId);
  }

});


// get likes amount from users here
//totalLikes =10; //parseInt(document.getElementById('input-number').value); // // getElement User like Element


function startLiking() {


  // Get the value from the input field and parse it as an integer
  let inputValue = document.getElementById('input-number').value;
  totalLikes = parseInt(inputValue);
  //alert(totalLikes);
  // Check if the parsed value is a valid number
  if (isNaN(totalLikes)) {
  
    document.getElementById("input-number").style.border = "1px solid red";
    totalLikes = 0; // or handle the invalid input as needed
  }
  if (parseInt(totalLikes) > 0) {
    document.getElementById("input-number").style.border = "0px";
    document.getElementById("loger").style.display = 'block';

    document.getElementById("how_many").style.display = 'none';
    document.getElementById("input-number").style.display = 'none';
    document.getElementById("start-button").style.display = 'none';
    document.getElementById("stop-button").style.display = 'block';
    document.getElementById("status").innerText = "Starting";
    document.getElementById("progress-bar").setAttribute("max", parseInt(totalLikes));
    document.getElementById('progress-bar').style.display = "block";

    console.log('Liking Starting');

    document.getElementById('complete_timer').style.display = "none";
    chrome.tabs.sendMessage(tabId, { action: "like" }, async function (response) {
      if (response) {
        if (response.status == 'likeDone') {
          // likeDone += 1;
          //console.log('Like done - return responce to popup.js');
          //console.log('calling the script again if likeDone and totalLikes is not =');
          //console.log("Total like remaining : "+(totalLikes-likeDone));
          console.log("startLiking responce returned");
          //startLiking();
        } else {
          console.log('Like not done');
        }
      }
    });



  }
  else {
    //document.getElementById("status").style.display="block";
    document.getElementById("status").innerText = "The input value is not a valid number.";
   
  }

  //console.log("Total Likes:", totalLikes);

  //if (likeDone < totalLikes) {

  // console.log('Completed');

  //}else{
  //document.getElementById("status").style.color="green";
  //document.getElementById("status").innerText = "Liked completed: Total done"+likeDone;
  //console.log("Completed");
  // }
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


function hideBtns() {

  document.getElementById("status").innerText = 'x.com is not open in the active tab';
  document.getElementById("how_many").style.display = 'none';
  document.getElementById("input-number").style.display = 'none';
  document.getElementById("start-button").style.display = 'none';
  document.getElementById("stop-button").style.display = 'none';
  document.getElementById('progress-bar').style.display = "none";
  document.getElementById('complete_timer').style.display = "none";
  document.getElementById('timer').style.display = "none";
  document.getElementById('complete_timer').style.display = "none";

}


// Get all elements with the class 'heart'
const hearts = document.querySelectorAll('.heart');

// Add click and touchstart event listeners to each heart element
hearts.forEach(heart => {
  heart.addEventListener('click', function () {
    // Toggle the 'is_animating' class
    this.classList.toggle('is_animating');
  });

  heart.addEventListener('touchstart', function () {
    // Toggle the 'is_animating' class
    this.classList.toggle('is_animating');
  });

  // Add animationend event listener to each heart element
  heart.addEventListener('animationend', function () {
    // Toggle the 'is_animating' class
    this.classList.toggle('is_animating');
  });
});


// Create a new click event
const clickEvent = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
  view: window
});

// Dispatch the click event on the heart element
bu.dispatchEvent(clickEvent);


// Variables to hold timer state
let timerInterval;
let startTime;

// Function to start the timer
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000); // Update the timer every second
}

// Function to update the timer display
function updateTimer() {
  const elapsedTime = Date.now() - startTime;
  const formattedTime = formatTime(elapsedTime);
  document.getElementById('timer').textContent = formattedTime;
}

// Function to format time as HH:MM:SS
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

// Function to add leading zero to single digit numbers
function padZero(num) {
  return num < 10 ? `0${num}` : num;
}

// Function to stop the timer and log the total time
function stopTimer() {
  clearInterval(timerInterval);
  const elapsedTime = Date.now() - startTime;
  const formattedTime = formatTime(elapsedTime);
  console.log(`Total time: ${formattedTime}`);
  document.getElementById('complete_timer').style.display = "block";
  document.getElementById('complete_timer').textContent = formattedTime;
  document.getElementById('timer').style.display = "none";
}



document.addEventListener('DOMContentLoaded', function () {
  // Retrieve the tabId from chrome.storage
  chrome.storage.local.get(['tabId'], function (result) {
    tabId = result.tabId;
    if (tabId) {
      domainCheckDiv.style.display = "none";
      console.log('Tab ID in popup:', tabId);


      document.getElementById('stop-button').addEventListener('click', () => {
        //chrome.runtime.sendMessage({ action: 'stop' });

        running = false;
        console.log("Stoped");



        chrome.tabs.sendMessage(tabId, { action: "stop" }, async function (response) {
          if (response) {
            console.log("response from stop");
            if (response.status == 'likeDone') {

              console.log("startLiking responce returned");
              //startLiking();
            } else {
              console.log('Like not done');
            }
          }

        });

        document.getElementById("status").innerText = "Task stoped";
        document.getElementById("how_many").style.display = 'block';
        document.getElementById("input-number").style.display = 'block';
        document.getElementById("start-button").style.display = 'block';
        document.getElementById("stop-button").style.display = 'none';
        document.getElementById('progress-bar').style.display = "none";
        //stopTimer();
        document.getElementById('complete_timer').style.display = "none";
        document.getElementById("loger").style.display = 'none';

      });


      document.getElementById('start-button').addEventListener('click', function () {

        startTimer();
        startLiking();

      });

      // Perform actions with tabId
    } else {

      console.log('No tab ID found');
      hideBtns();
    }
  });
});



//window.onload = loaded;