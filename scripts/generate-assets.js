#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const assets = [
  { file: path.join(__dirname, '..', 'assets', 'icons', 'app-icon.png'), data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNQTX4NAAIkAXSaGkHUAAAAAElFTkSuQmCC' },
  { file: path.join(__dirname, '..', 'assets', 'icons', 'app-icon-dark.png'), data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGPg5hcBAABXAC9VqRRhAAAAAElFTkSuQmCC' },
  { file: path.join(__dirname, '..', 'assets', 'icons', 'android-background.png'), data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNQTX4NAAIkAXSaGkHUAAAAAElFTkSuQmCC' },
  { file: path.join(__dirname, '..', 'assets', 'icons', 'android-foreground.png'), data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4//8/AAX+Av4N70a4AAAAAElFTkSuQmCC' },
  { file: path.join(__dirname, '..', 'assets', 'splash', 'splash-light.png'), data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNQTX4NAAIkAXSaGkHUAAAAAElFTkSuQmCC' },
  { file: path.join(__dirname, '..', 'assets', 'splash', 'splash-dark.png'), data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGPg5hcBAABXAC9VqRRhAAAAAElFTkSuQmCC' },
];

for (const asset of assets) {
  const dir = path.dirname(asset.file);
  fs.mkdirSync(dir, { recursive: true });
  const buffer = Buffer.from(asset.data, 'base64');
  fs.writeFileSync(asset.file, buffer);
  console.log(`Generated ${path.relative(path.join(__dirname, '..'), asset.file)}`);
}
