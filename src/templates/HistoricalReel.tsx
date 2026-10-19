import type {CSSProperties} from 'react';
import {Audio, Video} from '@remotion/media';
import {AbsoluteFill, CanvasImage, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {animate, opacity} from './animation';
import type {AudioLayer, HistoricalReelProps, MediaLayer, TextLayer} from './types';
import {validateReel} from './validate';

const Media = ({layer}: {layer: MediaLayer}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frames = Math.round(layer.durationSeconds * fps);
  const camera = layer.camera;
  const end = camera.scale.endSeconds === undefined ? frames - 1 : camera.scale.endSeconds * fps;
  const start = (camera.scale.startSeconds ?? 0) * fps;
  const style: CSSProperties = {
    position: 'absolute', width: camera.width, height: camera.height, maxWidth: 'none',
    left: camera.position.x - camera.width * camera.focalPoint.x,
    top: camera.position.y - camera.height * camera.focalPoint.y,
    transformOrigin: `${camera.focalPoint.x * 100}% ${camera.focalPoint.y * 100}%`,
    scale: animate(frame, start, end, camera.scale.from, camera.scale.to, camera.scale.easing),
    opacity: opacity(frame, frames, fps, layer.fade),
    ...(camera.pan ? {translate: `${animate(frame, start, end, ...camera.pan.x, camera.scale.easing)}px ${animate(frame, start, end, ...camera.pan.y, camera.scale.easing)}px`} : {}),
    ...(camera.rotation ? {rotate: `${animate(frame, start, end, ...camera.rotation, camera.scale.easing)}deg`} : {}),
  };
  return layer.kind === 'image' ? (
    <CanvasImage name={layer.id} src={staticFile(layer.src)} premountFor={fps} style={style} />
  ) : (
    <Video name={layer.id} src={staticFile(layer.src)} premountFor={fps} style={style}
      objectFit="cover" trimBefore={(layer.trimBeforeSeconds ?? 0) * fps}
      playbackRate={layer.playbackRate ?? 1} muted={layer.muted ?? true} volume={layer.volume ?? 1} />
  );
};

const Text = ({layer}: {layer: TextLayer}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <div lang="fa" dir="rtl" aria-label={layer.content.replace(/\n/g, ' ')} style={{
    position: 'absolute', top: 440, left: 100, right: 100, color: '#f4f3ef', textAlign: 'center',
    fontFamily: '"Vazirmatn", "Geeza Pro", "Noto Sans Arabic", Tahoma, Arial, sans-serif',
    fontSize: 68, fontWeight: 400, lineHeight: 1.85, whiteSpace: 'pre-line',
    ...layer.style,
    opacity: opacity(frame, Math.round(layer.durationSeconds * fps), fps, layer.fade),
    ...(layer.rise ? {translate: `0 ${animate(frame, 0, layer.rise.durationSeconds * fps, layer.rise.pixels, 0, layer.rise.easing)}px`} : {}),
  }}>{layer.content}</div>;
};

const Sound = ({layer}: {layer: AudioLayer}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <Audio name={layer.id} src={staticFile(layer.src)} premountFor={fps}
    trimBefore={(layer.trimBeforeSeconds ?? 0) * fps} playbackRate={layer.playbackRate ?? 1}
    loop={layer.loop ?? false}
    volume={(layer.volume ?? 1) * opacity(frame, Math.round(layer.durationSeconds * fps), fps, layer.fade)} />;
};

export const HistoricalReel = ({reel}: HistoricalReelProps) => {
  const {fps} = useVideoConfig();
  validateReel(reel);
  // These lists are intentionally config-driven: Codex edits each named JSON layer.
  // Custom manually edited timelines may instead author Media/Sequence nodes directly.
  return <AbsoluteFill style={{backgroundColor: reel.backgroundColor ?? '#000', overflow: 'hidden'}}>
    {reel.media.map(layer => <Sequence key={layer.id} name={layer.id}
      from={Math.round(layer.startSeconds * fps)} durationInFrames={Math.round(layer.durationSeconds * fps)} premountFor={fps}>
      <Media layer={layer} />
    </Sequence>)}
    {reel.texts.map(layer => <Sequence key={layer.id} name={layer.id}
      from={Math.round(layer.startSeconds * fps)} durationInFrames={Math.round(layer.durationSeconds * fps)} premountFor={fps}>
      <Text layer={layer} />
    </Sequence>)}
    {reel.audio.map(layer => <Sequence key={layer.id} name={layer.id}
      from={Math.round(layer.startSeconds * fps)} durationInFrames={Math.round(layer.durationSeconds * fps)} premountFor={fps}>
      <Sound layer={layer} />
    </Sequence>)}
  </AbsoluteFill>;
};
