import {Composition, Folder} from 'remotion';
import {CounterAnimation01} from './reels/CounterAnimation01';
import {EasingComparison01} from './reels/EasingComparison01';
import {RemotionRoot as OriginalEarthriseRoot} from './Root';
import {EarthriseTemplate, earthriseMetadata} from './reels/EarthriseTemplate';
import {HistoricalReel} from './templates/HistoricalReel';
import {validateReel} from './templates/validate';

export const MasterRoot = () => <>
  <OriginalEarthriseRoot />
  <Composition id="CounterAnimation01" component={CounterAnimation01}
    width={1080} height={1920} fps={30} durationInFrames={180} />
  <Composition id="EasingComparison01" component={EasingComparison01}
    width={1080} height={1920} fps={30} durationInFrames={240} />
  <Folder name="Historical-Reels">
    <Composition id="EarthriseTemplate" component={EarthriseTemplate}
      width={1080} height={1920} fps={30} durationInFrames={300} calculateMetadata={earthriseMetadata} />
    <Composition id="HistoricalReel" component={HistoricalReel}
      width={1080} height={1920} fps={30} durationInFrames={300}
      defaultProps={{reel: {
        title: 'Historical reel', width: 1080, height: 1920, fps: 30, durationSeconds: 10,
        media: [{id: 'Photograph', kind: 'image', src: 'earthrise.jpg', startSeconds: 0, durationSeconds: 10,
          camera: {width: 1920, height: 1920, focalPoint: {x: 0.568, y: 0.517}, position: {x: 540, y: 992.64}, scale: {from: 1, to: 1.8, easing: 'ease-in-out'}}}],
        texts: [], audio: [],
      }}}
      calculateMetadata={({props}) => {
        const reel = validateReel(props.reel);
        return {width: reel.width, height: reel.height, fps: reel.fps, durationInFrames: Math.round(reel.durationSeconds * reel.fps)};
      }} />
  </Folder>
</>;
