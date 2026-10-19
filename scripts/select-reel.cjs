const fs = require('node:fs');
const catalog = require('../reels/catalog.json');
const id = process.env.REEL_ID || require('../reels/render-request.json').reel;
if (!Object.hasOwn(catalog, id) || !/^[a-z0-9-]+$/.test(id)) throw new Error(`Unknown reel: ${id}`);
if (process.env.GITHUB_ENV) fs.appendFileSync(process.env.GITHUB_ENV, `REEL_ID=${id}\n`);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `reel=${id}\n`);
console.log(`Selected reel: ${id}`);
