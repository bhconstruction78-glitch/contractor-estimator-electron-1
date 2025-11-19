# Electron Desktop Wrapper - Build Instructions

This wrapper packages the existing contractor estimator backend + frontend into an Electron desktop app.
It includes scripts to build installers for Windows (NSIS .exe) and macOS (.dmg) using electron-builder.

## Quick start (development)
1. Install Node.js (v18+ or v20 recommended).
2. From the electron project root:
   - `npm install`
   - `npm run start`
   This will run the backend (node server.js) and open the Electron window pointing to http://localhost:3000.

## Build installers locally
To create production installers you need to install the dev dependencies and run electron-builder.

1. Install dependencies:
   - `npm install`
2. Build Windows installer (.exe) on Windows machine:
   - `npm run dist-win`
3. Build macOS DMG on macOS machine:
   - `npm run dist-mac`

**Important:** Cross-building macOS installers requires macOS-hosted builder (Apple toolchain). Use GitHub Actions (workflow included) for CI builds.

## CI builds (GitHub Actions)
A workflow is included: `.github/workflows/build.yml`. When you push to `main` or trigger workflow manually, it will produce build artifacts:
- Windows installer on windows-latest runner
- macOS DMG on macos-latest runner

## Code signing (recommended)
To avoid Gatekeeper warnings on macOS and SmartScreen on Windows, set up code signing certificates and configure `electron-builder` environment variables. See electron-builder docs.

## Icons
Place appropriate icons in `icons/`:
- `icon.ico` for Windows
- `icon.icns` for macOS
- `icon.png` 256x256 for resources

