import { CapabilityCard } from './CapabilityCard.js';
import { getCollection, getJson, type Team } from '../api/client.js';

const loadTeams = () =>
  getJson<Record<string, unknown>>('/api/teams')
    .then((response) => getCollection<Team>(response, 'teams'));

export default function Teams() {
  return (
    <CapabilityCard<Team>
      title="Teams"
      description="Manage teams and members."
      loadData={loadTeams}
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
