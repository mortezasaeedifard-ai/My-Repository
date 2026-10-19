import type {CSSProperties} from 'react';

export type Ease = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | [number, number, number, number];
export type Fade = {inSeconds?: number; outSeconds?: number; easing?: Ease};
export type Timing = {id: string; startSeconds: number; durationSeconds: number};
export type Camera = {
  width: number; height: number;
  focalPoint: {x: number; y: number};
  position: {x: number; y: number};
  scale: {from: number; to: number; startSeconds?: number; endSeconds?: number; easing?: Ease};
  pan?: {x: [number, number]; y: [number, number]};
  rotation?: [number, number];
};
export type MediaLayer = Timing & {
  kind: 'image' | 'video'; src: string; camera: Camera; fade?: Fade;
  trimBeforeSeconds?: number; playbackRate?: number; muted?: boolean; volume?: number;
};
export type TextLayer = Timing & {
  content: string; fade?: Fade;
  rise?: {pixels: number; durationSeconds: number; easing?: Ease};
  style?: CSSProperties;
};
export type AudioLayer = Timing & {
  src: string; trimBeforeSeconds?: number; playbackRate?: number;
  volume?: number; fade?: Fade; loop?: boolean;
};
export type ReelDefinition = {
  title: string; width: number; height: number; fps: number; durationSeconds: number;
  backgroundColor?: string; media: MediaLayer[]; texts: TextLayer[]; audio: AudioLayer[];
};
export type HistoricalReelProps = {reel: ReelDefinition};
