"""Generate CI-only fixtures to exercise independent images, video, text and audio."""
import json
import subprocess
from pathlib import Path

folder = Path('public/_verification')
folder.mkdir(parents=True, exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=4', str(folder / 'tone.wav')], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=navy:s=320x568:r=30:d=2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', str(folder / 'clip.mp4')], check=True)
camera = {'width': 568, 'height': 568, 'focalPoint': {'x': .568, 'y': .517},
          'position': {'x': 160, 'y': 300}, 'scale': {'from': 1, 'to': 1.1, 'easing': 'ease-in-out'}}
reel = {'title': 'CI multimedia verification', 'width': 320, 'height': 568, 'fps': 30, 'durationSeconds': 2,
    'media': [
        {'id': 'Photo clip', 'kind': 'image', 'src': 'earthrise.jpg', 'startSeconds': 0, 'durationSeconds': 1.2, 'camera': camera,
         'fade': {'inSeconds': .2, 'outSeconds': .2}},
        {'id': 'Video clip', 'kind': 'video', 'src': '_verification/clip.mp4', 'startSeconds': 1, 'durationSeconds': 1,
         'camera': {'width': 320, 'height': 568, 'focalPoint': {'x': .5, 'y': .5}, 'position': {'x': 160, 'y': 284},
                    'scale': {'from': 1, 'to': 1}}, 'trimBeforeSeconds': .25, 'fade': {'inSeconds': .2}}],
    'texts': [
        {'id': 'First caption', 'content': 'آزمون تصویر', 'startSeconds': 0, 'durationSeconds': 1,
         'fade': {'inSeconds': .2, 'outSeconds': .2}, 'style': {'fontSize': 25, 'left': 20, 'right': 20, 'top': 80}},
        {'id': 'Second caption', 'content': 'آزمون ویدئو و صدا', 'startSeconds': 1, 'durationSeconds': 1,
         'rise': {'pixels': 10, 'durationSeconds': .3}, 'style': {'fontSize': 25, 'left': 20, 'right': 20, 'top': 80}}],
    'audio': [
        {'id': 'Background track', 'src': '_verification/tone.wav', 'startSeconds': 0, 'durationSeconds': 2, 'volume': .2,
         'loop': True, 'fade': {'inSeconds': .2, 'outSeconds': .2}},
        {'id': 'Delayed narration track', 'src': '_verification/tone.wav', 'startSeconds': .2, 'durationSeconds': 1.6,
         'trimBeforeSeconds': .1, 'playbackRate': 1.1, 'volume': .3, 'fade': {'inSeconds': .2, 'outSeconds': .2}}]}
Path('out/master/verification').mkdir(parents=True, exist_ok=True)
Path('out/master/verification/smoke-props.json').write_text(json.dumps({'reel': reel}))
