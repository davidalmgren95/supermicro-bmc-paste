# supermicro-bmc-paste

Chrome and Firefox extension to paste text into Supermicro BMC virtual console via right-click menu.

## Installation

Run `npm install` once to fetch dependencies before building for any browser.

### Chrome
1. Run `npm run build:chrome`
1. Go to `chrome://extensions`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist` folder

### Firefox
```bash
# Install web-ext if not already
npm install -g web-ext

# Run extension in development
npm run build:firefox
web-ext run --source-dir=dist
```

Manual load alternative:
1. Run `npm run build:firefox`
2. Open `about:debugging`
3. Click "This Firefox" → "Load Temporary Add-on..."
4. Select `dist/manifest.json`

## Usage

Right-click on the page → "Supermicro - Paste Text into virtual console" → Enter text → Submit

Supports:
- Special characters (`@`, `#`, `$`, etc.)
- Capital letters with Shift
- Newlines (Enter key)
- Optional "Press Enter after typing" checkbox

```bash
# Install dependencies
npm install

# Development (watch mode)
npm run dev

# Build for Chrome
npm run build:chrome

# Build for Firefox
npm run build:firefox
```

## Browser Compatibility

- **Chrome**: 88+
- **Firefox**: 109+

Uses `webextension-polyfill` for cross-browser API compatibility.
