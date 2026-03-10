const statusEl = document.getElementById("status");
const pickControls = document.getElementById("pick-controls");
const pickBtn = document.getElementById("toggle-pick");

let pickActive = false;

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function runOnTab(options) {
  const tab = await getActiveTab();
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    ...options,
  });
  return result;
}

async function injectAndRun(files, func) {
  const tab = await getActiveTab();
  if (files) {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files });
  }
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func,
  });
  return result;
}

function estimateTokens(text) {
  const count = Math.ceil(text.length / 4);
  if (count >= 1000) return `~${(count / 1000).toFixed(1)}k`;
  return `~${count}`;
}

function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.hidden = false;
  setTimeout(() => { statusEl.hidden = true; }, 2500);
}

async function copyResult(fn, emptyMsg, successMsg, errorMsg) {
  try {
    const result = await fn();
    if (!result) {
      showStatus(emptyMsg, "error");
      return;
    }
    await navigator.clipboard.writeText(result);
    showStatus(`${successMsg} (${estimateTokens(result)} tokens)`, "success");
  } catch (err) {
    showStatus(errorMsg, "error");
    console.error(err);
  }
}

// Sync pick state with page on popup open
(async () => {
  try {
    pickActive = await runOnTab({ func: () => !!window.__pagecontext_active });
    pickBtn.classList.toggle("active", pickActive);
    pickControls.hidden = !pickActive;
  } catch { }
})();

// Copy Article Text
document.getElementById("copy-article").addEventListener("click", () => {
  copyResult(
    () => injectAndRun(["lib/Readability.js"], () => {
      const article = new Readability(document.cloneNode(true)).parse();
      if (!article) return null;
      let output = `# ${article.title}\n\n`;
      if (article.byline) output += `*${article.byline}*\n\n`;
      output += article.textContent.trim();
      return output;
    }),
    "Could not extract article from this page.",
    "Article text copied!",
    "Failed to extract article.",
  );
});

// Copy Full Page
document.getElementById("copy-page").addEventListener("click", () => {
  copyResult(
    () => runOnTab({
      func: () => {
        const clone = document.documentElement.cloneNode(true);
        clone.querySelectorAll("script, style, link[rel='stylesheet'], iframe, noscript, svg").forEach((el) => el.remove());
        return clone.outerHTML;
      },
    }),
    "Page is empty.",
    "Full page copied!",
    "Failed to copy page.",
  );
});

// Pick Elements Mode
pickBtn.addEventListener("click", async () => {
  pickActive = !pickActive;
  pickBtn.classList.toggle("active", pickActive);
  pickControls.hidden = !pickActive;

  if (pickActive) {
    await runOnTab({ files: ["content/annotate.js"] });
  } else {
    await runOnTab({
      func: () => { if (window.__pagecontext_disable) window.__pagecontext_disable(); },
    });
  }
});

// Copy Selected Elements
document.getElementById("copy-picked").addEventListener("click", () => {
  copyResult(
    () => runOnTab({
      func: () => window.__pagecontext_getSelected && window.__pagecontext_getSelected(),
    }),
    "No elements selected.",
    "Copied selected elements!",
    "Failed to copy.",
  );
});

// Clear Selected
document.getElementById("clear-picked").addEventListener("click", async () => {
  await runOnTab({
    func: () => window.__pagecontext_clearSelected && window.__pagecontext_clearSelected(),
  });
  showStatus("Selection cleared.", "success");
});
