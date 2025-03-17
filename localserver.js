// Local server built purely to test API calls in local development environment, simulating Vercel Routing
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import shepartiststatHandler from './api/shepartiststat.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Determine __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from your production build folder (e.g., "dist")
app.use(express.static(path.join(__dirname, 'dist')));

// Route for your API endpoint using the shepartiststat handler
app.get('/api/shepartiststat', shepartiststatHandler);

// For all other routes, serve index.html (BrowserRouter fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5180;
app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
