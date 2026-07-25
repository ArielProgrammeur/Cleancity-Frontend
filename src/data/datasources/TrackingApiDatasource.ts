import { api } from '../../core/api/api';

export interface DriverPosition {
  driver_id: string;
  truck_id: string | null;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
  assignment_id: string | null;
  status: string;
}

export interface TruckStatus {
  truck_id: string;
  status: string;
  last_update: string;
}

export class TrackingApiDatasource {
  async updatePosition(data: {
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
    truck_id?: string;
    assignment_id?: string;
    status?: string;
  }): Promise<DriverPosition> {
    return api.post<DriverPosition>('/api/tracking/position', data);
  }

  async getAllPositions(): Promise<DriverPosition[]> {
    const result = await api.get<{ positions: DriverPosition[]; count: number }>('/api/tracking/positions');
    return result.positions;
  }

  async getDriverPosition(driverId: string): Promise<DriverPosition> {
    return api.get<DriverPosition>(`/api/tracking/positions/${driverId}`);
  }

  async updateTruckStatus(status: string, assignmentId?: string): Promise<TruckStatus> {
    return api.post<TruckStatus>('/api/tracking/truck-status', { status, assignment_id: assignmentId });
  }

  async getAllTruckStatuses(): Promise<TruckStatus[]> {
    return api.get<TruckStatus[]>('/api/tracking/truck-status');
  }

  async clearPosition(): Promise<void> {
    return api.delete('/api/tracking/position');
  }
}

export const trackingDatasource = new TrackingApiDatasource();
