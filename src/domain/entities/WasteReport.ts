import type { WasteCategory } from './WasteCategory';
import type { ReportStatus } from './ReportStatus';

export interface WasteReport {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: WasteCategory;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}
