# Repository Guidelines

## Project Structure & Module Organization
- `index.html` owns the landing page layout and analytics tags; assets live in `static/` with CSS overrides in `static/css`, JavaScript interactions in `static/js/index.js`, and media under `static/images`, `static/videos`, and `static/pdf`.
- `static/trajs/<task_id>/` stores task configs plus `traj.jsonl`; running `convert_task.py` aggregates them into `static/trajs/trajectory.jsonl`, which `static/js/index.js` streams into the UI.
- Keep new data or tooling scripts colocated with their consumers (for example, helper JS beside `index.js`) to avoid paths drifting.

## Build, Test, and Development Commands
- `python3 -m http.server 8000` — serves the repo root and lets you preview at `http://localhost:8000`; keeping it simple avoids extra build deps.
- `python3 convert_task.py` — rebuilds `static/trajs/trajectory.jsonl` after editing any `config.json` or `traj.jsonl`; rerun before committing trajectory changes.
- `npx serve static` (optional) — quick asset-only preview when you only tweak CSS/JS under `static/`.

## Coding Style & Naming Conventions
- HTML and CSS use two-space indentation, lowercase tags, and double-quoted attributes/classes (see `index.html` and `static/css/index.css`).
- JavaScript follows the existing `static/js/index.js` style: four-space (or tab equivalent) blocks, `const/let` over `var` when adding code, and descriptive camelCase identifiers (e.g., `preloadTrajectoryImages`).
- Favor hyphenated class names (`.trajectory-main`) and keep file names lowercase with hyphens (e.g., `trajectory-panel.html`). Run `npx prettier --write index.html static/js/index.js` if you already have Prettier installed; otherwise, match surrounding formatting manually.

## Testing Guidelines
- After content or styling changes, refresh the local server in Chrome and Firefox and confirm there are no console errors, broken Bulma carousels, or missing fonts.
- For trajectory updates, open the “Trajectory Viewer” tabs, ensure each ID renders screenshots without 404s, and watch the play controls to verify keyboard/mouse indicators animate.
- No automated coverage target exists, but strive to exercise every interactive widget (navbar burger, sliders, carousels) before opening a PR.

## Commit & Pull Request Guidelines
- Recent history shows terse messages (`update`), but please prefer imperative, descriptive summaries such as `feat: add osworld carousel captions` and reference issues when possible.
- Each PR should describe what changed, how to repro locally (commands above), and include screenshots or GIFs for UI-visible adjustments; link data tickets when touching `static/trajs`.
- Confirm linting/formatting commands (or manual checks) ran locally and state that status in the PR checklist.

## Data & Deployment Notes
- Large binaries belong in `static/videos` or `static/images` and should be compressed (webp/mp4) before commit.
- When adding tasks, keep `config.json` UTF-8 encoded, name directories with lowercase snake_case IDs, and avoid embedding credentials in trajectories.
- Production hosting serves the repo as-is, so never leave placeholder TODOs or commented CDN links enabled unless they are required for runtime.
