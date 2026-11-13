# DevOps CI/CD Demo Application

A simple, production-style **Node.js + Express.js** application built for practicing DevOps workflows:
Git, automated testing, CI/CD pipelines, and deployment to Linux servers or the cloud (e.g. AWS EC2).

## Features

- Professional homepage showing app status and live server information
- `GET /health` – health check endpoint (for load balancers, monitoring, CI/CD smoke tests)
- `GET /api/info` – app name, version, Node.js version, environment, hostname
- Configuration via environment variables (`PORT`, `NODE_ENV`)
- 404 handler and centralized error handling
- Graceful shutdown on `SIGTERM` / `SIGINT`
- Automated tests with Jest + Supertest

## Project Structure

```
devops-cicd-demo/
├── server.js          # Express app: routes, 404 + error handlers, server startup
├── package.json       # Project metadata, dependencies, npm scripts
├── package-lock.json  # Exact dependency versions (use `npm ci` in CI)
├── .env.example       # Sample environment variables (copy to .env)
├── .gitignore         # Files Git must ignore (node_modules, .env, ...)
├── public/
│   ├── index.html     # Homepage
│   ├── style.css      # Homepage styles
│   └── script.js      # Fetches /api/info and /health to show live server info
└── tests/
    └── app.test.js    # Automated tests for /, /health, /api/info and 404
```

## Requirements

- Ubuntu Linux (or any OS) with **Node.js 18+** and npm

Install Node.js 20 LTS on Ubuntu (if not installed):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v && npm -v
```

## Getting Started

```bash
git clone <your-repo-url>
cd devops-cicd-demo
npm install
cp .env.example .env
npm start
```

Open http://localhost:3000 in your browser.

## npm Scripts

| Command | Description |
|---|---|
| `npm start` | Start the app |
| `npm run dev` | Start with auto-restart on file changes (`node --watch`) |
| `npm test` | Run automated tests |
| `npm run test:coverage` | Run tests with a coverage report |

In CI pipelines prefer `npm ci` over `npm install` (clean, reproducible install from `package-lock.json`).

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port the server listens on |
| `NODE_ENV` | `development` | `development`, `test`, `staging` or `production` |

Override without editing `.env`:

```bash
PORT=8080 NODE_ENV=production npm start
```

## API Endpoints

```bash
curl http://localhost:3000/health
# {"status":"UP","message":"Application is running successfully","uptimeSeconds":7,"timestamp":"..."}

curl http://localhost:3000/api/info
# {"appName":"DevOps CI/CD Demo Application","version":"1.0.0","nodeVersion":"v20.x","environment":"development",...}

curl -i http://localhost:3000/unknown
# HTTP/1.1 404 Not Found
```

## Security

- Never commit `.env` or real secrets; only `.env.example` with placeholder values is committed.
- `node_modules/` is ignored; dependencies are installed from `package.json` / `package-lock.json`.
