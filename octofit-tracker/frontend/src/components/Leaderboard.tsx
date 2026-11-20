import { CapabilityCard } from './CapabilityCard.js';
import { getLeaderboard, type LeaderboardEntry } from '../api/client.js';

export default function Leaderboard() {
  return (
    <CapabilityCard<LeaderboardEntry>
      title="Leaderboard"
      description="Compare team point totals."
      loadData={getLeaderboard}
      emptyMessage="No leaderboard scores yet."
      renderItem={(entry) => `#${entry.rank} ${entry.teamName}: ${entry.totalPoints} points`}
    />
  );
}
