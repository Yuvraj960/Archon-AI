require('dotenv').config();
const connectDB = require('./src/config/db');
const app       = require('./src/app');

app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`✅  Server running on http://localhost:${PORT}`);
    console.log(`🌿  Environment: ${process.env.NODE_ENV}`);
  });

  // Increase socket timeout to 10 minutes for long-running local AI (Ollama) calls.
  // Default Node.js timeout is ~2 minutes which can cut off slow local models.
  server.setTimeout(10 * 60 * 1000); // 10 minutes
});
