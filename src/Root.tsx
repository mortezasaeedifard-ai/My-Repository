import {AbsoluteFill, CanvasImage, Composition, Easing, interpolate, useCurrentFrame, useVideoConfig, staticFile} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Earthrise = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      {/* A 1920px square covers the portrait canvas. Earth's center in the
          original photograph is approximately (56.8%, 51.7%). Its screen
          position stays fixed at (540, 993) while the camera pushes in.
          Only framing, uniform scale and opacity change; no photo filters. */}
      <CanvasImage
        src={staticFile('earthrise.jpg')}
        premountFor={fps}
        style={{
          position: 'absolute', width: 1920, height: 1920,
          maxWidth: 'none', left: 540 - 1920 * 0.568, top: 0,
          transformOrigin: '56.8% 51.7%',
          scale: interpolate(frame, [0, durationInFrames - 1], [1, 1.8], {
            ...clamp, easing: Easing.bezier(0.42, 0, 0.58, 1),
          }),
          opacity: interpolate(frame, [0, 1.6 * fps], [0, 1], {
            ...clamp, easing: Easing.bezier(0.22, 0, 0.36, 1),
          }),
        }}
      />
      <div
        lang="fa"
        dir="rtl"
        aria-label="برای دیدن خانه، چقدر باید دور شد؟"
        style={{
          position: 'absolute', top: 440, left: 100, right: 100,
          color: '#f4f3ef', textAlign: 'center',
          fontFamily: '"Vazirmatn", "Geeza Pro", "Noto Sans Arabic", Tahoma, Arial, sans-serif',
          fontSize: 68, fontWeight: 400, lineHeight: 1.85,
          whiteSpace: 'pre-line',
          opacity: interpolate(frame, [7 * fps, 8.2 * fps], [0, 1], {
            ...clamp, easing: Easing.bezier(0.22, 0, 0.36, 1),
          }),
          translate: `0 ${interpolate(frame, [7 * fps, 8.4 * fps], [18, 0], {
            ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1),
          })}px`,
        }}
      >{'برای دیدن خانه،\nچقدر باید دور شد؟'}</div>
    </AbsoluteFill>
  );
};

export const RemotionRoot = () => (
  <Composition id="Earthrise" component={Earthrise}
    width={1080} height={1920} fps={30} durationInFrames={300} />
);
