import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/index.js';
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to octofit_db');
        await Promise.all([
            User.deleteMany({}),
            Team.deleteMany({}),
            Activity.deleteMany({}),
            LeaderboardEntry.deleteMany({}),
            Workout.deleteMany({})
        ]);
        const users = await User.insertMany([
            {
                name: 'Ava Thompson',
                email: 'ava.thompson@octofit.local',
                age: 16,
                grade: '10th',
                teamName: 'Blue Falcons',
                isActive: true
            },
            {
                name: 'Noah Patel',
                email: 'noah.patel@octofit.local',
                age: 15,
                grade: '9th',
                teamName: 'Green Panthers',
                isActive: true
            },
            {
                name: 'Mia Garcia',
                email: 'mia.garcia@octofit.local',
                age: 17,
                grade: '11th',
                teamName: 'Red Hawks',
                isActive: true
            },
            {
                name: 'Leo Kim',
                email: 'leo.kim@octofit.local',
                age: 16,
                grade: '10th',
                teamName: 'Blue Falcons',
                isActive: true
            }
        ]);
        const teams = await Team.insertMany([
            {
                name: 'Blue Falcons',
                coach: 'Coach Rivera',
                color: 'Blue',
                points: 1260,
                members: ['Ava Thompson', 'Leo Kim']
            },
            {
                name: 'Green Panthers',
                coach: 'Coach Davis',
                color: 'Green',
                points: 1185,
                members: ['Noah Patel']
            },
            {
                name: 'Red Hawks',
                coach: 'Coach Brooks',
                color: 'Red',
                points: 1325,
                members: ['Mia Garcia']
            }
        ]);
        const activities = await Activity.insertMany([
            {
                userId: users[0]._id,
                type: 'Running',
                durationMinutes: 35,
                distanceMiles: 3.2,
                calories: 420,
                date: new Date('2026-08-25T06:15:00.000Z'),
                notes: 'Morning run before school.'
            },
            {
                userId: users[1]._id,
                type: 'Strength',
                durationMinutes: 40,
                calories: 380,
                date: new Date('2026-08-26T16:45:00.000Z'),
                notes: 'Upper body circuit.'
            },
            {
                userId: users[2]._id,
                type: 'Cycling',
                durationMinutes: 52,
                distanceMiles: 8.4,
                calories: 510,
                date: new Date('2026-08-27T18:10:00.000Z'),
                notes: 'Weekend ride challenge.'
            },
            {
                userId: users[3]._id,
                type: 'Walking',
                durationMinutes: 28,
                distanceMiles: 1.9,
                calories: 180,
                date: new Date('2026-08-28T07:05:00.000Z'),
                notes: 'Recovery walk with the team.'
            }
        ]);
        await LeaderboardEntry.insertMany([
            {
                userId: users[2]._id,
                name: 'Mia Garcia',
                team: 'Red Hawks',
                points: 1325,
                rank: 1
            },
            {
                userId: users[0]._id,
                name: 'Ava Thompson',
                team: 'Blue Falcons',
                points: 1260,
                rank: 2
            },
            {
                userId: users[1]._id,
                name: 'Noah Patel',
                team: 'Green Panthers',
                points: 1185,
                rank: 3
            }
        ]);
        await Workout.insertMany([
            {
                name: 'Cardio Blast',
                type: 'Running',
                difficulty: 'Moderate',
                focus: 'Endurance',
                durationMinutes: 30,
                equipment: ['stopwatch'],
                instructions: ['Warm up for 5 minutes.', 'Sprint for 30 seconds, walk for 60 seconds.', 'Repeat 8 rounds.']
            },
            {
                name: 'Strength Circuit',
                type: 'Strength',
                difficulty: 'High',
                focus: 'Power',
                durationMinutes: 40,
                equipment: ['dumbbells', 'mat'],
                instructions: ['Do 12 squats.', 'Complete 10 push-ups.', 'Finish with 30-second plank holds.']
            },
            {
                name: 'Mobility Flow',
                type: 'Recovery',
                difficulty: 'Low',
                focus: 'Flexibility',
                durationMinutes: 20,
                equipment: ['yoga mat'],
                instructions: ['Stretch hamstrings for 30 seconds each side.', 'Perform cat-cow stretches.', 'Finish with deep breathing.']
            }
        ]);
        console.log('Seed the octofit_db database with test data');
        console.log(`Inserted ${users.length} users, ${teams.length} teams, ${activities.length} activities, 3 leaderboard entries, and 3 workouts.`);
        await mongoose.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
