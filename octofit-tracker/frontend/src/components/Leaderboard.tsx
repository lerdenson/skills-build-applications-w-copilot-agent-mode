import { CapabilityCard } from './CapabilityCard.js';
import { getCollection, getJson, type LeaderboardEntry } from '../api/client.js';

const loadLeaderboard = () =>
  getJson<Record<string, unknown>>('/api/leaderboard')
    .then((response) => getCollection<LeaderboardEntry>(response, 'leaderboard'));

export default function Leaderboard() {
  return (
    <CapabilityCard<LeaderboardEntry>
      title="Leaderboard"
      description="Compare team point totals."
      loadData={loadLeaderboard}
      emptyMessage="No leaderboard scores yet."
      renderItem={(entry) => `#${entry.rank} ${entry.teamName}: ${entry.totalPoints} points`}
    />
  );
}
