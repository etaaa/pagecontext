chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "copy-to-clipboard") {
    navigator.clipboard.writeText(msg.text);
  }
});
