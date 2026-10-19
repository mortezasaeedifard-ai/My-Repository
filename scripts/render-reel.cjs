const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const catalog = require('../reels/catalog.json');
const id = process.argv[2] || require('../reels/render-request.json').reel;
if (!Object.hasOwn(catalog, id)) throw new Error(`Unknown reel: ${id}. Available: ${Object.keys(catalog).join(', ')}`);
const entry = catalog[id];
const metadata = entry.definition ? JSON.parse(fs.readFileSync(entry.definition, 'utf8')) : entry;
const stamp = process.env.GITHUB_RUN_ID ? `${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT || '1'}` : new Date().toISOString().replace(/[:.]/g, '-');
const output = path.join('out', 'master', 'render', `${entry.output}-${stamp}.mp4`);
if (fs.existsSync(output)) throw new Error(`Refusing to overwrite an existing output: ${output}`);
fs.mkdirSync(path.dirname(output), {recursive: true});
const args = [path.join(path.dirname(require.resolve('@remotion/cli/package.json')), 'remotion-cli.js'), 'render', 'src/master.ts', entry.composition, output,
  '--codec=h264', '--pixel-format=yuv420p', '--concurrency=2'];
if (entry.composition === 'HistoricalReel' && entry.definition) {
  fs.writeFileSync('out/master/input-props.json', JSON.stringify({reel: metadata}));
  args.push('--props=out/master/input-props.json');
}
const result = spawnSync(process.execPath, args, {stdio: 'inherit'});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
fs.writeFileSync('out/master/render-info.json', JSON.stringify({id, composition: entry.composition, output,
  width: metadata.width, height: metadata.height, fps: metadata.fps,
  durationSeconds: metadata.durationSeconds, frames: Math.round(metadata.fps * metadata.durationSeconds)}, null, 2));
console.log(`Rendered ${output}`);
