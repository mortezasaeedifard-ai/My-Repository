import array
import json
import math
import subprocess
from pathlib import Path

filename = 'out/master/verification/multimedia-smoke.mp4'
metadata = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', filename]))
video = next(s for s in metadata['streams'] if s['codec_type'] == 'video')
assert (video['width'], video['height'], int(video['nb_frames'])) == (320, 568, 60)
assert any(s['codec_type'] == 'audio' for s in metadata['streams']), 'Missing rendered audio'
samples = array.array('f', subprocess.check_output(['ffmpeg', '-v', 'error', '-i', filename, '-map', '0:a:0', '-ac', '1', '-ar', '8000', '-f', 'f32le', '-']))
rms = math.sqrt(sum(v * v for v in samples) / len(samples))
assert rms > .005, f'Rendered audio unexpectedly silent: {rms}'
report = {'video_frames': 60, 'width': 320, 'height': 568, 'audio_rms': rms, 'passed': True}
Path('out/master/verification/multimedia-check.json').write_text(json.dumps(report, indent=2))
print(report)
