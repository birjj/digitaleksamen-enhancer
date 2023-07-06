<div align="center"><img src="./assets/ext/icon128.png" /></div>

# Digital Eksamen Enhancer

A browser extension to add new features to Digital Eksamen (and related subsystems).  
Not affiliated with Digital Eksamen in any way.

Planned features:

- [ ] Mass-upload questions using file-based configuration.

## Installation

Make sure Node and NPM are installed. Then:

<table><thead><tr><th>Chrome</th><th>Firefox</th></tr></thead>
<tbody><tr><td>

1. Download the repo
2. Run `npm install` and `npm run build`
3. Navigate to `chrome://extensions` in your browser and enable developer mode (toggle in top-right)
4. Click "Load unpacked" and choose the `dist` folder

</td><td>

1. Download the repo
1. Run `npm install` and `npm run build`
1. Manually remove the line containing `"use_dynamic_url": true` from `dist/manifest.json`
1. Navigate to `about:debugging#/runtime/this-firefox` (or go to `about:addons`, click the settings icon, and choose "Debug Add-ons")
1. Click "Load Temporary Add-on..." and choose the `dist/manifest.json` file.
1. Click the add-ons symbol in the taskbar, select the cog wheel next to Digital Eksamen Enhancer, and choose "Extension Can Read and Change Data: Always Allow on ..."

</td>