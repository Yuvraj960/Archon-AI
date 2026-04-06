const fs           = require('fs');
const path         = require('path');
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const yaml         = require('js-yaml');
const swaggerUi    = require('swagger-ui-express');
const errorHandler = require('./middleware/errorHandler');

const authRoutes    = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const aiRoutes      = require('./routes/ai.routes');

const app = express();

// ─── Security & logging ───────────────────────────────────────────────────────
app.use(helmet());

// For Local Development
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// For Production (allow all origins, but can be restricted as needed)
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173', // keep for local dev
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(morgan('dev'));

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());

// ─── OpenAPI / Swagger docs ───────────────────────────────────────────────────
const openapiPath = path.join(__dirname, '..', 'openapi.yaml');
const swaggerDocument = yaml.load(fs.readFileSync(openapiPath, 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api-docs.json', (req, res) => res.json(swaggerDocument));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1/auth',     authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/ai',       aiRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

module.exports = app;
