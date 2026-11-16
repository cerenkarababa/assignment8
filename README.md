# Express.js Study Programme API

A simple REST API built with Node.js and Express 5 as part of a Web Programming assignment.

This project demonstrates routing, middleware, HTTP methods, status codes, static file serving, and the Fetch API.

## Features

- Express 5 server using ES modules
- Custom middleware for request logging and counting
- REST API endpoints
- HTTP status codes and redirects
- Static file serving
- Browser-based API testing with the Fetch API
- JSON and plain-text error responses
- Request timing and response information displayed in the browser

## Technologies Used

- Node.js
- Express 5
- JavaScript (ES Modules)
- HTML5
- CSS3
- Fetch API
- Git and GitHub

## Project Repository

GitHub: [https://github.com/cerenkarababa/assignment8](https://github.com/cerenkarababa/assignment8)

## Project Structure

```text
assignment8/
│
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/cerenkarababa/assignment8.git
```

### 2. Navigate to the project folder

```bash
cd assignment8
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
npm start
```

The server runs at:

```text
http://localhost:3000
```

Open this address in your browser to access the application.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Serves the homepage |
| GET | `/hello` | Returns a plain-text greeting |
| GET | `/robots.txt` | Returns robots.txt content |
| GET | `/old-page` | Redirects to `/hello` |
| GET | `/api/courses` | Returns a list of courses |
| GET | `/api/status` | Returns server status and Node.js information |
| GET | `/api/headers` | Returns selected request headers |
| POST | `/api/subscribe` | Simulates a subscription |
| GET | `/api/admin` | Returns a forbidden response |
| GET | `/api/stats` | Returns the request counter |
| GET | `/api/unknown` | Demonstrates API 404 handling |
| GET | `/unknown` | Demonstrates page 404 handling |

## Middleware

The application uses two custom middleware functions before the route definitions.

### Request Logger

The request logger records:
- Current date and time
- HTTP method
- Requested URL

It uses `next()` to pass control to the next middleware or route handler.

### Request Counter

The request counter increases the request count whenever a request reaches the middleware.

The counter includes requests for static files and requests that result in a 404 response.

## Testing with cURL

The following commands were used to test the API endpoints from the terminal.

### 1. GET /api/courses

```bash
curl --include http://localhost:3000/api/courses
```

Expected response: `200 OK`

Returns a JSON array containing at least three course objects. Each course includes an ID, title, and credits.

### 2. POST /api/subscribe

```bash
curl --include -X POST http://localhost:3000/api/subscribe
```

Expected response: `201 Created`

Response body:

```json
{
  "subscribed": true
}
```

### 3. GET /api/admin

```bash
curl --include http://localhost:3000/api/admin
```

Expected response: `403 Forbidden`

Response body:

```json
{
  "error": "Forbidden"
}
```

### 4. GET /old-page

```bash
curl --include http://localhost:3000/old-page
```

Expected response: `302 Found`

The response redirects the client to:

```text
/hello
```

### 5. GET /api/unknown

```bash
curl --include http://localhost:3000/api/unknown
```

Expected response: `404 Not Found`

Response body:

```json
{
  "error": "Not found"
}
```

### 6. GET /unknown

```bash
curl --include http://localhost:3000/unknown
```

Expected response: `404 Not Found`

Response body:

```text
Page not found
```

## Browser Interface

The frontend provides buttons to test the API endpoints without using the terminal.

It uses the browser's Fetch API to send requests to the Express server.

The interface displays:
- HTTP response status
- Response body
- Content type
- Response time
- Error messages when a request fails

The buttons are temporarily disabled while a request is being processed.

## Experiments and Observations

### Experiment 1: Middleware Without next()

The `next()` function was temporarily removed from the request logger middleware.

**Observation:**

The browser request remained in the loading state because the request did not continue to the next middleware or route handler.

The terminal still displayed the request log.

**Conclusion:**

Calling `next()` is necessary when middleware does not finish the response itself and needs to pass control to the next middleware or route.

### Experiment 2: Moving the 404 Handler Before the Routes

The fallback 404 middleware was temporarily moved above the API route definitions.

The following command was used:

```bash
curl --include http://localhost:3000/api/courses
```

**Observation:**

The request returned:

```json
{
  "error": "Not found"
}
```

with a `404 Not Found` status.

**Conclusion:**

Express processes middleware and routes in the order they are registered. Therefore, the 404 handler must be placed after all valid routes.

## Questions and Answers

### 1. What happens if the 404 handler is placed before the routes?

The 404 handler catches the request before it reaches the valid routes. As a result, valid endpoints may return a 404 response.

### 2. What happens if next() is removed from middleware?

The request cannot continue to the next middleware or route handler. If the middleware does not send a response, the request remains pending.

### 3. Why are different HTTP status codes used?

HTTP status codes communicate the result of a request.

Examples:
- `200 OK`: The request was successful.
- `201 Created`: A resource or result was successfully created.
- `302 Found`: The client is redirected to another location.
- `403 Forbidden`: The server refuses access.
- `404 Not Found`: The requested resource does not exist.

### 4. Why is process.env.PORT used?

`process.env.PORT` allows the application to use a port provided by the environment. The application uses port 3000 as a fallback when no environment variable is defined.

### 5. Why is node_modules not included in Git?

The `node_modules` directory contains installed dependencies. It can be recreated by running `npm install` using the package files, so it does not need to be committed to the repository.

### 6. Why are relative URLs used in the frontend?

Relative URLs allow the frontend to send requests to the same origin as the page. This makes the application easier to run in different environments without hardcoding the server address.

## Self-Study and Documentation

The following official documentation was used as a reference while working on the project:

- [Express.js Documentation](https://expressjs.com/)
- [Express.js API Reference](https://expressjs.com/en/5x/api.html)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN HTTP Response Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)

## Possible Improvements

Some possible future improvements include:

- Adding more API endpoints
- Implementing input validation
- Adding automated tests
- Improving error handling
- Adding more detailed request statistics

## Conclusion

This project provided practical experience with Node.js and Express 5. It helped demonstrate how routing, middleware, HTTP methods, status codes, redirects, and static file serving work together in a web application.

It also provided an opportunity to practice using the Fetch API to communicate between a browser-based frontend and a backend server.