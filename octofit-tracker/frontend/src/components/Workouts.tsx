import { CapabilityCard } from './CapabilityCard.js';
import { getCollection, getJson, type WorkoutSuggestion } from '../api/client.js';

const userEmail = 'mona@example.com';
const loadSuggestions = () =>
  getJson<Record<string, unknown>>(`/api/workouts/suggestions/${encodeURIComponent(userEmail)}`)
    .then((response) => getCollection<WorkoutSuggestion>(response, 'suggestions'));

export default function Workouts() {
  return (
    <CapabilityCard<WorkoutSuggestion>
      title="Workout suggestions"
      description="Recommendations based on your fitness goal and recent activity."
      loadData={loadSuggestions}
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
