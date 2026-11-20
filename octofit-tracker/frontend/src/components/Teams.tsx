import { CapabilityCard } from './CapabilityCard.js';
import { getTeams, type Team } from '../api/client.js';

export default function Teams() {
  return (
    <CapabilityCard<Team>
      title="Teams"
      description="Manage teams and members."
      loadData={getTeams}
      emptyMessage="No teams yet."
      renderItem={(team) => (
        <>
          <strong>{team.name}</strong>
          {team.mascot && <span> — {team.mascot}</span>}
          {team.members.length > 0 && <span> · Members: {team.members.join(', ')}</span>}
        </>
      )}
    />
  );
}
