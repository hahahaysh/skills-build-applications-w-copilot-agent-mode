import mongoose, { Schema } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  age: number;
  grade: string;
  teamName: string;
  isActive: boolean;
}

export interface ITeam {
  name: string;
  coach: string;
  color: string;
  points: number;
  members: string[];
}

export interface IActivity {
  userId: mongoose.Types.ObjectId;
  type: string;
  durationMinutes: number;
  distanceMiles?: number;
  calories: number;
  date: Date;
  notes?: string;
}

export interface ILeaderboardEntry {
  userId: mongoose.Types.ObjectId;
  name: string;
  team: string;
  points: number;
  rank: number;
}

export interface IWorkout {
  name: string;
  type: string;
  difficulty: 'Low' | 'Moderate' | 'High';
  focus: string;
  durationMinutes: number;
  equipment: string[];
  instructions: string[];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    grade: { type: String, required: true },
    teamName: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true },
    coach: { type: String, required: true },
    color: { type: String, required: true },
    points: { type: Number, default: 0 },
    members: [{ type: String, required: true }]
  },
  { timestamps: true }
);

const activitySchema = new Schema<IActivity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    distanceMiles: Number,
    calories: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: String
  },
  { timestamps: true }
);

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    team: { type: String, required: true },
    points: { type: Number, required: true },
    rank: { type: Number, required: true }
  },
  { timestamps: true }
);

const workoutSchema = new Schema<IWorkout>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    difficulty: { type: String, enum: ['Low', 'Moderate', 'High'], required: true },
    focus: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    equipment: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }]
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', teamSchema);
export const Activity = mongoose.models.Activity || mongoose.model<IActivity>('Activity', activitySchema);
export const LeaderboardEntry =
  mongoose.models.LeaderboardEntry || mongoose.model<ILeaderboardEntry>('LeaderboardEntry', leaderboardEntrySchema);
export const Workout = mongoose.models.Workout || mongoose.model<IWorkout>('Workout', workoutSchema);
