import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import './config/database.js';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models/index.js';
const app = express();
const PORT = Number(process.env.PORT) || 8000;
function getApiBaseUrl() {
    const codespaceName = process.env.CODESPACE_NAME;
    return codespaceName
        ? `https://${codespaceName}-8000.app.github.dev`
        : `http://localhost:${PORT}`;
}
const apiBaseUrl = getApiBaseUrl();
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
async function fetchCollectionData() {
    const [users, teams, activities, leaderboard, workouts] = await Promise.all([
        User.find().lean(),
        Team.find().lean(),
        Activity.find().populate('userId', 'name').lean(),
        LeaderboardEntry.find().sort({ rank: 1 }).lean(),
        Workout.find().lean()
    ]);
    return { users, teams, activities, leaderboard, workouts };
}
app.get('/api', async (_req, res) => {
    const data = await fetchCollectionData();
    res.json({
        message: 'Octofit Tracker API',
        apiBaseUrl,
        routes: ['/api/health', '/api/users', '/api/teams', '/api/activities', '/api/leaderboard', '/api/workouts'],
        data
    });
});
app.get('/api/health', async (_req, res) => {
    const ready = mongoose.connection.readyState === 1;
    res.json({
        status: ready ? 'ok' : 'db-disconnected',
        message: 'Octofit Tracker API is running',
        apiBaseUrl,
        database: 'octofit_db'
    });
});
app.get(['/api/users', '/api/users/'], async (_req, res) => {
    const users = await User.find().lean();
    res.json({ apiBaseUrl, count: users.length, users });
});
app.get(['/api/teams', '/api/teams/'], async (_req, res) => {
    const teams = await Team.find().lean();
    res.json({ apiBaseUrl, count: teams.length, teams });
});
app.get(['/api/activities', '/api/activities/'], async (_req, res) => {
    const activities = await Activity.find().populate('userId', 'name').lean();
    res.json({ apiBaseUrl, count: activities.length, activities });
});
app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req, res) => {
    const leaderboard = await LeaderboardEntry.find().sort({ rank: 1 }).lean();
    res.json({ apiBaseUrl, count: leaderboard.length, leaderboard });
});
app.get(['/api/workouts', '/api/workouts/'], async (_req, res) => {
    const workouts = await Workout.find().lean();
    res.json({ apiBaseUrl, count: workouts.length, workouts });
});
app.listen(PORT, () => {
    console.log(`Octofit Tracker backend running on port ${PORT}`);
    console.log(`API base URL: ${apiBaseUrl}`);
});
