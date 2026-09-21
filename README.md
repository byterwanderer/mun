# Mun

A Frappe/ERPNext application for running a **Model United Nations (MUN)** conference workflow.

This repository contains:
- A Frappe app (`mun`) with MUN-focused DocTypes, workspace shortcuts, and a delegate application web form.
- A React + TypeScript conference display app (`mun-details-screen`) that is built and served through Frappe assets.

## Table of contents
- [Overview](#overview)
- [Key features](#key-features)
- [Repository structure](#repository-structure)
- [Technology stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Setup and installation](#setup-and-installation)
- [Running the apps](#running-the-apps)
- [Testing and CI](#testing-and-ci)
- [Deployment notes](#deployment-notes)
- [License](#license)

## Overview

`mun` is intended to support conference operations such as:
- Managing committees, delegates, delegations, and team members.
- Recording motions and grading information during committee sessions.
- Collecting registrations through a delegate application web form.
- Displaying conference session state on a dedicated screen UI.

The app declares dependencies on:
- `erpnext`
- `hrms`

## Key features

### Frappe app (`mun`)
- **Core MUN DocTypes**:
  - `Committee`
  - `Delegate`
  - `Team Member`
  - `Delegation`
  - `Delegate Applications`
  - `Motions`
  - `Grading Sheet`
  - `Certificate`
- **Workspace**: `MUN Tools` with shortcuts and dashboard charts.
- **Web Form**: `delegate-application` with client-side field behavior based on registration type.
- **Website routes** for conference details screen pages.

### Frontend conference display (`mun-details-screen`)
- Committee selection and route-based committee pages (`/:committee`).
- Roll call workflow with present-country tracking.
- Speaker queue and speech timer handling.
- Motion passing and debate timer controls.
- Conference stage progression (`Not Started` → `Roll Call` → `Opening Speeches` → `Debate` → `Voting` → `Closed`).
- Crisis mode toggle with dedicated alert/debate flow.

## Repository structure

```text
.
├── mun/                              # Frappe app package
│   ├── hooks.py
│   ├── modules.txt
│   ├── doctype/                      # MUN DocTypes
│   ├── web_form/delegate_application/
│   ├── workspace/mun_tools/
│   ├── public/mun-details-screen/    # Built frontend assets output
│   └── www/mun-details-screen.html   # Frappe web entry HTML
├── mun-details-screen/               # React + TS + Vite source app
├── pyproject.toml
└── .github/workflows/ci.yml
```

## Technology stack

- **Backend/App framework**: Frappe (Python)
- **Business app dependencies**: ERPNext, HRMS
- **Frontend**: React, TypeScript, Vite, TailwindCSS, Radix UI
- **Database/infra (CI)**: MariaDB + Redis

## Prerequisites

- Python **3.10+**
- Node.js **18+**
- Yarn
- A working Frappe Bench environment
- MariaDB and Redis (required for full local Frappe execution)

## Setup and installation

### 1) Get the app into a Bench instance

From your bench directory:

```bash
bench get-app mun <path-or-url-to-this-repository>
bench new-site <site-name>
bench --site <site-name> install-app mun
```

Because this app depends on ERPNext and HRMS, ensure both are available in your bench and installed where needed.

### 2) Install and build the conference display frontend

From the repository root:

```bash
cd mun-details-screen
yarn install
yarn build
```

`yarn build` outputs static assets into:
- `mun/public/mun-details-screen/`

and copies the HTML entry file to:
- `mun/www/mun-details-screen.html`

## Running the apps

### Run Frappe site

Use normal bench workflow (from your bench directory):

```bash
bench start
```

### Run frontend in development mode

From `mun-details-screen`:

```bash
yarn dev
```

The Vite dev server is configured to proxy Frappe endpoints (`/app`, `/api`, `/assets`, etc.) to the current bench webserver.

## Testing and CI

### Automated CI workflow

GitHub Actions (`.github/workflows/ci.yml`) runs:
- Environment setup with Python 3.10 and Node 18
- Bench initialization
- App installation on a test site
- `bench --site test_site run-tests --app mun`

### Local test command

From your bench directory:

```bash
bench --site <site-name> run-tests --app mun
```

## Deployment notes

- Build frontend assets before deploying updates to the conference display.
- Ensure `erpnext` and `hrms` are present in the target environment.
- Keep site routes aligned with `website_route_rules` in `mun/hooks.py`.

## License

`mun` is licensed under the **Unlicense**. See [license.txt](license.txt).
