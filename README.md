# Kravio Learn

> Learn. Build. Innovate.

An AI-powered Learning Management Platform built with the MERN Stack. Kravio Learn enables instructors to create and manage courses while students browse, purchase, and consume educational content with progress tracking.

**Repository:** [github.com/Vaibhav1077/Kravio-learn](https://github.com/Vaibhav1077/Kravio-learn)

## Tech Stack

**Frontend:** React 18, Redux Toolkit, React Router 6, Tailwind CSS, Axios, Chart.js

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT

**Services:** Cloudinary (media), Razorpay (payments), Nodemailer (email)

## Features

- Role-based access control (Student, Instructor, Admin)
- OTP-based email verification and JWT authentication
- Course creation with sections, subsections, and video lectures
- Cart and checkout with Razorpay payment integration
- Course progress tracking with completion percentage
- Ratings and reviews system
- Instructor dashboard with revenue analytics
- Cloud-based media storage via Cloudinary
- Responsive UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- Razorpay account

### Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install
```

### Environment Variables

Create a `.env` file in the `server/` directory with the required configuration for MongoDB, JWT, Cloudinary, Razorpay, and mail services.

### Running Locally

```bash
# Run both client and server concurrently
npm run dev

# Or run separately
npm start          # Frontend on port 3000
npm run server     # Backend on port 4000
```

### Production Build

```bash
npm run build
```

## Project Flow Diagram

```mermaid
flowchart TD
    classDef frontend fill:#2563eb,stroke:#1d4ed8,color:#ffffff,stroke-width:2px
    classDef backend fill:#d97706,stroke:#b45309,color:#ffffff,stroke-width:2px
    classDef database fill:#059669,stroke:#047857,color:#ffffff,stroke-width:2px
    classDef neutral fill:#4b5563,stroke:#374151,color:#ffffff,stroke-width:2px

    User(["User - opens app"]):::neutral

    subgraph FRONTEND [FRONTEND - src]
        INDEX[index.js - root render + redux]:::frontend
        APP[App.js - Routes]:::frontend
        LOGIN[pages/Login.jsx]:::frontend
        LOGINFORM[Auth/LoginForm.jsx]:::frontend
        AUTHAPI[operations/authAPI.js]:::frontend
        APICONNECTOR[services/apiconnector.js - axios]:::frontend
    end

    subgraph BACKEND [BACKEND - server]
        SERVER[index.js - express app]:::backend
        ROUTES[routes/User.js - POST /auth/login]:::backend
        VALIDATE[middlewares/validate.js - Zod]:::backend
        CONTROLLER[controllers/Auth.js - login]:::backend
        AUTHMW[middlewares/auth.js - JWT verify]:::backend
    end

    subgraph DATABASE [DATABASE]
        MODELS[models/User.js + Profile.js]:::database
        DBCONFIG[config/database.js - MongoDB Atlas]:::database
    end

    AUTHSLICE[slices/authSlice.js - setToken]:::frontend
    DASHBOARD[pages/Dashboard.jsx - UI output]:::frontend
    OTHERROUTES[Other routes - Payments, Quiz, Admin]:::backend

    User --> INDEX
    INDEX --> APP
    APP --> LOGIN
    LOGIN --> LOGINFORM
    LOGINFORM --> AUTHAPI
    AUTHAPI --> APICONNECTOR
    APICONNECTOR -->|POST /api/v1/auth/login| SERVER
    SERVER --> ROUTES
    ROUTES --> VALIDATE
    VALIDATE --> CONTROLLER
    CONTROLLER -->|bcrypt + JWT sign| MODELS
    MODELS --> DBCONFIG
    CONTROLLER -->|token + user JSON| AUTHSLICE
    AUTHSLICE --> DASHBOARD
    AUTHMW -.->|same pattern| OTHERROUTES
```

**Flow:** User → Frontend (React + Redux) → API Layer (Axios) → Backend (Express + Middlewares + Zod Validation) → Database (MongoDB Atlas) → JWT Response → Redux Store → Dashboard UI

## Project Structure

```
├── public/             # Static assets
├── src/                # React frontend
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page-level components
│   ├── services/       # API connector and operations
│   ├── slices/         # Redux Toolkit slices
│   └── utils/          # Constants and helpers
├── server/             # Express backend
│   ├── controllers/    # Route handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── middlewares/    # Auth middleware
│   └── config/         # DB, Cloudinary, Razorpay config
```

## License

MIT

## Author

Vaibhav Kaushal — [GitHub](https://github.com/Vaibhav1077)
