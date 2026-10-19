import {Easing, interpolate} from 'remotion';
import type {Ease, Fade} from './types';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const easing = (value: Ease = 'ease-in-out') => {
  if (Array.isArray(value)) return Easing.bezier(...value);
  if (value === 'linear') return Easing.linear;
  if (value === 'ease-in') return Easing.bezier(0.42, 0, 1, 1);
  if (value === 'ease-out') return Easing.bezier(0, 0, 0.58, 1);
  return Easing.bezier(0.42, 0, 0.58, 1);
};
export const animate = (frame: number, start: number, end: number, from: number, to: number, ease?: Ease) =>
  end <= start ? (frame < start ? from : to) : interpolate(frame, [start, end], [from, to], {...clamp, easing: easing(ease)});

export const opacity = (frame: number, frames: number, fps: number, fade?: Fade) => {
  const incoming = fade?.inSeconds ? animate(frame, 0, fade.inSeconds * fps, 0, 1, fade.easing) : 1;
  const outgoing = fade?.outSeconds ? animate(frame, frames - 1 - fade.outSeconds * fps, frames - 1, 1, 0, fade.easing) : 1;
  return incoming * outgoing;
};
