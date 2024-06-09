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