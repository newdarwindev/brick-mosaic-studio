# Brick Mosaic Studio

A polished **canned interactive mockup**, not an AI generation service. Explore two original preset illustrations as flat brick-style mosaics: change grid size, reveal rows, toggle studs, and download illustrative placement instructions and a parts CSV. No uploads, accounts, API calls or payment flows.

[Live demo](https://newdarwindev.github.io/brick-mosaic-studio/) · [Desktop and mobile recordings](https://newdarwindev.github.io/brick-mosaic-studio/evidence/) · [CI and artifacts](https://github.com/newdarwindev/brick-mosaic-studio/actions/workflows/quality-pages.yml)

## Inspiration and limits

Inspired by the concept described in [BricksChat's public Reddit announcement](https://www.reddit.com/r/SideProject/comments/1x9cnre/i_built_brickschat_turn_images_into_complex_lego/), originally shared through [this shortlink](https://www.reddit.com/r/SideProject/s/wvTlmmGebC). The announcement and discussion were readable; the BricksChat app/gallery were not accessible during research. This is an original, deliberately narrower mockup, **not a recreation of the app's actual UI or capabilities**. No source code, branding, images, 3D models or instructions were copied. All preset artwork is drawn by our own Canvas code.

- No AI, image upload, 3D reconstruction, structural validation or official part matching.
- Each cell counts as one generic 1×1 tile; baseplates are not included.
- Palette names/hex values are illustrative, not manufacturer part/color IDs.
- Downloads describe the complete flat grid, regardless of the current row preview.
- Not affiliated with BricksChat or LEGO.

## Development and verification

```sh
npm ci
npm run dev
npm run check
npx playwright install --with-deps chromium
npm run test:ui
npm run evidence
```

Generated using GitHub's template workflow from `newdarwindev/public-demo-template` at verified source commit `99e0355701924e43f79263d40e4c0bfc60d42b4e`, specifically for this request. It does not establish an account-wide default.

The inherited quality contract is in [AGENTS.md](AGENTS.md). ESLint enforces complexity ≤8, depth ≤3, ≤3 parameters and ≤55-line functions without warnings; strict JS type checking, Prettier, unit tests and Vite build run before deployment. Desktop/mobile Playwright covers grid changes, repeated controls, row reveal, downloads, preset switching, reset, reload and overflow. Tests use only newly created synthetic preset data.

## Visual evidence and deployment

Every Playwright test records video, including passing tests. `npm run evidence` collects the WebM files into `dist/evidence/` and identifies the build commit. These are interaction recordings, not pixel-regression tests. The [public video gallery](https://newdarwindev.github.io/brick-mosaic-studio/evidence/) corresponds to the latest successfully deployed commit.

The Actions run also uploads `visual-evidence-RUN_ID` (test-results and HTML report) even on test failures; GitHub artifact downloads generally require login and expire after 14 days. Local report: `npx playwright show-report`. An infrastructure failure before browsers start may yield no video.

SHA-pinned Actions validate all PRs, including forks with read-only permissions and fresh builds. Only trusted main-branch pushes deploy Pages, after all quality/UI checks pass; deploy alone receives Pages/OIDC permissions. No repository secrets are needed. There is no TUI in this demo.
