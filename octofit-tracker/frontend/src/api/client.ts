// Relative /api paths go through the Vite dev proxy, so port 8000 never needs to be public.
export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

export type Activity = { type: string; minutes: number; points: number };
export type Team = { name: string; mascot?: string; members: string[] };
export type LeaderboardEntry = { teamName: string; totalPoints: number; rank: number };
export type WorkoutSuggestion = {
  title: string;
  focus: string;
  minutes?: number;
  difficulty?: string;
  reason: string;
};

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`);
  if (!response.ok) throw new Error(`Request failed with ${response.status}`);
  return response.json() as Promise<T>;
}

async function getCollection<T>(path: string, key: string): Promise<T[]> {
  const response = await getJson<Record<string, unknown>>(path);
  const collection = response[key];
  if (!Array.isArray(collection)) throw new Error(`The API response did not include a ${key} list`);
  return collection as T[];
}

export function getActivities(): Promise<Activity[]> {
  return getCollection<Activity>('/api/activities', 'activities');
}

export function getTeams(): Promise<Team[]> {
  return getCollection<Team>('/api/teams', 'teams');
}


export function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return getCollection<LeaderboardEntry>('/api/leaderboard', 'leaderboard');
}

export function getWorkoutSuggestions(userEmail: string): Promise<WorkoutSuggestion[]> {
  return getCollection<WorkoutSuggestion>(
    `/api/workouts/suggestions/${encodeURIComponent(userEmail)}`,
    'suggestions',
  );
}
