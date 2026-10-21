import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const CounterAnimation01 = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const value = Math.round(interpolate(frame, [0, 3 * fps], [0, 100], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));
  const persianNumber = String(value).replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);

  return <AbsoluteFill style={{
    backgroundColor: '#000', color: '#fff',
    fontFamily: '"Geeza Pro", "Noto Sans Arabic", Tahoma, Arial, sans-serif',
    alignItems: 'center', justifyContent: 'center',
  }}>
    <div lang="fa" dir="rtl" style={{position: 'absolute', top: 610,
      left: 100, right: 100, textAlign: 'center', fontSize: 62,
      lineHeight: 1.8, fontWeight: 400}}>درصد پیشرفت</div>
    <div lang="fa" dir="rtl" style={{position: 'absolute', top: 770,
      left: 80, right: 80, height: 380, display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: 260,
      lineHeight: 1, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>
      {persianNumber}
    </div>
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}
      style={{position: 'absolute', top: 1230, left: 180, width: 720,
        height: 18, border: '2px solid #fff', boxSizing: 'border-box'}}>
      <div style={{height: '100%', width: `${value}%`, backgroundColor: '#fff'}} />
    </div>
  </AbsoluteFill>;
};
