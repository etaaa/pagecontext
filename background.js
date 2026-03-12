let offscreenReady = false;

async function ensureOffscreen() {
  if (offscreenReady) return;
  const exists = await chrome.offscreen.hasDocument();
  if (!exists) {
    await chrome.offscreen.createDocument({
      url: "offscreen/offscreen.html",
      reasons: ["CLIPBOARD"],
      justification: "Write to clipboard from service worker",
    });
  }
  offscreenReady = true;
}

async function copyToClipboard(text) {
  await ensureOffscreen();
  await chrome.runtime.sendMessage({ type: "copy-to-clipboard", text });
}

async function runExtraction(tab, files, func) {
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, files });
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func,
  });
  return result;
}

const commands = {
  "copy-article": (tab) =>
    runExtraction(tab, ["lib/Readability.js", "content/extract.js"], () =>
      window.__pagecontext_extractArticle(),
    ),
  "copy-page": (tab) =>
    runExtraction(tab, ["content/extract.js"], () =>
      window.__pagecontext_extractPage(),
    ),
};

chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !commands[command]) return;

  try {
    const text = await commands[command](tab);
    if (text) await copyToClipboard(text);
  } catch (err) {
    console.error(`PageContext: ${command} failed`, err);
  }
});
