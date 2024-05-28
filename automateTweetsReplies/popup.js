document.getElementById('save').addEventListener('click', () => {
  const keyword = document.getElementById('keyword').value;
  const frequency = parseInt(document.getElementById('frequency').value);
  const time = parseInt(document.getElementById('time').value);
  const replies = parseInt(document.getElementById('replies').value);
  const replyText = document.getElementById('replyText').value;

  chrome.storage.sync.set({ keyword, frequency, time, replies, replyText }, () => {
    alert('Settings saved');
  });
});
