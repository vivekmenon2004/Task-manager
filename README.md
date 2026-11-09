# Task Manager Application

## Project Overview

Task Manager is a full-stack application for creating, prioritizing, viewing, editing, completing, and deleting tasks. The Next.js frontend communicates with an Express REST API, and PostgreSQL stores the tasks.

## Technology Stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js App Router, React, TypeScript, Tailwind CSS, ESLint |
| Backend | Node.js, Express.js, cors, dotenv, pg; nodemon for development |
| Database | PostgreSQL |
| Version control | Git and GitHub |

## Prerequisites

- Node.js 20.9 or newer
- npm (included with Node.js)
- PostgreSQL with psql available on your PATH
- Git

## Installation

Clone the repository and install dependencies for both applications:

~~~bash
git clone https://github.com/vivekmenon2004/Task-manager.git
cd Task-manager

cd backend
npm install
cd ../frontend
npm install
cd ..
~~~

Create the local environment files as described in Environment Variables. They are ignored by Git and should not be committed.

## Database Setup

1. Start PostgreSQL.
2. Create the application database:

   ~~~bash
   psql -h localhost -p 5432 -U postgres -d postgres -c "CREATE DATABASE task_manager;"
   ~~~

3. Apply the schema from the project root:

   ~~~bash
   psql -h localhost -p 5432 -U postgres -d task_manager -f "backend/src/db/schema.sql"
   ~~~

The schema creates the tasks table, including title and priority constraints. PostgreSQL commonly uses port 5432; if your server uses another port, use that port in these commands and in DATABASE_URL.

## Environment Variables

Create backend/.env from backend/.env.example and set:

~~~dotenv
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_manager
~~~

Replace YOUR_PASSWORD locally with your PostgreSQL password. Do not commit backend/.env or put real credentials in documentation.

Create frontend/.env.local from frontend/.env.local.example:

~~~dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000
~~~

NEXT_PUBLIC_API_URL is the URL of the Express backend. Restart the frontend after changing this value.

## Running the Application

Start the backend in one terminal:

~~~bash
cd backend
npm run dev
~~~

The API listens at http://localhost:5000. Its health endpoint is http://localhost:5000/api/health.

Start the frontend in a second terminal:

~~~bash
cd frontend
npm run dev
~~~

Open http://localhost:3000 in your browser.

## Project Structure

~~~text
Task-manager/
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js pages and styles
│   │   ├── components/          # Task form, list, row, and dialogs
│   │   ├── lib/api.ts           # Typed API client
│   │   └── types/task.ts        # Task and priority types
│   ├── .env.local.example
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/         # Task request handlers
│   │   ├── middleware/          # Request validation
│   │   ├── routes/              # Task API routes
│   │   ├── db/                  # PostgreSQL pool and schema
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── README.md
├── SETUP.md
└── .gitignore
~~~

## API Documentation

Base URL: http://localhost:5000. JSON errors use the shape {"error":"message"}. Task IDs must be positive integers.

A task response has this shape:

~~~json
{
  "id": 1,
  "title": "Prepare project demo",
  "description": "Review the task list",
  "priority": "HIGH",
  "completed": false,
  "created_at": "2026-11-09T08:30:00.000Z",
  "updated_at": "2026-11-09T08:30:00.000Z"
}
~~~

### GET /api/tasks

Returns tasks ordered by created_at descending.

~~~bash
curl -i http://localhost:5000/api/tasks
~~~

- 200 OK — an array of task objects; returns [] when there are no tasks
- 500 Internal Server Error — {"error":"Internal server error"}

### GET /api/tasks/:id

Returns one task.

~~~bash
curl -i http://localhost:5000/api/tasks/1
~~~

- 200 OK — the task object
- 400 Bad Request — invalid ID, such as {"error":"Task ID must be a positive integer"}
- 404 Not Found — {"error":"Task not found"}
- 500 Internal Server Error — {"error":"Internal server error"}

### POST /api/tasks

Creates a task. Title must be a non-empty string of at most 255 characters. Description is optional and may be a string or null. Priority is optional, defaults to MEDIUM, and accepts LOW, MEDIUM, or HIGH.

~~~bash
curl -i -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d '{"title":"Prepare project demo","description":"Review the task list","priority":"HIGH"}'
~~~

Example response:

~~~http
HTTP/1.1 201 Created
Content-Type: application/json

{"id":1,"title":"Prepare project demo","description":"Review the task list","priority":"HIGH","completed":false,"created_at":"2026-11-09T08:30:00.000Z","updated_at":"2026-11-09T08:30:00.000Z"}
~~~

- 201 Created — the created task object
- 400 Bad Request — invalid JSON or task fields; response is {"error":"message"}
- 500 Internal Server Error — {"error":"Internal server error"}

### PUT /api/tasks/:id

Replaces the task title, description, and priority. It uses the same validation as POST. Title is required; omitted description becomes null and omitted priority defaults to MEDIUM.

~~~bash
curl -i -X PUT http://localhost:5000/api/tasks/1 -H "Content-Type: application/json" -d '{"title":"Review project demo","description":"Check the API examples","priority":"MEDIUM"}'
~~~

- 200 OK — the updated task object
- 400 Bad Request — invalid ID or request body; response is {"error":"message"}
- 404 Not Found — {"error":"Task not found"}
- 500 Internal Server Error — {"error":"Internal server error"}

### PATCH /api/tasks/:id/complete

Marks a task complete and updates its updated_at timestamp. No request body is needed.

~~~bash
curl -i -X PATCH http://localhost:5000/api/tasks/1/complete
~~~

- 200 OK — the updated task object with "completed": true
- 400 Bad Request — invalid ID; response is {"error":"message"}
- 404 Not Found — {"error":"Task not found"}
- 500 Internal Server Error — {"error":"Internal server error"}

### DELETE /api/tasks/:id

Deletes a task.

~~~bash
curl -i -X DELETE http://localhost:5000/api/tasks/1
~~~

Example response:

~~~http
HTTP/1.1 200 OK
Content-Type: application/json

{"message":"Task deleted successfully"}
~~~

- 200 OK — {"message":"Task deleted successfully"}
- 400 Bad Request — invalid ID; response is {"error":"message"}
- 404 Not Found — {"error":"Task not found"}
- 500 Internal Server Error — {"error":"Internal server error"}

The health endpoint GET /api/health returns 200 OK with {"status":"ok","message":"Task Manager API is healthy"}. Unknown routes return 404 Not Found with {"error":"Route not found"}.

On Windows PowerShell, use curl.exe instead of curl in the examples above.
