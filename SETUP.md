# Task Manager Setup Guide

This guide walks through setting up Task Manager on Windows. The commands use PowerShell. Keep your database password in your local backend/.env file only; never commit it.

## 1. Check the prerequisites

Open PowerShell and run:

~~~powershell
node --version
npm --version
git --version
psql --version
~~~

Use Node.js 20.9 or newer. If psql is not recognized, install PostgreSQL command-line tools or add the PostgreSQL bin directory to your PATH, then open a new PowerShell window.

## 2. Clone the project

If you have not cloned the repository yet:

~~~powershell
git clone https://github.com/vivekmenon2004/Task-manager.git
Set-Location .\Task-manager
~~~

If you already have the project, open PowerShell in the project root (the folder containing backend, frontend, README.md, and this guide).

## 3. Install frontend and backend dependencies

From the project root, run:

~~~powershell
Set-Location .\backend
npm install
Set-Location ..\frontend
npm install
Set-Location ..
~~~

## 4. Start PostgreSQL and create the database

Make sure PostgreSQL is running. PostgreSQL commonly listens on port 5432. Create the database, then apply the project schema:

~~~powershell
psql -h localhost -p 5432 -U postgres -d postgres -c "CREATE DATABASE task_manager;"
psql -h localhost -p 5432 -U postgres -d task_manager -f "backend/src/db/schema.sql"
~~~

psql will prompt for the PostgreSQL password. Type it there; do not add it to the command. If task_manager already exists, skip the CREATE DATABASE command and apply the schema. If your PostgreSQL server uses a different port, replace 5432 in these commands and in the backend connection string below.

You can verify that the database is reachable with:

~~~powershell
psql -h localhost -p 5432 -U postgres -d task_manager -c "SELECT current_database();"
~~~

## 5. Configure environment files

Create the local files from their examples if they do not already exist:

~~~powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.local.example frontend\.env.local
~~~

Edit backend/.env and fill in the PostgreSQL password locally:

~~~dotenv
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_manager
~~~

Replace YOUR_PASSWORD with your actual password. If it contains URL-reserved characters such as @, :, /, or #, URL-encode those characters in DATABASE_URL.

frontend/.env.local should contain:

~~~dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000
~~~

Both local environment files are gitignored. Restart the corresponding development server after changing an environment file.

## 6. Run the backend

Open a PowerShell window at the project root and run:

~~~powershell
Set-Location .\backend
npm run dev
~~~

Expected output includes:

~~~text
Successfully connected to PostgreSQL.
Task Manager API listening on http://localhost:5000
~~~

Verify the API in another PowerShell window:

~~~powershell
curl.exe -i http://localhost:5000/api/health
~~~

The health route should return HTTP 200 and a JSON status message.

## 7. Run the frontend

Open another PowerShell window at the project root and run:

~~~powershell
Set-Location .\frontend
npm run dev
~~~

Open http://localhost:3000. The task list loads from the backend; a new database will initially show an empty list.

## Troubleshooting

### Port already in use

If the backend reports EADDRINUSE on port 5000, stop the other process using that port or set an available PORT in backend/.env. If you change the backend port, update NEXT_PUBLIC_API_URL in frontend/.env.local to match and restart both servers.

If Next.js reports that port 3000 is busy, stop the other frontend process or use an available port, for example:

~~~powershell
npm run dev -- -p 3001
~~~

Then open the URL printed by Next.js.

### Database connection refused

This means the backend cannot reach PostgreSQL at the configured host and port. Confirm PostgreSQL is running, then check the port in DATABASE_URL. PostgreSQL commonly uses 5432, but your local server may use another port. You can check a port with:

~~~powershell
Test-NetConnection localhost -Port 5432
~~~

Use the same port in both the psql commands and DATABASE_URL.

### Wrong database password

Update the password in backend/.env and restart npm run dev. Keep the value local; do not put it in README.md, SETUP.md, or a committed environment file. URL-encode reserved characters in the connection string.

### CORS error in the browser

Confirm the backend is running and that NEXT_PUBLIC_API_URL points to it, including the correct port. This project enables CORS in Express. Restart the frontend after changing .env.local, then reload the page.

### psql is not recognized

Install the PostgreSQL command-line tools or add your PostgreSQL installation's bin directory to the Windows PATH. Open a new PowerShell window after changing PATH.
