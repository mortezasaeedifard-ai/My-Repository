require('./load-typescript.cjs');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const {validateReel} = require('../src/templates/validate.ts');
const {animate, opacity} = require('../src/templates/animation.ts');
const catalog = require('../reels/catalog.json');
const protectedFiles = require('../verification/protected-files.json');

for (const [name, expected] of Object.entries(protectedFiles)) {
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(name)).digest('hex'), expected, `Protected file changed: ${name}`);
}
for (const [id, entry] of Object.entries(catalog)) {
  assert.match(id, /^[a-z0-9-]+$/);
  assert.match(entry.composition, /^[a-zA-Z0-9-]+$/);
  assert.match(entry.output, /^[a-z0-9-]+$/);
  if (!entry.definition) continue; // Custom compositions have their own authored timelines.
  const reel = validateReel(JSON.parse(fs.readFileSync(entry.definition, 'utf8')));
  for (const layer of [...reel.media, ...reel.audio]) {
    const asset = path.resolve('public', layer.src);
    assert.ok(asset.startsWith(path.resolve('public') + path.sep));
    assert.ok(fs.statSync(asset).isFile(), `Missing asset: ${asset}`);
  }
}
const earth = require('../reels/earthrise.json');
const camera = earth.media[0].camera;
assert.equal(animate(0, 0, 299, camera.scale.from, camera.scale.to, camera.scale.easing), 1);
assert.equal(animate(299, 0, 299, camera.scale.from, camera.scale.to, camera.scale.easing), 1.8);
assert.ok(Math.abs(animate(149.5, 0, 299, 1, 1.8, 'ease-in-out') - 1.4) < 1e-6);
for (let frame = 0; frame < 300; frame++) {
  const scale = animate(frame, 0, 299, 1, 1.8, 'ease-in-out');
  // Transforming around the authored focal point must leave it stationary.
  const left = camera.position.x - camera.width * camera.focalPoint.x;
  const origin = camera.width * camera.focalPoint.x;
  assert.ok(Math.abs(left + origin + (origin - origin) * scale - 540) < 1e-8);
  if (frame) assert.ok(scale >= animate(frame - 1, 0, 299, 1, 1.8, 'ease-in-out'));
}
assert.equal(opacity(0, 300, 30, earth.media[0].fade), 0);
assert.equal(opacity(48, 300, 30, earth.media[0].fade), 1);
assert.equal(opacity(89, 90, 30, {outSeconds: 1}), 0);
const badTimeline = structuredClone(earth);
badTimeline.audio.push({id: 'invalid audio', src: 'tone.wav', startSeconds: 9, durationSeconds: 3});
assert.throws(() => validateReel(badTimeline), /Invalid timeline/);
const duplicateID = structuredClone(earth);
duplicateID.texts[0].id = duplicateID.media[0].id;
assert.throws(() => validateReel(duplicateID), /unique/);
const unsafePath = structuredClone(earth);
unsafePath.media[0].src = '../private.jpg';
assert.throws(() => validateReel(unsafePath), /relative asset/);
console.log('Protected originals, assets, timeline validation, easing endpoints and focal point verified.');
