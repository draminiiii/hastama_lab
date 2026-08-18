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

## Responsive Tables Layer

- `app/static/js/responsive-tables.js` + `app/static/css/responsive-tables.css` are the
  shared mobile presentation layer for ALL tables (patterns: cards / list / scroll / keep).
- Mobile views are derived from the same `<table>` DOM (no duplicated API/business logic);
  interactive controls are moved into cards and restored on desktop/print.
- To add a table, register it in `CONFIGS` inside responsive-tables.js (see docs/mobile-tables.md).
- Keep `tests/test_responsive_tables.py` green; the jsdom suite lives in tests/js.
