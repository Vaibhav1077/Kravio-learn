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
    %% Styling
    classDef frontend fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    classDef backend fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    classDef database fill:#d1fae5,stroke:#10b981,stroke-width:2px
    classDef neutral fill:#f3f4f6,stroke:#6b7280,stroke-width:2px

    %% User
    User(["👤 User<br/>opens app in browser"]):::neutral

    %% Frontend Layer
    subgraph FRONTEND["FRONTEND (src/)"]
        direction TB
        INDEX["index.js<br/><small>root render + redux store</small>"]:::frontend
        APP["App.js<br/><small>Routes</small>"]:::frontend
        LOGIN["pages/Login.jsx"]:::frontend
        TEMPLATE["Auth/Template.jsx"]:::frontend
        LOGINFORM["Auth/LoginForm.jsx<br/><small>dispatch(login())</small>"]:::frontend
        AUTHAPI["operations/authAPI.js"]:::frontend
        APICONNECTOR["services/apiconnector.js<br/><small>axios instance</small>"]:::frontend
    end

    %% Backend Layer
    subgraph BACKEND["BACKEND (server/)"]
        direction TB
        SERVER["index.js<br/><small>app + middlewares</small>"]:::backend
        ROUTES["routes/User.js<br/><small>POST /auth/login</small>"]:::backend
        VALIDATE["middlewares/validate.js<br/><small>Zod schema check</small>"]:::backend
        CONTROLLER["controllers/Auth.js<br/><small>login()</small>"]:::backend
        AUTHMW["middlewares/auth.js<br/><small>JWT verify (other routes)</small>"]:::backend
    end

    %% Database Layer
    subgraph DATABASE["DATABASE"]
        direction TB
        MODELS["models/User.js<br/>models/Profile.js"]:::database
        DBCONFIG["config/database.js<br/><small>MongoDB Atlas</small>"]:::database
    end

    %% Response
    AUTHSLICE["slices/authSlice.js<br/><small>setToken, setUser</small>"]:::frontend
    DASHBOARD["pages/Dashboard.jsx<br/><small>UI output (redirect)</small>"]:::frontend
    OTHERROUTES["Other routes<br/><small>Payments.js, Quiz.js, Admin.js</small>"]:::backend

    %% Flow connections
    User --> INDEX
    INDEX --> APP
    APP --> LOGIN
    LOGIN --> TEMPLATE
    TEMPLATE --> LOGINFORM
    LOGINFORM --> AUTHAPI
    AUTHAPI --> APICONNECTOR
    APICONNECTOR -->|"POST /api/v1/auth/login"| SERVER
    SERVER --> ROUTES
    ROUTES --> VALIDATE
    VALIDATE --> CONTROLLER
    CONTROLLER -->|"bcrypt + JWT sign"| MODELS
    MODELS --> DBCONFIG
    CONTROLLER -->|"{token, user} JSON"| AUTHSLICE
    AUTHSLICE --> DASHBOARD
    AUTHMW -.->|"same pattern"| OTHERROUTES
    DBCONFIG --> MODELS
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
