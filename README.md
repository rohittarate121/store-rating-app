# Store Rating App

A full stack web application where users can submit ratings for registered stores.

## Tech Stack

- **Frontend:** React.js, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, Sequelize ORM
- **Auth:** JWT, bcrypt

## User Roles

| Role        | Description                        |
| ----------- | ---------------------------------- |
| Admin       | Manages users and stores           |
| Normal User | Browses stores and submits ratings |
| Store Owner | Views ratings for their store      |

## Project Structure

    store-rating-app/
    ├── backend/
    │   ├── config/        # Database connection
    │   ├── controllers/   # Route logic
    │   ├── middleware/     # Auth and role checks
    │   ├── models/         # Sequelize models
    │   ├── routes/         # Express routes
    │   ├── utils/          # Shared validation helpers
    │   ├── seed.js         # Creates initial admin account
    │   └── server.js       # Entry point
    └── frontend/
        └── src/
            ├── api/        # Axios instance
            ├── context/    # Auth context
            ├── pages/      # Page components
            └── styles/     # CSS files

## Prerequisites

Make sure you have these installed:

- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/rohittarate121/store-rating-app
cd store-rating-app
```

### 2. Setup the database

Open PostgreSQL and create a new database:

```sql
CREATE DATABASE store_rating_db;
```

### 3. Setup the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
PORT=5000
JWT_SECRET=your_secret_key_here
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

Seed the initial admin account:

```bash
npm run seed
```

Start the backend:
You should see:
Database synced
Server running on port 5000
```

```bash
npm run dev
```

You should see:

### 4. Setup the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`

## Default Admin Credentials

Email: admin@admin.com
Password: Admin@1234

> Change the admin password after first login.

## API Endpoints

### Auth

| Method | Endpoint                  | Access        | Description        |
| ------ | ------------------------- | ------------- | ------------------ |
| POST   | /api/auth/register        | Public        | Normal user signup |
| POST   | /api/auth/login           | Public        | All roles login    |
| PATCH  | /api/auth/change-password | All logged in | Change password    |

### Admin

| Method | Endpoint             | Access | Description          |
| ------ | -------------------- | ------ | -------------------- |
| GET    | /api/admin/stats     | Admin  | Dashboard statistics |
| GET    | /api/admin/users     | Admin  | List all users       |
| POST   | /api/admin/users     | Admin  | Create a user        |
| GET    | /api/admin/users/:id | Admin  | User detail          |
| GET    | /api/admin/stores    | Admin  | List all stores      |
| POST   | /api/admin/stores    | Admin  | Create a store       |

### Stores

| Method | Endpoint    | Access      | Description                 |
| ------ | ----------- | ----------- | --------------------------- |
| GET    | /api/stores | Normal User | List all stores with search |

### Ratings

| Method | Endpoint         | Access      | Description     |
| ------ | ---------------- | ----------- | --------------- |
| POST   | /api/ratings     | Normal User | Submit a rating |
| PATCH  | /api/ratings/:id | Normal User | Update a rating |

### Owner

| Method | Endpoint             | Access      | Description        |
| ------ | -------------------- | ----------- | ------------------ |
| GET    | /api/owner/dashboard | Store Owner | View store ratings |

## Form Validation

| Field    | Rules                                                 |
| -------- | ----------------------------------------------------- |
| Name     | Min 20 characters, Max 60 characters                  |
| Email    | Standard email format                                 |
| Password | 8-16 characters, one uppercase, one special character |
| Address  | Max 400 characters                                    |

## Features

- Single login system for all roles
- Role-based access control
- Admin dashboard with statistics
- User and store management with filtering and sorting
- Store search by name and address
- Submit and update store ratings
- Store owner dashboard with rater list and average rating
- Change password for all roles
- JWT authentication
- bcrypt password hashing
