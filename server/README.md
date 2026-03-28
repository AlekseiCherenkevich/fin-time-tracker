# FinTimeTracker API

Backend API for the FinTimeTracker application built with Node.js, Express.js, and MongoDB.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update `MONGO_URI` if using MongoDB Atlas or custom connection string

4. Start MongoDB (if using local):
   ```bash
   mongod
   ```

5. Start the server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

The server will run on `http://localhost:3001`

## API Endpoints

### Expense Categories
- `GET /api/expense-categories` - Get all expense categories
- `POST /api/expense-categories` - Create expense category
- `PUT /api/expense-categories/:id` - Update expense category
- `DELETE /api/expense-categories/:id` - Delete expense category

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Task Categories
- `GET /api/task-categories` - Get all task categories
- `POST /api/task-categories` - Create task category
- `PUT /api/task-categories/:id` - Update task category
- `DELETE /api/task-categories/:id` - Delete task category

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Health Check
- `GET /api/health` - Server health status

## MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string
6. Update `.env` with your connection string:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/fintimetracker?retryWrites=true&w=majority
   ```
