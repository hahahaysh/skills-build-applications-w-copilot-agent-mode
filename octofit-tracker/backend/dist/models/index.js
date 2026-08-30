import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    grade: { type: String, required: true },
    teamName: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
const teamSchema = new Schema({
    name: { type: String, required: true, unique: true },
    coach: { type: String, required: true },
    color: { type: String, required: true },
    points: { type: Number, default: 0 },
    members: [{ type: String, required: true }]
}, { timestamps: true });
const activitySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    distanceMiles: Number,
    calories: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: String
}, { timestamps: true });
const leaderboardEntrySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    team: { type: String, required: true },
    points: { type: Number, required: true },
    rank: { type: Number, required: true }
}, { timestamps: true });
const workoutSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    difficulty: { type: String, enum: ['Low', 'Moderate', 'High'], required: true },
    focus: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    equipment: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }]
}, { timestamps: true });
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
export const LeaderboardEntry = mongoose.models.LeaderboardEntry || mongoose.model('LeaderboardEntry', leaderboardEntrySchema);
export const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);
