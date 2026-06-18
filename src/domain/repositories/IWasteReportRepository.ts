import type { Result } from '../../core/utils/Result';
import type { WasteReport } from '../entities/WasteReport';
import type { WasteCategory } from '../entities/WasteCategory';

export interface IWasteReportRepository {
  submit(report: Omit<WasteReport, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Result<WasteReport>>;
  getAll(): Promise<Result<WasteReport[]>>;
  getByUser(userId: string): Promise<Result<WasteReport[]>>;
  getByCategory(category: WasteCategory): Promise<Result<WasteReport[]>>;
  updateStatus(id: string, status: WasteReport['status']): Promise<Result<WasteReport>>;
}
