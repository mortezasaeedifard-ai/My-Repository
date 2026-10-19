# Historical reels: project continuity

- This is a shared Remotion installation for conversation-driven historical reels.
- Read MASTER-GUIDE.fa.md before adding a reel. Keep all installed versions fixed
  unless the user requests a dependency change. @remotion/media 4.0.534 was already
  installed; it is now declared directly. Do not run npm ci locally: it removes
  node_modules. TypeScript and the CLI are already installed.
- Preserve src/Root.tsx, src/index.ts, public/earthrise.jpg and the approved
  out/earthrise-final.mp4. Check verification/protected-files.json. New work must
  use src/master.ts and separate compositions/definitions. Do not rerun the old
  work/create_project.py scaffolder; it overwrites the project with an old version.
- Do not delete caches, node_modules, browser downloads, previous projects or
  outputs. New local outputs need unique names. Never overwrite the approved MP4.
- Standard reels use reels/<id>.json and HistoricalReel. For an independently
  authored timeline, add src/reels/<Name>.tsx and an explicit Composition in
  MasterRoot.tsx. Register each render target in reels/catalog.json. Generic
  config-driven reels can use composition HistoricalReel directly.
- Add new media under public/reels/<id>/. Define explicit image focal points,
  scene timing, Persian texts, fades and audio timing. Do not invent historical
  claims, sources, narration or music rights; use provided content or research
  separately when requested. Keep original photographs unchanged.
- Update reels/render-request.json to select the intended automatic push render.
  Add independent Composition nodes in MasterRoot and update the workflow choice
  list when adding dedicated compositions. For custom compositions, the catalog
  must include width, height, fps and durationSeconds for output verification.
- Verify with npm run typecheck and npm run check:master before publishing.
  The existing approved destination is mortezasaeedifard-ai/My-Repository (public).
  Respect the user's authorization for each upload, especially newly supplied
  private media. Do not create or change repository visibility without consent.
- Local Chromium may be blocked by Codex's macOS sandbox. Use the GitHub Actions
  workflow Render Historical Reel when authorized. Do not bypass sandbox policy.
  Monitor runs, fix actionable failures, retrieve MP4 artifacts and provide an
  actual local video link. Do not report success based only on compilation.
- Keep the original Earthrise workflow manually runnable; the master workflow
  owns automatic push renders to avoid two jobs for every new reel.
- Changes to HistoricalReel must preserve Earthrise pixel comparison. The CI
  checks all 300 decoded frames against both the original component and approved
  video, plus a short image/video/Persian/audio integration render.
