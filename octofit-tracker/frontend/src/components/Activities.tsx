import { CapabilityCard } from './CapabilityCard.js';
import { getCollection, getJson, type Activity } from '../api/client.js';

const loadActivities = () =>
  getJson<Record<string, unknown>>('/api/activities')
    .then((response) => getCollection<Activity>(response, 'activities'));

export default function Activities() {
  return (
    <CapabilityCard<Activity>
      title="Activities"
      description="Track student activity minutes and points."
      loadData={loadActivities}
      emptyMessage="No activities yet."
      renderItem={(activity) => `${activity.type}: ${activity.minutes} minutes, ${activity.points} points`}
    />
  );
}
