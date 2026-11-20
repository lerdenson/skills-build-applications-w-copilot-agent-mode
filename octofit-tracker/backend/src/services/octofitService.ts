import { Types } from 'mongoose';
import { Activity, Team, User, Workout } from '../models/index.js';

function httpError(status: number, message: string) {
  return Object.assign(new Error(message), { status });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function listActivities() {
  return Activity.find().lean();
}

export async function createActivity(input: unknown) {
  if (!isRecord(input)) throw httpError(400, 'Activity details are required');
  const { userId, teamId, type, minutes } = input;
  if (typeof userId !== 'string' || !Types.ObjectId.isValid(userId)) {
    throw httpError(400, 'A valid userId is required');
  }
  if (typeof teamId !== 'string' || !Types.ObjectId.isValid(teamId)) {
    throw httpError(400, 'A valid teamId is required');
  }
  if (typeof type !== 'string' || !type.trim()) {
    throw httpError(400, 'An activity type is required');
  }
  if (typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes <= 0) {
    throw httpError(400, 'Activity minutes must be a positive number');
  }

  const [user, team] = await Promise.all([User.findById(userId), Team.findById(teamId)]);
  if (!user) throw httpError(404, 'User not found');
  if (!team) throw httpError(404, 'Team not found');

  return Activity.create({
    user: user._id,
    team: team._id,
    type: type.trim(),
    minutes,
    points: minutes,
    occurredAt: new Date(),
  });
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(input: unknown) {
  if (!isRecord(input)) throw httpError(400, 'Team details are required');
  const { name, mascot } = input;
  const members = input.members ?? [];
  if (typeof name !== 'string' || !name.trim()) throw httpError(400, 'A team name is required');
  if (typeof mascot !== 'string' || !mascot.trim()) throw httpError(400, 'A team mascot is required');
  if (!Array.isArray(members) || !members.every((member) => typeof member === 'string' && Types.ObjectId.isValid(member))) {
    throw httpError(400, 'Team members must be valid user IDs');
  }

  const memberIds = [...new Set(members)];
  const foundMembers = await User.find({ _id: { $in: memberIds } }).select('_id').lean();
  if (foundMembers.length !== memberIds.length) throw httpError(404, 'One or more team members were not found');

  return Team.create({ name: name.trim(), mascot: mascot.trim(), members: memberIds });
}

export async function getLeaderboard() {
  const [teams, totals] = await Promise.all([
    Team.find().select('name').lean(),
    Activity.aggregate<{ _id: Types.ObjectId; totalPoints: number }>([
      { $group: { _id: '$team', totalPoints: { $sum: '$points' } } },
    ]),
  ]);
  const pointsByTeam = new Map(totals.map(({ _id, totalPoints }) => [_id.toString(), totalPoints]));
  return teams
    .map((team) => ({ teamName: team.name, totalPoints: pointsByTeam.get(team._id.toString()) ?? 0 }))
    .sort((left, right) => right.totalPoints - left.totalPoints || left.teamName.localeCompare(right.teamName))
    .map((team, index) => ({ ...team, rank: index + 1 }));
}

function focusForActivity(type: string) {
  const normalized = type.trim().toLowerCase();
  if (['run', 'running', 'cycle', 'cycling', 'walk', 'walking', 'swim', 'swimming', 'hike', 'hiking'].includes(normalized)) {
    return 'endurance';
  }
  return normalized;
}

export async function suggestWorkouts(userEmail: string) {
  const user = await User.findOne({ email: userEmail.trim().toLowerCase() }).lean();
  if (!user) throw httpError(404, 'User not found');

  const [workouts, recentActivities] = await Promise.all([
    Workout.find().lean(),
    Activity.find({ user: user._id, occurredAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })
      .sort({ occurredAt: -1 })
      .limit(10)
      .lean(),
  ]);
  const goalMatch = workouts.some((workout) => workout.focus.toLowerCase() === user.fitnessGoal.toLowerCase());
  const activityMatch = recentActivities.find((activity) =>
    workouts.some((workout) => workout.focus.toLowerCase() === focusForActivity(activity.type)),
  );
  const preferredFocus = activityMatch
    ? focusForActivity(activityMatch.type)
    : goalMatch
      ? user.fitnessGoal.toLowerCase()
      : undefined;
  const reason = activityMatch
    ? `Recommended based on your recent ${activityMatch.type} activity.`
    : goalMatch
      ? `Recommended to support your ${user.fitnessGoal} goal.`
      : 'Recommended from the available workout library.';

  return workouts
    .sort((left, right) => {
      const leftMatches = left.focus.toLowerCase() === preferredFocus;
      const rightMatches = right.focus.toLowerCase() === preferredFocus;
      return Number(rightMatches) - Number(leftMatches) || left.title.localeCompare(right.title);
    })
    .map((workout) => ({ ...workout, reason }));
}

export { User };
