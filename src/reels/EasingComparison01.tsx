import {AbsoluteFill, CanvasImage, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fontFamily = '"Vazirmatn", "Geeza Pro", "Noto Sans Arabic", Tahoma, Arial, sans-serif';

export const EasingComparison01 = () => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const cycleFrames = 4 * fps;
  // Each four-second block includes both endpoints; reset exactly at frame 120.
  const cycleFrame = frame % cycleFrames;
  const panelHeight = height / 2;
  // Both panels share the same crop and Earth-centered, stationary zoom origin.
  const imageSize = width;
  const imageStyle = {
    position: 'absolute' as const, width: imageSize, height: imageSize,
    maxWidth: 'none', left: width / 2 - imageSize * 0.568,
    top: panelHeight / 2 - imageSize * 0.517,
    transformOrigin: '56.8% 51.7%',
  };
  const labelStyle = {
    position: 'absolute' as const, top: 64, left: 64, right: 64,
    color: '#f4f3ef', fontSize: 52, lineHeight: 1.6, fontWeight: 600,
    textAlign: 'right' as const,
  };
  const scaleLabelStyle = {
    position: 'absolute' as const, bottom: 82, left: 64,
    fontSize: 32, color: '#e5e7eb', fontVariantNumeric: 'tabular-nums',
  };
  const linearScale = interpolate(cycleFrame, [0, cycleFrames - 1], [1, 1.4], {...clamp, easing: Easing.linear});
  const easedScale = interpolate(cycleFrame, [0, cycleFrames - 1], [1, 1.4], {...clamp, easing: Easing.bezier(0.42, 0, 0.58, 1)});
  return <AbsoluteFill style={{backgroundColor: '#000', fontFamily}}>
    <div style={{position: 'absolute', top: 0, width, height: panelHeight, overflow: 'hidden'}}>
      <CanvasImage src={staticFile('earthrise.jpg')} premountFor={fps}
        style={{...imageStyle, scale: linearScale}} />
      <div lang="fa" dir="rtl" style={labelStyle}>
        <span style={{color: '#79dcf2'}}>حرکت خطی</span>
        <div dir="ltr" style={{fontSize: 28, fontWeight: 400, letterSpacing: 2}}>Linear</div>
      </div>
      <div dir="ltr" style={scaleLabelStyle}>{linearScale.toFixed(3)} ×</div>
    </div>
    <div style={{position: 'absolute', top: panelHeight, width, height: panelHeight, overflow: 'hidden'}}>
      <CanvasImage src={staticFile('earthrise.jpg')} premountFor={fps}
        style={{...imageStyle, scale: easedScale}} />
      <div lang="fa" dir="rtl" style={labelStyle}>
        <span style={{color: '#f6c883'}}>شروع و پایان آرام</span>
        <div dir="ltr" style={{fontSize: 28, fontWeight: 400, letterSpacing: 2}}>Ease-in-out</div>
      </div>
      <div dir="ltr" style={scaleLabelStyle}>{easedScale.toFixed(3)} ×</div>
    </div>
    <div style={{position: 'absolute', top: panelHeight - 1, height: 2, width, backgroundColor: '#ffffff55'}} />
    <div style={{position: 'absolute', bottom: 32, left: 64, right: 64}}>
      <div lang="fa" dir="rtl" style={{color: '#f4f3ef', fontSize: 25, marginBottom: 14}}>
        {'پیشرفت مشترک · دور ' + (frame < cycleFrames ? '۱' : '۲') + ' از ۲'}
      </div>
      <div style={{height: 8, backgroundColor: '#ffffff35', borderRadius: 8, overflow: 'hidden'}}>
        <div style={{height: '100%', backgroundColor: '#f4f3ef', width: `${interpolate(frame, [0, durationInFrames - 1], [0, 100], clamp)}%`}} />
      </div>
    </div>
  </AbsoluteFill>;
};
