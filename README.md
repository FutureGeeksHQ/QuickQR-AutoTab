# QuickQR — Real-Time QR Generator

Manifest V3 Chrome extension with a persistent Side Panel.

## What changed in v1.1

- The QR tool now lives in Chrome's Side Panel.
- Open it once, then switch tabs normally.
- The active tab URL is detected automatically.
- Navigating to a different URL in the same tab also updates the QR automatically.
- No need to click the extension icon after every tab change.
- The toolbar icon opens the Side Panel.

Chrome 114+ supports the MV3 Side Panel API.

## Install

1. Put `qrcode.min.js` in this folder.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select this folder.
6. Click the QuickQR toolbar icon once to open the Side Panel.
7. Switch between tabs. The URL and QR update automatically.

## Important

The QR library must be present locally as `qrcode.min.js`.

The extension uses:
- `tabs` to read the active tab URL/title.
- `sidePanel` for a persistent browser panel.
