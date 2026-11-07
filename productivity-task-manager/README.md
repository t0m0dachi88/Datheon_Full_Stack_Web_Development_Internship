# Daymark — Productivity Task Manager

A dependency-free, responsive task manager built with semantic HTML, CSS and ES modules in vanilla JavaScript. Tasks remain in the browser's `localStorage` using the `productivity_tasks` key; the theme uses `daymark_theme`.

## Start

Run a local static web server from the project folder (ES modules are not reliably supported from `file://`):

```bash
python -m http.server 8000
```

Open http://localhost:8000. You can also deploy the folder to any static host, including Vercel (framework preset: Other; no build command; output directory: project root).

## Features

- Create, view, edit, complete, reactivate and delete tasks
- Categories, optional due dates and descriptions, and overdue/today/upcoming labels
- Combined status/category/search filtering and live dashboard statistics
- Drag and drop ordering, with persistence
- Confirmation for destructive actions
- Dark/light theme with saved preference and system preference on first visit
- Responsive mobile navigation, keyboard-accessible form and buttons
- No external dependencies, accounts or APIs

## Data and privacy

All task data is stored locally on the current browser and device. Clearing site data or using a different browser/device removes access to that data. There is no cloud backup or sync. If storage is unavailable, changes are not applied and an error is shown. Invalid existing storage is not silently overwritten.

## Structure

`index.html`, `css/style.css`, `js/app.js` (events and orchestration), `js/tasks.js` (task model), `js/storage.js` (persistence), `js/filters.js` (filtering), and `js/ui.js` (rendering).

## Manual verification

Test task creation with empty and valid titles, editing, deleting, completing and reactivating, category/status/search combinations, overdue dates, reload persistence, theme persistence, drag reordering, mobile menu, keyboard navigation, and blocked localStorage. This project has not been tested in every browser/device.
