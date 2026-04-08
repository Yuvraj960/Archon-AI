<div align="center">
  <h1>🚀 Archon AI</h1>
  <p><strong>AI-Powered System Architecture & Design Generator</strong></p>
</div>

<div align="center">
  <a href="https://archonaidev.vercel.app/" target="_blank" rel="noopener noreferrer">
    <strong style="font-size: 20px;">Live Demo🔗</strong>
  </a>
</div>

---

## 📖 Overview

**Archon AI** is a cutting-edge platform that empowers developers, architects, and product managers to instantly generate comprehensive and structured system architectures from simple text prompts. 

By leveraging advanced LLMs (Google Gemini or locally via Ollama), Archon AI automates the initial system design phase, instantly outputting technical requirements, overall architecture maps, robust API definitions, normalized database schemas, and beautifully rendered Mermaid diagrams. 

With features like real-time visual previews, version control, and instant format exports, Archon AI is your ultimate co-pilot for software project scaffolding and documentation.

## ✨ Key Features

- **🤖 AI-Driven Generation**: Generate full-stack architectural blueprints simply by describing your project idea.
- **📊 Visual Flowcharts**: Automatic rendering of system topography using dynamic `mermaid.js` diagrams.
- **🔄 Version History**: Iterate on your prompt designs seamlessly, keeping track of previous architectural versions.
- **📦 Versatile Exports**: Download your finalized specifications in human-readable Markdown (`.md`) or structured JSON (`.json`) with a single click.
- **🔌 Flexible AI Backends**: Switch effortlessly between Google Gemini for blazing-fast cloud inference or Ollama for private, local execution.
- **🔒 Secure Access**: JWT-based authentication ensuring your project data remains entirely private.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) powered by [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) for fluid animations
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) & [React Query](https://tanstack.com/query/latest)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Visuals**: [Mermaid](https://mermaid.js.org/) & [React Markdown](https://github.com/remarkjs/react-markdown)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) & Mongoose ODM
- **AI Integration**: `@google/generative-ai` & Local HTTP APIs (Ollama)
- **Security**: JWT Authentication, `bcryptjs`, and Helmet

---

## Deployment

### Frontend is deployed on Vercel, and can be accessed via the [Link🔗](https://archonaidev.vercel.app/).

### Backend API is deployed on Render, and can be accessed via the [Link🔗](https://archon-ai-1g1l.onrender.com).

## 🚀 Getting Started

Follow these instructions to set up Archon AI on your local machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.x or higher)
- **MongoDB** (Local instance or MongoDB Atlas URL)
- *(Optional)* **Ollama** if you plan to run open-weight AI models locally.

### 1. Clone the Repository

```bash
cd archon-ai
```

### 2. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install backend dependencies
npm install

# Create your environment variables file
cp .env.example .env
```

**Configure `server/.env`:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/archonai
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=15m

# Enable Google Gemini
AI_PROVIDER=gemini
GOOGLE_AI_API_KEY=your_gemini_api_key

# --- OR ---
# Enable Local Ollama
# AI_PROVIDER=ollama
# OLLAMA_URL=http://localhost:11434
# OLLAMA_MODEL=qwen3.5:9b

NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Start the Backend:**
```bash
# Run the application in development mode
npm run dev
```
*The server will start on `http://localhost:5000`.*

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to the client directory
cd client

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```
*The frontend will run on `http://localhost:5173`. Open your browser and navigate here to access the app.*

### 4. Run With Docker

If you want to run the app with Docker using just two app services, use the root `docker-compose.yml`.

**Before starting:**
- Make sure `server/.env` exists.
- If your MongoDB runs on your machine, set `MONGO_URI` to use `host.docker.internal` instead of `localhost`.
- If your Ollama server runs on your machine, set `OLLAMA_URL=http://host.docker.internal:11434`.
- `client/.env` should point to the backend API:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

**Example `server/.env` values for Docker Desktop:**
```env
PORT=5000
MONGO_URI=mongodb://host.docker.internal:27017/archonai
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
AI_PROVIDER=gemini
GOOGLE_AI_API_KEY=your_gemini_api_key
OLLAMA_URL=http://host.docker.internal:11434
OLLAMA_MODEL=qwen3.5:9b
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Start both services:**
```bash
docker compose up --build
```

This will start:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:5173`

**Stop the containers:**
```bash
docker compose down
```

---

## 📁 Project Structure

```text
archon-ai/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── api/            # Axios API config 
│   │   ├── components/     # Reusable UI elements (Navbar, Modals, Forms)
│   │   ├── pages/          # App Pages (Dashboard, DesignView, Login)
│   │   ├── store/          # Zustand Global State
│   │   ├── App.jsx         # App Routing Setup
│   │   └── main.jsx        # App Entry Point
│   ├── package.json
│   └── tailwind.config.js
│
└── server/                 # Node.js + Express Backend
    ├── src/
    │   ├── config/         # MongoDB and Env config
    │   ├── controllers/    # Route handler logic 
    │   ├── middleware/     # Auth and Error handling
    │   ├── models/         # Mongoose DB Schemas (User, Project, Version)
    │   ├── routes/         # API Endpoint definitions
    │   ├── services/       # Core business & AI generative logic
    │   └── app.js          # Express app initialization
    ├── .env.example
    ├── server.js           # Server listen & entry
    └── package.json
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the issues page if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---
*Built with ❤️ for architects and builders.*
