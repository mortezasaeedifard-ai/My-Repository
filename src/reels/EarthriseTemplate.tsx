import definition from '../../reels/earthrise.json';
import {HistoricalReel} from '../templates/HistoricalReel';
import {parseReel} from '../templates/validate';

// JSON holds this reel's content/timing; its independent composition is in MasterRoot.
export const EarthriseTemplate = () => <HistoricalReel reel={parseReel(definition)} />;

export const earthriseMetadata = () => {
  const reel = parseReel(definition);
  return {width: reel.width, height: reel.height, fps: reel.fps, durationInFrames: Math.round(reel.durationSeconds * reel.fps)};
};
