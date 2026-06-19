import type { CollectionWaypoint } from './CollectionWaypoint';

export interface CollectionRoute {
  id: string;
  name: string;
  description: string;
  dayOfWeek: number;
  time: string;
  waypoints: CollectionWaypoint[];
}
