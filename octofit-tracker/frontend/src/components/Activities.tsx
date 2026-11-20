import { CapabilityCard } from './CapabilityCard.js';
import { getActivities, type Activity } from '../api/client.js';

export default function Activities() {
  return (
    <CapabilityCard<Activity>
      title="Activities"
      description="Track student activity minutes and points."
      loadData={getActivities}
      emptyMessage="No activities yet."
      renderItem={(activity) => `${activity.type}: ${activity.minutes} minutes, ${activity.points} points`}
    />
  );
}
