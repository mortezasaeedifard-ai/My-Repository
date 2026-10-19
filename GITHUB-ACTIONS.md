# Earthrise on GitHub Actions

This project folder is intended to be the repository root. Keep `.github/`,
`src/`, `public/`, `package.json`, `package-lock.json`, and `tsconfig.json` together.
Do not upload `node_modules/`, render outputs, or local browser binaries.

The workflow uses Ubuntu 24.04 and Node.js 24.22.0. `npm ci` installs the current
locked dependencies, including Remotion 4.0.534 and React 19.0.0, without upgrades.
The existing Earthrise composition determines 1080x1920, 300 frames and 30fps.
Its scale runs from 1 to 1.8 with ease-in-out and a fixed Earth-centered origin.
The workflow does not edit animation code or disable system security settings.

The original photo must be committed at `public/earthrise.jpg`. The workflow
checks both Git tracking and its SHA-256 before rendering. It installs Noto Sans
Arabic on Ubuntu, matching the existing font fallback. Text appearance can differ
slightly from Geeza Pro on macOS.

After a push to `main` affecting the project, the workflow runs automatically.
For another run in GitHub's graphical interface, open the repository, select
**Actions → Render Earthrise MP4 → Run workflow → main → Run workflow**.

The renderer creates `out/earthrise-final.mp4`. FFprobe checks H.264 encoding,
resolution, frame rate, duration and frame count before upload. The run publishes
an artifact named **earthrise-final.mp4**, retained for 14 days. Open a completed
run, select that artifact under **Artifacts**, extract the downloaded archive,
and open the MP4. The run summary also includes the artifact link.

No remote repository has been initialized or updated by preparing these files.
The image is present locally; remote presence must be verified after the approved
upload. A live workflow-run URL can only be provided after an approved push/run.
