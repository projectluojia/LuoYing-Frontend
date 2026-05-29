# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Static single-page Arknights-style game UI. No build step, no framework, no package manager — vanilla HTML/CSS/JS served directly.

## Serving Locally

```bash
python -m http.server 8080
# Then open http://localhost:8080
```

No build/lint/test commands exist.

## JS Module Pattern

All JS files use IIFE wrappers to avoid global scope pollution, selectively attaching init functions to `window`:

- `window.initUiParallax(element)` — from `assets/js/ui-parallax.js`
- `window.initMouseSparkEffect(options)` — from `assets/js/mouse-spark.js`

`main.js` is the entry point, called on `DOMContentLoaded`.

## Layered Pointer-Events Strategy

The 3D parallax system uses a specific pointer-events layering approach:
- **Parent containers** (`.scene`, `.ui-layer`): `pointer-events: none` so 3D transforms don't block interaction
- **Interactive children** (`.btn-nav`, `.currency-item`): `pointer-events: auto` to be clickable through the inert parents

When adding interactive elements inside the parallax layer, always set `pointer-events: auto` on them.

## Particle System (mouse-spark.js)

Canvas overlay with `requestAnimationFrame` loop. Key patterns:
- **Object pooling** — `sparkPool` and `wavePool` arrays recycle particle objects to avoid GC pressure
- **Delta-time scaling** — capped at `maxDeltaMs = 100` for frame-rate independence
- **Additive blending** — uses `globalCompositeOperation: "lighter"` for glow effects

## Asset Convention

Icon paths in `index.html` follow: `./assets/images/icons/<filename>.png`
