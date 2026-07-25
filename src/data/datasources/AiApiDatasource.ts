import { api } from '../../core/api/api';

export interface WasteClassification {
  id: string;
  predicted_type: string;
  confidence: number;
  all_predictions: Record<string, number>;
  image_url: string;
}

export interface Prediction {
  id: string;
  zone_id: string;
  zone_name: string;
  date: string;
  predicted_volume_kg: number;
  confidence: number;
  waste_type: string;
  created_at: string;
  model_version: string;
}

export interface RouteOptimization {
  id: string;
  zone: string;
  truck_id: string;
  driver_id: string;
  optimized_distance_km: number;
  original_distance_km: number;
  reduction_percent: number;
  waypoints: OptimizedWaypoint[];
  created_at: string;
  day_of_week: number;
  estimated_duration_min: number;
}

export interface OptimizedWaypoint {
  report_id: string;
  latitude: number;
  longitude: number;
  address: string;
  order: number;
  estimated_arrival: string;
  waste_type: string;
  estimated_weight_kg: number;
}

export class AiApiDatasource {
  async classifyImage(file: File | Blob, filename: string): Promise<WasteClassification> {
    const formData = new FormData();
    formData.append('file', file, filename);

    const token = await this.getAuthToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/ai/classify', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur classification');
    }

    return response.json();
  }

  async classifyFromUrl(imageUrl: string): Promise<WasteClassification> {
    return api.post<WasteClassification>('/api/ai/classify-url', { image_url: imageUrl });
  }

  async getPredictions(zoneId?: string, wasteType?: string, limit: number = 50): Promise<Prediction[]> {
    let endpoint = `/api/predictions/?limit=${limit}`;
    if (zoneId) endpoint += `&zone_id=${zoneId}`;
    if (wasteType) endpoint += `&waste_type=${wasteType}`;
    return api.get<Prediction[]>(endpoint);
  }

  async generatePredictions(data: {
    zone_id: string;
    zone_name: string;
    waste_type?: string;
    days?: number;
  }): Promise<Prediction[]> {
    return api.post<Prediction[]>('/api/predictions/generate', data);
  }

  async trainPredictor(epochs: number = 50, batchSize: number = 16): Promise<any> {
    return api.post('/api/predictions/train', { epochs, batch_size: batchSize });
  }

  async optimizeRoute(data: {
    zone?: string;
    truck_id?: string;
    depot_lat?: number;
    depot_lon?: number;
  }): Promise<RouteOptimization> {
    return api.post<RouteOptimization>('/api/routes/optimize', data);
  }

  async getOptimizations(zone?: string, limit: number = 10): Promise<RouteOptimization[]> {
    let endpoint = `/api/routes/optimizations?limit=${limit}`;
    if (zone) endpoint += `&zone=${zone}`;
    return api.get<RouteOptimization[]>(endpoint);
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const { auth } = await import('../../core/firebase');
      if (!auth) return null;
      const user = auth.currentUser;
      if (!user) return null;
      return await user.getIdToken();
    } catch {
      return null;
    }
  }
}

export const aiDatasource = new AiApiDatasource();
