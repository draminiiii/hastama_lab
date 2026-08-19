# AGENTS.md

## Project Notes

- This is a FastAPI/Jinja application. App code lives under `app/`; tests live under `tests/`.
- Static frontend assets are in `app/static/` and templates are in `app/templates/`.
- The main UI surfaces are `user-panel.html` with `user-panel-style.css`/`user-panel-script.js`, and `admin.html` with `admin.css`/`admin.js`.

## Working Rules

- Preserve existing desktop layout and behavior unless a task explicitly asks to change it.
- Prefer scoped CSS/JS changes over broad rewrites.
- Keep RTL behavior intact for Persian UI.
- Avoid introducing horizontal page overflow; wide tables should scroll inside their own containers.
- Be careful with existing uncommitted changes. Do not revert user work.

## Useful Commands

- Run tests: `pytest`
- Run app locally: `make run`

## Theme (Light/Dark) Layer

- `app/static/css/dark-theme.css` + `app/static/js/theme.js` are the shared theme
  layer, loaded LAST in the `<head>` of every template.
- `theme.js` is the single source of truth: it sets BOTH legacy class names
  (`dark-mode` and `dark-theme`) on `<html>` and `<body>`, persists the choice in
  `localStorage` (`hastama-theme`), falls back to the OS preference, and injects a
  floating toggle on pages with no toggle of their own (the report pages).
- Any element with `data-action="toggle-theme"` (or `#themeToggleBtn` /
  `#themeToggleButton` / `.theme-toggle`) toggles the theme — no inline `onclick`.
- All dark rules live in `dark-theme.css` and are scoped under `body.dark-mode`;
  do not add dark colors to the per-page stylesheets.
- Never set colors via inline `style` in JS — inline styles beat the theme layer.
  Use a class (see the calendar `.holiday` / `.red-day` classes).
- Print always renders light; keep the `@media print` block at the end intact.
- Tests: `tests/test_dark_theme.py` (coverage) and `tests/test_dark_theme_dom.py`
  → `tests/js/theme.dom.test.js` (behavior).

## Responsive Tables Layer

- `app/static/js/responsive-tables.js` + `app/static/css/responsive-tables.css` are the
  shared mobile presentation layer for ALL tables (patterns: cards / list / scroll / keep).
- Mobile views are derived from the same `<table>` DOM (no duplicated API/business logic);
  interactive controls are moved into cards and restored on desktop/print.
- To add a table, register it in `CONFIGS` inside responsive-tables.js (see docs/mobile-tables.md).
- Keep `tests/test_responsive_tables.py` green; the jsdom suite lives in tests/js.
