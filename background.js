async function ensureOffscreen() {
  const exists = await chrome.offscreen.hasDocument();
  if (!exists) {
    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["CLIPBOARD"],
      justification: "Write to clipboard from service worker",
    });
  }
}

async function copyToClipboard(text) {
  await ensureOffscreen();
  await chrome.runtime.sendMessage({ type: "copy-to-clipboard", text });
}

async function copyArticle(tab) {
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["lib/Readability.js"],
  });
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const article = new Readability(document.cloneNode(true)).parse();
      if (!article) return null;
      let output = `# ${article.title}\n\n`;
      if (article.byline) output += `*${article.byline}*\n\n`;
      output += article.textContent.trim();
      return output;
    },
  });
  return result;
}

async function copyPage(tab) {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const clone = document.documentElement.cloneNode(true);
      clone.querySelectorAll("script, style, link[rel='stylesheet'], iframe, noscript, svg").forEach((el) => el.remove());
      return clone.outerHTML;
    },
  });
  return result;
}

chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  try {
    let text;
    if (command === "copy-article") {
      text = await copyArticle(tab);
    } else if (command === "copy-page") {
      text = await copyPage(tab);
    }
    if (text) {
      await copyToClipboard(text);
    }
  } catch (err) {
    console.error(`PageContext: ${command} failed`, err);
  }
});
