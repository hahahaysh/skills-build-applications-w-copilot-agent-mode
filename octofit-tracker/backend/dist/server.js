import express from 'express';
import './config/database.js';
const app = express();
const PORT = Number(process.env.PORT) || 8000;
app.use(express.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Octofit Tracker API is running' });
});
app.listen(PORT, () => {
    console.log(`Octofit Tracker backend running on port ${PORT}`);
});
