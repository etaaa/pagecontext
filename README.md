# PageContext

A Chrome extension that copies webpage content in clean, paste-ready formats for LLMs. LLMs can fetch public URLs, but they cannot bypass bot protection or see content behind login walls. PageContext bridges that gap by letting you copy exactly what you see in your browser and paste it into any LLM conversation.

## What it does

PageContext gives you three ways to grab content from any webpage:

- **Copy Article Text** extracts the main article using Mozilla's Readability.js and copies it as markdown with the title and byline.
- **Copy Full Page** copies the entire page's HTML with scripts, styles, iframes, and SVGs stripped out.
- **Pick Elements** lets you hover and click to select specific containers (like DevTools inspect mode), then copies their cleaned HTML.

The extension runs entirely in the browser with no build step, no external dependencies, and no data sent anywhere.

## Install

PageContext is not on the Chrome Web Store yet. To install it locally:

1. Clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable "Developer mode" in the top right.
4. Click "Load unpacked" and select the project folder.

The PageContext icon appears in your toolbar. Click it to open the popup.

## Usage

Open the popup and click one of the three action buttons. The result is copied to your clipboard.

### Keyboard shortcuts

Two actions have global shortcuts that work without opening the popup:

| Action | Shortcut |
|---|---|
| Copy Article Text | `Alt+Shift+A` |
| Copy Full Page | `Alt+Shift+P` |

You can customize these at `chrome://extensions/shortcuts`.

### Pick Elements

Click "Pick Elements" to enter inspect mode. Hover over elements to preview them, click to select. Click a selected element again to deselect it. Use "Copy Selected" to copy all selected elements, or "Clear All" to reset.

## License

Readability.js is vendored from [@mozilla/readability](https://github.com/nicovak/readability-js) under the Apache 2.0 license.
