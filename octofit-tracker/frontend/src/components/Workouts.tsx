import { CapabilityCard } from './CapabilityCard.js';

type WorkoutSuggestion = { title: string; focus: string; minutes?: number; difficulty?: string; reason: string };

export default function Workouts() {
  const userEmail = 'mona@example.com';
  return (
    <CapabilityCard<WorkoutSuggestion>
      title="Workout suggestions"
      description="Recommendations based on your fitness goal and recent activity."
      path={`/api/workouts/suggestions/${encodeURIComponent(userEmail)}`}
      responseKey="suggestions"
      emptyMessage="No workout suggestions available."
      renderItem={(workout) => (
        <>
          <strong>{workout.title}</strong>
          <span> — {workout.focus}</span>
          {workout.minutes !== undefined && <span> · {workout.minutes} minutes</span>}
          {workout.difficulty && <span> · {workout.difficulty}</span>}
          <p className="mb-0">{workout.reason}</p>
        </>
      )}
    />
  );
}
