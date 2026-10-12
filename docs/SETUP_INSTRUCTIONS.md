# CampusFind Setup Instructions

This guide provides step-by-step instructions to configure, run, and test the CampusFind application locally.

---

## 1. Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher
- **MongoDB**: Community Server running locally on port 27017 or a MongoDB Atlas connection string URI.

---

## 2. Recommended Directory Layout

```
campusfind/
├── backend/            # Express, Mongoose models, auth, JWT, uploads, controllers
├── docs/               # API documentation, workflows, setup, test cases
├── src/                # React pages, role-based layouts, components, router, services
├── public/             # Static public assets
├── package.json        # Frontend Vite package configuration
├── .env.example        # Frontend environment template
└── README.md           # Project documentation overview
```

---

## 3. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file inside `backend/` by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Default `.env` settings:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/campusfind
   JWT_SECRET=campusfind_super_secret_jwt_key_2026
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Seed Database with Demo Accounts & Initial Data**:
   ```bash
   npm run seed
   ```
   This populates:
   - Default user accounts for Student, Staff, and Admin
   - Campus item categories
   - Sample lost items, found items, active claims, and audit logs

5. **Start Backend Server**:
   - For development with auto-reload:
     ```bash
     npm run dev
     ```
   - Health check: `http://localhost:5000/api/health`

---

## 4. Frontend Setup

1. **Navigate to the frontend (root directory)**:
   ```bash
   cd ..
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Ensure `.env` exists in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start Vite Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 5. Seed Credentials for Quick Testing

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | `student@charusat.edu.in` | `student123` | Report lost items, view AI match suggestions, submit claims, track status |
| **Staff** | `staff@charusat.edu.in` | `staff123` | Register found items, assign custody lockers, review claims, verify ownership, confirm handovers |
| **Admin** | `admin@charusat.edu.in` | `admin123` | Provision accounts, manage categories, view analytics dashboard, inspect audit logs |
