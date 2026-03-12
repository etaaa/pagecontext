const statusEl = document.getElementById("status");
const pickControls = document.getElementById("pick-controls");
const pickBtn = document.getElementById("toggle-pick");

let pickActive = false;

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function runOnTab(func) {
  const tab = await getActiveTab();
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func,
  });
  return result;
}

async function injectOnTab(files) {
  const tab = await getActiveTab();
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, files });
}

async function injectAndRun(files, func) {
  const tab = await getActiveTab();
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, files });
  const [{ result }] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func });
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
    pickActive = await runOnTab(() => !!window.__pagecontext_active);
    pickBtn.classList.toggle("active", pickActive);
    pickControls.hidden = !pickActive;
  } catch {}
})();

// Copy Article Text
document.getElementById("copy-article").addEventListener("click", () => {
  copyResult(
    () => injectAndRun(
      ["lib/Readability.js", "content/extract.js"],
      () => window.__pagecontext_extractArticle(),
    ),
    "Could not extract article from this page.",
    "Article text copied!",
    "Failed to extract article.",
  );
});

// Copy Full Page
document.getElementById("copy-page").addEventListener("click", () => {
  copyResult(
    () => injectAndRun(
      ["content/extract.js"],
      () => window.__pagecontext_extractPage(),
    ),
    "Page is empty.",
    "Full page copied!",
    "Failed to copy page.",
  );
});

// Pick Elements Mode
pickBtn.addEventListener("click", async () => {
  const enabling = !pickActive;
  try {
    if (enabling) {
      await injectOnTab(["content/annotate.js"]);
    } else {
      await runOnTab(() => {
        if (window.__pagecontext_disable) window.__pagecontext_disable();
      });
    }
    pickActive = enabling;
    pickBtn.classList.toggle("active", pickActive);
    pickControls.hidden = !pickActive;
  } catch (err) {
    showStatus("Cannot access this page.", "error");
  }
});

// Copy Selected Elements
document.getElementById("copy-picked").addEventListener("click", () => {
  copyResult(
    () => runOnTab(() =>
      window.__pagecontext_getSelected && window.__pagecontext_getSelected(),
    ),
    "No elements selected.",
    "Copied selected elements!",
    "Failed to copy.",
  );
});

// Clear Selected
document.getElementById("clear-picked").addEventListener("click", async () => {
  await runOnTab(() => {
    if (window.__pagecontext_clearSelected) window.__pagecontext_clearSelected();
  });
  showStatus("Selection cleared.", "success");
});
