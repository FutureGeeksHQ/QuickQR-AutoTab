# QuickQR — Real-Time QR Generator

Manifest V3 Chrome extension with a persistent Side Panel.

## What changed in v1.0.0

- The QR tool now lives in Chrome's Side Panel.
- Open it once, then switch tabs normally.
- The active tab URL is detected automatically.
- Navigating to a different URL in the same tab also updates the QR automatically.
- No need to click the extension icon after every tab change.
- The toolbar icon opens the Side Panel.

Chrome 114+ supports the MV3 Side Panel API.

## Install
1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select this folder.
5. Click the QuickQR toolbar icon once to open the Side Panel.
6. Switch between tabs. The URL and QR update automatically.

## Important

The QR library must be present locally as `qrcode.min.js`.

The extension uses:
- `tabs` to read the active tab URL/title.
- `sidePanel` for a persistent browser panel.
