import { CapabilityCard } from './CapabilityCard.js';

type Team = { name: string; mascot?: string; members: string[] };

export default function Teams() {
  return (
    <CapabilityCard<Team>
      title="Teams"
      description="Manage teams and members."
      path="/api/teams"
      responseKey="teams"
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
