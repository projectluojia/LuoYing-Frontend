# Arknights-Style Web UI (Modular)

A polished single-page game-style web interface with pink-white-blue theming, bright-blue right-panel accents, custom SVG cursor, 3D parallax tilt, and mouse-driven particle effects. The project is refactored into modular HTML/CSS/JS files for maintainability and future feature expansion.

## Features

- Modular frontend architecture (`index.html` + separated CSS/JS modules)
- Pink-white-blue visual theme with bright-blue interactive emphasis
- Custom SVG cursor for default and interactive states
- Mouse parallax tilt for layered 3D motion
- Mouse trail and click burst particle effects on Canvas overlay

## Project Structure

```text
.
├── index.html
├── assets
│   ├── css
│   │   └── styles.css
│   ├── images
│   │   └── icons
│   │       ├── 图标_龙门币.png
│   │       ├── 图标_合成玉.png
│   │       └── 图标_源石.png
│   └── js
│       ├── main.js
│       ├── mouse-spark.js
│       └── ui-parallax.js
```

## Getting Started

This is a static frontend project with no build step required.

1. Open `index.html` directly in a browser, or
2. Serve the folder with a static server (recommended).

Example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Configuration Notes

- Visual styles: edit `assets/css/styles.css`
- Parallax behavior: edit `assets/js/ui-parallax.js`
- Particle effect parameters: edit `assets/js/main.js` and `assets/js/mouse-spark.js`
- Cursor SVG: edit the cursor rules in `assets/css/styles.css`
- Icon asset path convention in `index.html`: `./assets/images/icons/<filename>.png`

## Browser Compatibility

Modern Chromium, Firefox, and Safari versions are recommended for best Canvas and CSS transform performance.
