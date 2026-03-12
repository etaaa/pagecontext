# PageContext

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-PageContext-4285F4?logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/fncinogbdidbbfnjgebeeloaamjlnmdn)
[![No Build Step](https://img.shields.io/badge/build-none-brightgreen)](#)


Copy what you see in your browser, paste it into any LLM.

LLMs can fetch public URLs, but they can't get past bot protection or see anything behind a login. PageContext grabs the content straight from your browser tab and puts it on your clipboard in a clean, paste-ready format, with a token estimate so you know what you're working with.

<p align="center">
  <img src="assets/screenshot.png" alt="PageContext popup" width="340">
</p>

## Features

- **Pick Elements**: hover and click to select specific containers on the page (like DevTools inspect mode), then copy their cleaned HTML.
- **Copy Article Text**: extract the main article using Mozilla's Readability.js and copy it as markdown with title and byline.
- **Copy Full Page**: copy the entire page's HTML with scripts, styles, iframes, and SVGs stripped out.
- **Token estimation**: every copy shows an approximate token count so you can gauge context usage before pasting.

No build step, no external dependencies, no data sent anywhere. Everything runs locally in your browser.

## Install

**[Install from the Chrome Web Store](https://chromewebstore.google.com/detail/fncinogbdidbbfnjgebeeloaamjlnmdn)**, the easiest way to get started.

Or install manually from source:

1. Clone this repository.
2. Open `chrome://extensions` in Chrome (or any Chromium browser).
3. Enable **Developer mode** in the top right.
4. Click **Load unpacked** and select the project folder.

The PageContext icon appears in your toolbar. Click it to open the popup.

## Usage

Open the popup and pick one of the three actions. The result is copied to your clipboard.

### Pick Elements

Click "Pick Elements" to enter inspect mode. Hover over elements to preview them, click to select. Click a selected element again to deselect it. Use "Copy Selected" to copy all selected elements, or "Clear All" to reset.

### Keyboard shortcuts

Two actions have global shortcuts that work without opening the popup:

| Action | Shortcut |
|---|---|
| Copy Article Text | `Alt+Shift+A` |
| Copy Full Page | `Alt+Shift+P` |

Customize these at `chrome://extensions/shortcuts`.

## Permissions

| Permission | Why |
|---|---|
| `activeTab` | Access the current tab's content when you click the extension |
| `scripting` | Inject content scripts to extract and clean page content |
| `offscreen` | Write to the clipboard from keyboard-shortcut triggers (service workers can't access the clipboard directly) |

## Contributing

Contributions are welcome. Please open an issue first if the change is non-trivial.

## License

MIT. See [LICENSE](LICENSE).

Readability.js is vendored from [@mozilla/readability](https://github.com/mozilla/readability) under the Apache 2.0 license.
