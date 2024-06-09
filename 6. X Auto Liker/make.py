import os

# Directory and file structure
structure = {
    "TweetAutoLiker": {
        "images": {
            "icon0.png": "",
            "icon1.png": "",
            "icon2.png": "",
            "web_heart_animation.png": "",
        },
        "background.js": """
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
        """,
        "contentScript.js": """
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
        """,
        "manifest.json": """
{
  "manifest_version": 3,
  "name": "Tweet Liker",
  "version": "1.0",
  "description": "Tweet Liker.",
  "permissions": [
    "activeTab",
    "scripting",
    "tabs",
    "windows",
    "storage"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_icon": {
      "16": "images/icon2.png",
      "48": "images/icon0.png",
      "128": "images/icon1.png"
    }
  },
  "content_scripts": [
    {
      "matches": [
        "*://*.x.com/*"
      ],
      "js": [
        "contentScript.js"
      ],
      "run_at": "document_end"
    }
  ]
}
        """,
        "noTarget.html": """
<!DOCTYPE html>
<html>
<head>
  <title>Tweet AutoLiker</title>
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css" integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz" crossorigin="anonymous">
  <link rel="stylesheet" href="noTarget.css">
</head>
<body>
  <div class="container">
    <div class="brand-logo"></div>
    <div class="brand-title">Tweet AutoLiker</div>
    <center>
      <div class="blink" id="domain-check" style="margin-bottom: 30px;margin-top:30px;"><span>Please visit x.com first.</span></div>
      <div id="user_name"></div>
      <div class="heart" id="heart"></div>
    </center>
    <br />
    <div style="position: relative;">
      <iframe src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Ffacebook.com%2Ftigerzplace&amp;width=122&amp;layout=button_count&amp;action=like&amp;size=small&amp;show_faces=true&amp;share=true&amp;height=46&amp;appId=782183628529704" width="152" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowtransparency="true" allow="encrypted-media" height="20"></iframe>
    </div>
  </div>
</body>
</html>
        """,
        "noTarget.css": """
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJnecmNE.woff2) format('woff2');
  unicode-range: U+0100-02AF, U+0304, U+0308, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLBT5Z1JlFc-K.woff2) format('woff2');
  unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

input {
  caret-color: red;
}

body {
  margin: 0;
  width: 100vw;
  height: 100vh;
  background: #ecf0f3;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  place-items: center;
  overflow: hidden;
  font-family: poppins;
  min-width: 310px;
}

.container {
  position: relative;
  width: 305px;
  height: 290px;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
  background: #ecf0f3;
  box-shadow: 14px 14px 20px #cbced1, -14px -14px 20px white;
  margin-top: 10px;
  margin-bottom: 10px;
}

.brand-logo {
  height: 70px;
  width: 70px;
  background: url("twitter--v2.png") center/cover no-repeat;
  margin: auto;
  border-radius: 50%;
  box-sizing: border-box;
  box-shadow: 7px 7px 10px #cbced1, -7px -7px 10px white;
}

.brand-title {
  margin-top: 10px;
  font-weight: 900;
  font-size: 1.8rem;
  color: #1DA1F2;
  letter-spacing: 1px;
}

.inputs {
  text-align: left;
  margin-top: 30px;
}

label,
input,
button {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  outline: none;
  box-sizing: border-box;
}

label {
  margin-bottom: 4px;
}

label:nth-of-type(2) {
  margin-top: 12px;
}

input::placeholder {
  color: gray;
}

input {
  background: #ecf0f3;
  padding: 10px;
  padding-left: 20px;
  height: 50px;
  font-size: 14px;
  border-radius: 50px;
  box-shadow: inset 6px 6px 6px #cbced1, inset -6px -6px 6px white;
}

button {
  color: white;
  margin-top: 20px;
  background: #1DA1F2;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 900;
  box-shadow: 6px 6px 6px #cbced1, -6px -6px 6px white;
  transition: 0.5s;
}

button:hover {
  box-shadow: none;
}

a {
  position: absolute;
  font-size: 8px;
  bottom: 4px;
  right: 4px;
  text-decoration: none;
  color: black;
  background: rgb(247, 201, 51);
  border-radius: 10px;
  padding: 2px;
}

h1 {
  position: absolute;
  top: 0;
  left: 0;
}

.heart {
  cursor: pointer;
  height: 70px;
  width: 70px;
  background-image: url('images/web_heart_animation.png');
  background-position: left;
  background-repeat: no-repeat;
  background-size: 2900%;
}

.heart:hover {
  background-position: right;
}

.is_animating {
  animation: heart-burst .8s steps(28) 1;
}

@keyframes heart-burst {
  from {
    background-position: left;
  }
  to {
    background-position: right;
  }
}

.blink {
  width: 200px;
  height: 19px;
  background-color: rgba(249, 254, 255, 0.014);
  padding: 5px;
  text-align: center;
  margin-top: 10px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 400;
  box-shadow: 6px 6px 6px #cbced1, -6px -6px 6px white;
  transition: 1s;
  font-family: cursive;
  animation: blink 2s linear infinite;
  color: #ec7fa9de;
}

@keyframes blink {
  0% {
    opacity: .8;
  }
  50% {
    opacity: .9;
  }
  100% {
    opacity: 1;
  }
}

#progress-bar {
  width: 100%;
  color: #000;
  height: 10px;
  margin-top: 30px;
  margin-bottom: 30px;
}

span2 {
  margin-top: 40px;
  height: 30px;
  width: 30px;
  border-radius: 100%;
  background: #ec7fa9de;
  position: absolute;
  left: 0;
  top: -2px;
  cursor: pointer;
  transition: all 0.4s ease-in-out;
}

.first {
  left: -2px;
  color: #ec7fa9de;
}

.second {
  left: 952px;
}

.percent {
  position: absolute;
  left: 0;
  top: 0;
  background: #fff;
  white-space: nowrap;
  -webkit-animation: rightThenLeft 4s linear;
}

.percent_circle {
  top: -13px;
  font-size: 3em;
  width: 0.3em;
  height: 0.3em;
  border: 0.1em solid #ec7fa9de;
  position: relative;
  border-radius: 0.35em;
}

@-webkit-keyframes rightThenLeft {
  from { left:0px; }
  to { left:200px; }
}

#talkbubble {
  color: #fff;
  font-weight: lighter;
  font-family: Arial;
  font-size: 14px;
  padding: 6px;
  width: 115px;
  height: 30px;
  background: #ec7fa9de;
  position: relative;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
}

#talkbubble:before {
  content: "";
  position: absolute;
  right: 40%;
  top: 30px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 20px solid #ec7fa9de;
}

#progress-bar::-webkit-progress-value {
  background: #ec7fa9de;
  transition: all 0.4s ease-in-out;
}

#progress-bar::-webkit-progress-bar {
  background: #1DA1F2;
}
        """,
        "popup.html": """
<!DOCTYPE html>
<html>
<head>
  <title>Tweet AutoLiker</title>
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css" integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz" crossorigin="anonymous">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <div class="brand-logo"></div>
    <div class="brand-title">Tweet AutoLiker</div>
    <center>
      <div class="blink" id="domain-check" style="margin-bottom: 30px;margin-top:30px;"><span>Checking domain</span></div>
      <div id="user_name"></div>
      <div class="heart" id="heart"></div>
    </center>
    <div class="inputs" id="main_form" style="margin-top:0px;">
      <label id="how_many" style="display: none;"></label>
      <input type="number" id="input-number" placeholder="How many likes!" min="1" required />
      <progress id="progress-bar" min="1" max="100" value="0" style="display:none;"></progress>
      <center id="loger" style="display: none;">
        <div id="timer">00:00:00</div>
        <div id="complete_timer">00:00:00</div>
        <br />
        <span class="second"></span>
        <code style="font-size:12px;">
          <div style="float:left; margin-left:60px;">Liked: <b id="Likes">0</b></div>
          <div style="float:right;margin-right:60px;">Skipped: <b id="alreadyLike_status">0</b></div>
        </code>
        <br />
        <code>
          <div id="status" style="margin-top: 10px; font-size: 11px; display:none">status</div>
        </code>
      </center>
      <button id="start-button" class="btn btn-primary btn-block btn-large"><b>Start</b></button>
      <button id="stop-button" class="btn btn-primary btn-block btn-large" style="display: none;">Stop</button>
    </div>
    <br />
    <div style="position: relative;">
      <iframe src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Ffacebook.com%2Ftigerzplace&amp;width=122&amp;layout=button_count&amp;action=like&amp;size=small&amp;show_faces=true&amp;share=true&amp;height=46&amp;appId=782183628529704" width="152" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowtransparency="true" allow="encrypted-media" height="20"></iframe>
    </div>
  </div>
  <script src="popup.js"></script>
</body>
</html>
        """,
        "popup.js": """
let tabId = 0;
let totalLikes = 0;
let likeDone = 0;
const bu = document.querySelector('.heart');
const domainCheckDiv = document.getElementById('domain-check');
let running = true;
let a = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "user_message") {
    if (running) {
      let strings = message.newText.toString();
      let parts = strings.split('|').map(part => part.trim());
      parts.forEach(part => {
        if (part.startsWith('removed:')) {
          a += parseInt(part.split(':')[1].trim());
        }
      });
      document.getElementById("Likes").innerText = "" + likeDone;
      document.getElementById("alreadyLike_status").innerText = "" + a;
      document.getElementById("status").innerText = "" + message.newText.toString();
    }
  } else if (message.action === "total_done") {
    totalLikes = parseInt(document.getElementById('input-number').value);
    document.getElementById('progress-bar').value = parseInt(message.newText.toString());
    chrome.action.setBadgeText({ text: message.newText.toString() });
    bu.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    likeDone = parseInt(message.newText.toString());
    if (likeDone < totalLikes && running) {
      startLiking();
    } else {
      endLikingProcess();
    }
  } else if (message.action === "tab") {
    tabId = parseInt(message.tab_id);
    console.log(tabId);
  }
});

function startLiking() {
  totalLikes = parseInt(document.getElementById('input-number').value);
  if (!isNaN(totalLikes) && totalLikes > 0) {
    document.getElementById("loger").style.display = 'block';
    document.getElementById("how_many").style.display = 'none';
    document.getElementById("input-number").style.display = 'none';
    document.getElementById("start-button").style.display = 'none';
    document.getElementById("stop-button").style.display = 'block';
    document.getElementById("status").innerText = "Starting";
    document.getElementById("progress-bar").setAttribute("max", totalLikes);
    document.getElementById('progress-bar').style.display = "block";
    startTimer();
    chrome.tabs.sendMessage(tabId, { action: "like" });
  } else {
    document.getElementById("input-number").style.border = "1px solid red";
  }
}

function endLikingProcess() {
  if (running) {
    document.getElementById("Likes").innerText = "" + likeDone;
    document.getElementById("status").innerText = "";
    document.getElementById("how_many").style.display = 'block';
    document.getElementById("input-number").style.display = 'block';
    document.getElementById("start-button").style.display = 'block';
    document.getElementById("stop-button").style.display = 'none';
    document.getElementById('progress-bar').style.display = "none";
    stopTimer();
    chrome.action.setBadgeText({ text: "" });
    totalLikes = likeDone = 0;
    chrome.tabs.sendMessage(tabId, { action: "end" });
  }
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const elapsedTime = Date.now() - startTime;
  const formattedTime = formatTime(elapsedTime);
  document.getElementById('timer').textContent = formattedTime;
}

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
  return num < 10 ? `0${num}` : num;
}

function stopTimer() {
  clearInterval(timerInterval);
  const elapsedTime = Date.now() - startTime;
  const formattedTime = formatTime(elapsedTime);
  document.getElementById('complete_timer').style.display = "block";
  document.getElementById('complete_timer').textContent = formattedTime;
  document.getElementById('timer').style.display = "none";
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['tabId'], (result) => {
    tabId = result.tabId;
    if (tabId) {
      domainCheckDiv.style.display = "none";
      document.getElementById('stop-button').addEventListener('click', () => {
        running = false;
        chrome.tabs.sendMessage(tabId, { action: "stop" });
        endLikingProcess();
      });
      document.getElementById('start-button').addEventListener('click', startLiking);
    } else {
      hideBtns();
    }
  });
});

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
        """,
        "style.css": """
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJnecmNE.woff2) format('woff2');
  unicode-range: U+0100-02AF, U+0304, U+0308, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLBT5Z1JlFc-K.woff2) format('woff2');
  unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

input {
  caret-color: red;
}

body {
  margin: 0;
  width: 100vw;
  height: 100vh;
  background: #ecf0f3;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  place-items: center;
  overflow: hidden;
  font-family: poppins;
  min-width: 320px;
}

.container {
  position: relative;
  width: 360px;
  height: 490px;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
  background: #ecf0f3;
  box-shadow: 14px 14px 20px #cbced1, -14px -14px 20px white;
  margin-top: 10px;
  margin-bottom: 10px;
}

.brand-logo {
  height: 70px;
  width: 70px;
  background: url("twitter--v2.png") center/cover no-repeat;
  margin: auto;
  border-radius: 50%;
  box-sizing: border-box;
  box-shadow: 7px 7px 10px #cbced1, -7px -7px 10px white;
}

.brand-title {
  margin-top: 10px;
  font-weight: 900;
  font-size: 1.8rem;
  color: #1DA1F2;
  letter-spacing: 1px;
}

.inputs {
  text-align: left;
  margin-top: 30px;
}

label,
input,
button {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  outline: none;
  box-sizing: border-box;
}

label {
  margin-bottom: 4px;
}

label:nth-of-type(2) {
  margin-top: 12px;
}

input::placeholder {
  color: gray;
}

input {
  background: #ecf0f3;
  padding: 10px;
  padding-left: 20px;
  height: 50px;
  font-size: 14px;
  border-radius: 50px;
  box-shadow: inset 6px 6px 6px #cbced1, inset -6px -6px 6px white;
}

button {
  color: white;
  margin-top: 20px;
  background: #1DA1F2;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 900;
  box-shadow: 6px 6px 6px #cbced1, -6px -6px 6px white;
  transition: 0.5s;
}

button:hover {
  box-shadow: none;
}

a {
  position: absolute;
  font-size: 8px;
  bottom: 4px;
  right: 4px;
  text-decoration: none;
  color: black;
  background: rgb(247, 201, 51);
  border-radius: 10px;
  padding: 2px;
}

h1 {
  position: absolute;
  top: 0;
  left: 0;
}

.heart {
  cursor: pointer;
  height: 70px;
  width: 70px;
  background-image: url('images/web_heart_animation.png');
  background-position: left;
  background-repeat: no-repeat;
  background-size: 2900%;
}

.heart:hover {
  background-position: right;
}

.is_animating {
  animation: heart-burst .8s steps(28) 1;
}

@keyframes heart-burst {
  from {
    background-position: left;
  }
  to {
    background-position: right;
  }
}

.blink {
  width: 200px;
  height: 19px;
  background-color: rgba(249, 254, 255, 0.014);
  padding: 5px;
  text-align: center;
  margin-top: 10px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 400;
  box-shadow: 6px 6px 6px #cbced1, -6px -6px 6px white;
  transition: 1s;
  font-family: cursive;
  animation: blink 2s linear infinite;
  color: #ec7fa9de;
}

@keyframes blink {
  0% {
    opacity: .8;
  }
  50% {
    opacity: .9;
  }
  100% {
    opacity: 1;
  }
}

#progress-bar {
  width: 100%;
  color: #000;
  height: 10px;
  margin-top: 30px;
  margin-bottom: 30px;
}

span2 {
  margin-top: 40px;
  height: 30px;
  width: 30px;
  border-radius: 100%;
  background: #ec7fa9de;
  position: absolute;
  left: 0;
  top: -2px;
  cursor: pointer;
  transition: all 0.4s ease-in-out;
}

.first {
  left: -2px;
  color: #ec7fa9de;
}

.second {
  left: 952px;
}

.percent {
  position: absolute;
  left: 0;
  top: 0;
  background: #fff;
  white-space: nowrap;
  -webkit-animation: rightThenLeft 4s linear;
}

.percent_circle {
  top: -13px;
  font-size: 3em;
  width: 0.3em;
  height: 0.3em;
  border: 0.1em solid #ec7fa9de;
  position: relative;
  border-radius: 0.35em;
}

@-webkit-keyframes rightThenLeft {
  from { left:0px; }
  to { left:200px; }
}

#talkbubble {
  color: #fff;
  font-weight: lighter;
  font-family: Arial;
  font-size: 14px;
  padding: 6px;
  width: 115px;
  height: 30px;
  background: #ec7fa9de;
  position: relative;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
}

#talkbubble:before {
  content: "";
  position: absolute;
  right: 40%;
  top: 30px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 20px solid #ec7fa9de;
}

#progress-bar::-webkit-progress-value {
  background: #ec7fa9de;
  transition: all 0.4s ease-in-out;
}

#progress-bar::-webkit-progress-bar {
  background: #1DA1F2;
}
        """,
    }
}

# Function to create the directory and file structure
def create_structure(base_path, structure):
    for name, content in structure.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)
        else:
            with open(path, 'w', encoding='utf-8') as file:
                file.write(content.strip())

# Define the base path where you want to create the structure
base_path = "./TweetAutoLiker"

# Create the directory and file structure
create_structure(base_path, structure)

print("Directory and file structure created successfully.")
