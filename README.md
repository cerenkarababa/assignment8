# Assignment 8 – Study Programme Information Server

**Student:** Ceren Karababa  
**Course:** Web Programming – Fall 2026

## Project status

This is the first development stage. The Express server, required routes, request middlewares, and initial browser interface have been added. Testing evidence, experiment observations, and the final self-study explanations will be completed after running the experiments.

## Requirements and restrictions

- Node.js with Express 5
- ES modules (`"type": "module"`)
- No Express add-on packages, database, template engine, front-end framework, or `nodemon`
- Browser page uses plain HTML, CSS, JavaScript, and the Fetch API

## Installation and running

```bash
npm install
npm start
```

For development with Node's built-in watch mode:

```bash
npm run dev
```

Then open <http://localhost:3000>.

## File organization

```text
assignment8/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Middleware decisions

The request logger and request counter are registered before static-file handling and all routes. Therefore, every request that reaches the application is logged and counted, including requests for static files and requests that receive a 404 response. The logger runs first so the incoming method and URL are recorded before the request continues; both middleware functions call `next()`.

## Route list

| Method | Path | Expected behaviour |
|---|---|---|
| GET | `/` | Serves the browser page |
| GET | `/hello` | Plain-text greeting |
| GET | `/robots.txt` | Plain-text robots instructions |
| GET | `/old-page` | Redirects to `/hello` |
| GET | `/api/courses` | Course array as JSON |
| GET | `/api/status` | Runtime status as JSON |
| GET | `/api/headers` | Request headers as JSON |
| POST | `/api/subscribe` | 201 response as JSON |
| GET | `/api/admin` | 403 response as JSON |
| GET | `/api/stats` | Request count as JSON |

## Remaining work

- [ ] Run and verify every route with curl.
- [ ] Add the actual `curl --include` output for the six required response categories.
- [ ] Perform the route-order and missing-`next()` experiments and record observations.
- [ ] Complete the status-code, configuration, dependencies, and same-origin explanations.
- [ ] Add official documentation notes for the self-study items.
- [ ] Describe challenges encountered during development.
