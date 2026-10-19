"""Compare all decoded video frames, independently of MP4 container metadata."""
import hashlib
import json
import subprocess
from pathlib import Path


def probe(filename):
    result = subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0',
        '-show_entries', 'stream=codec_name,width,height,avg_frame_rate,nb_frames:format=duration', '-of', 'json', str(filename)])
    return json.loads(result)


def frames(filename):
    result = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(filename),
        '-map', '0:v:0', '-f', 'framemd5', '-']).decode()
    return [line.split(',')[-1].strip() for line in result.splitlines() if line and not line.startswith('#')]


info = json.loads(Path('out/master/render-info.json').read_text())
candidate = Path(info['output'])
metadata = probe(candidate)
stream = metadata['streams'][0]
assert (stream['width'], stream['height']) == (info['width'], info['height']), metadata
assert stream['codec_name'] == 'h264', metadata
assert stream['avg_frame_rate'] == f"{info['fps']}/1", metadata
assert int(stream['nb_frames']) == info['frames'], metadata
assert abs(float(metadata['format']['duration']) - info['durationSeconds']) < 1 / info['fps'] + .001, metadata
report = {'selected_reel': info, 'metadata': metadata, 'sha256': hashlib.sha256(candidate.read_bytes()).hexdigest()}
if info['id'] == 'earthrise':
    baseline = Path('verification/earthrise-approved.mp4')
    reference = Path('out/master/verification/earthrise-reference.mp4')
    new = frames(candidate)
    approved = frames(baseline)
    original = frames(reference)
    assert len(new) == len(approved) == len(original) == 300
    report['comparison'] = {
        'frames_checked': 300,
        'template_vs_original_matching_frames': sum(a == b for a, b in zip(new, original)),
        'template_vs_approved_matching_frames': sum(a == b for a, b in zip(new, approved)),
        'approved_sha256': hashlib.sha256(baseline.read_bytes()).hexdigest(),
    }
Path('out/master/comparison.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
if info['id'] == 'earthrise':
    assert report['comparison']['template_vs_original_matching_frames'] == 300, 'Template changed original rendered frames'
    assert report['comparison']['template_vs_approved_matching_frames'] == 300, 'Template differs from approved video; see comparison.json'
