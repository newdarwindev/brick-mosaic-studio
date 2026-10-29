# Public demo template

A small vanilla JavaScript app with a serious quality baseline.

[![Quality and Pages](https://github.com/newdarwindev/public-demo-template/actions/workflows/quality-pages.yml/badge.svg)](https://github.com/newdarwindev/public-demo-template/actions/workflows/quality-pages.yml)

**[Live demo](https://newdarwindev.github.io/public-demo-template/)** ·
**[Watch visual test videos](https://newdarwindev.github.io/public-demo-template/evidence/)** ·
**[CI runs and downloadable artifacts](https://github.com/newdarwindev/public-demo-template/actions/workflows/quality-pages.yml)**

## Start a new demo

Use GitHub's **Use this template → Create a new repository**, or:

```sh
gh repo create YOUR-OWNER/YOUR-DEMO --public --template newdarwindev/public-demo-template --clone
cd YOUR-DEMO
npm ci
npm run dev
```

Then update this README's owner/repository links and package name, replace the
sample, and keep the contract in [AGENTS.md](AGENTS.md). In the **new** repo's
Settings → Pages, select **GitHub Actions** as the source (repository-owner
setup, not an automatic account-wide setting). Push a change or dispatch the
workflow. Template generation does not copy Pages settings and may not start CI
until the first push/dispatch. This repo sets no global policy for other repos.

## Quality gates

```sh
npm ci
npm run check
npx playwright install --with-deps chromium
npm run test:ui
npm run evidence
```

- ESLint recommended plus complexity **8**, depth **3**, parameters **3**,
  function length **55**; zero warnings allowed.
- Prettier check, TypeScript strict `checkJs`, Node unit tests, static Vite build.
- Desktop and mobile Chromium interactions: repeated clicks, lower bound, reset,
  reload, and horizontal overflow. Unit tests cover the upper bound too.
- Playwright records **every test**, including passing tests. These are functional
  UI tests with visual evidence, not screenshot-baseline/pixel-diff tests.
- Pull requests validate and upload evidence but cannot deploy. Default branch
  pushes deploy only after validation succeeds. Actions are SHA-pinned; only the
  deploy job receives `pages: write` and `id-token: write`.

## Visual evidence

The public [video gallery](https://newdarwindev.github.io/public-demo-template/evidence/)
contains WebM recordings from the latest **successfully deployed** default-branch
commit, with its SHA. It needs no GitHub login. It is not evidence of newer failed
runs. Locally, `npm run evidence` builds the same gallery in `dist/evidence/`.

For any specific run, open [Actions](https://github.com/newdarwindev/public-demo-template/actions/workflows/quality-pages.yml),
choose the run, and download **visual-evidence-RUN_ID** from Artifacts. The ZIP
includes `test-results/` videos and failure traces/screenshots plus
`playwright-report/` (open its `index.html` via `npx playwright show-report`).
GitHub artifact downloads generally require a signed-in GitHub account. Artifacts
expire after **14 days**; the public Pages gallery persists until replaced.
Uploads run even after failures; an infrastructure failure before browser startup
may produce no video, and CI must not be described as having visual evidence then.

The example has a browser UI, not a TUI. See the
[TUI recording adaptation guide](docs/tui-recordings.md) when adding one.

## Stack and scope

Node 22, vanilla ES modules, Vite, ESLint, Prettier, TypeScript checkJs, and
Playwright. No runtime dependencies, credentials, backend, telemetry, or storage.
The counter deliberately resets on reload. All example content is synthetic.

## References

- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Playwright video recording](https://playwright.dev/docs/videos)
- [ESLint complexity rule](https://eslint.org/docs/latest/rules/complexity)
