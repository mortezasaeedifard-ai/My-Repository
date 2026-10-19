import type {Ease, ReelDefinition} from './types';

const validateEase = (value?: Ease) => {
  if (value === undefined) return;
  if (Array.isArray(value)) {
    if (value.length !== 4 || !value.every(Number.isFinite) || value[0] < 0 || value[0] > 1 || value[2] < 0 || value[2] > 1) throw new Error('Invalid Bezier easing');
  } else if (!['linear', 'ease-in', 'ease-out', 'ease-in-out'].includes(value)) throw new Error('Unknown easing');
};

const positive = (value: number, name: string) => {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be positive`);
};
export const validateReel = (reel: ReelDefinition): ReelDefinition => {
  for (const key of ['width', 'height', 'fps', 'durationSeconds'] as const) positive(reel[key], key);
  if (![reel.width, reel.height, reel.fps].every(Number.isInteger)) throw new Error('Dimensions and fps must be integers');
  if (Math.round(reel.durationSeconds * reel.fps) < 2) throw new Error('A reel needs at least two frames');
  const ids = new Set<string>();
  for (const layer of [...reel.media, ...reel.texts, ...reel.audio]) {
    if (!layer.id || ids.has(layer.id)) throw new Error('Layer IDs must be unique');
    ids.add(layer.id);
    positive(layer.durationSeconds, layer.id);
    if (!Number.isFinite(layer.startSeconds) || layer.startSeconds < 0 ||
      layer.startSeconds + layer.durationSeconds > reel.durationSeconds + 1e-7 ||
      Math.round(layer.durationSeconds * reel.fps) < 1) throw new Error(`Invalid timeline for ${layer.id}`);
    if ('src' in layer && (!layer.src || layer.src.startsWith('/') || layer.src.split('/').includes('..') || /^[a-z]+:/i.test(layer.src))) {
      throw new Error(`Use a public-folder relative asset path for ${layer.id}`);
    }
    for (const seconds of [layer.fade?.inSeconds, layer.fade?.outSeconds]) {
      if (seconds !== undefined && (!Number.isFinite(seconds) || seconds < 0 || seconds > layer.durationSeconds)) throw new Error(`Invalid fade for ${layer.id}`);
    }
    validateEase(layer.fade?.easing);
    if ('playbackRate' in layer && layer.playbackRate !== undefined) positive(layer.playbackRate, 'playbackRate');
    if ('trimBeforeSeconds' in layer && layer.trimBeforeSeconds !== undefined && (!Number.isFinite(layer.trimBeforeSeconds) || layer.trimBeforeSeconds < 0)) throw new Error('Invalid media trim');
    if ('volume' in layer && layer.volume !== undefined && (!Number.isFinite(layer.volume) || layer.volume < 0 || layer.volume > 1)) throw new Error('Volume must be between 0 and 1');
  }
  for (const layer of reel.media) {
    if (!['image', 'video'].includes(layer.kind)) throw new Error('Unsupported media kind');
    const camera = layer.camera;
    validateEase(camera.scale.easing);
    positive(camera.width, 'camera.width'); positive(camera.height, 'camera.height');
    positive(camera.scale.from, 'scale.from'); positive(camera.scale.to, 'scale.to');
    for (const coordinate of [camera.focalPoint.x, camera.focalPoint.y]) {
      if (!Number.isFinite(coordinate) || coordinate < 0 || coordinate > 1) throw new Error('Focal point must be normalized to 0..1');
    }
    const start = camera.scale.startSeconds ?? 0;
    const end = camera.scale.endSeconds ?? (Math.round(layer.durationSeconds * reel.fps) - 1) / reel.fps;
    if (start < 0 || end <= start || end > layer.durationSeconds || !Number.isFinite(start + end)) throw new Error(`Invalid camera timing for ${layer.id}`);
    if (![camera.position.x, camera.position.y, ...(camera.pan?.x ?? []), ...(camera.pan?.y ?? []), ...(camera.rotation ?? [])].every(Number.isFinite)) throw new Error('Camera coordinates must be finite');
  }
  for (const text of reel.texts) {
    validateEase(text.rise?.easing);
    if (text.rise && (!Number.isFinite(text.rise.pixels) || text.rise.durationSeconds < 0 || !Number.isFinite(text.rise.durationSeconds))) throw new Error('Invalid text animation');
  }
  return reel;
};

export const parseReel = (value: unknown): ReelDefinition => {
  if (!value || typeof value !== 'object' || !('media' in value) || !Array.isArray(value.media) ||
    !('texts' in value) || !Array.isArray(value.texts) || !('audio' in value) || !Array.isArray(value.audio)) {
    throw new Error('A reel must have media, texts and audio arrays');
  }
  return validateReel(value as ReelDefinition);
};
