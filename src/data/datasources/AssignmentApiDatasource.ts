import { api } from "../../core/api/api";
import { Assignment, AssignmentStatus } from "../../domain/entities/Assignment";

export class AssignmentApiDatasource {
  async getAll(): Promise<Assignment[]> {
    return api.get<Assignment[]>("/api/drivers/all-tasks");
  }

  async getById(id: string): Promise<Assignment | null> {
    try {
      const tasks = await this.getAll();
      return tasks.find((t) => t.id === id) || null;
    } catch {
      return null;
    }
  }

  async getByConducteur(conducteurId: string): Promise<Assignment[]> {
    return api.get<Assignment[]>(`/api/drivers/${conducteurId}/tasks`);
  }

  async getActiveByConducteur(conducteurId: string): Promise<Assignment[]> {
    const tasks = await this.getByConducteur(conducteurId);
    return tasks.filter((t) => t.status !== "completed" && t.status !== "cancelled");
  }

  async assign(reportId: string, conducteurId: string, conducteurNom: string): Promise<Assignment> {
    return api.post<Assignment>("/api/admin/assign", {
      reportId,
      driverId: conducteurId,
    });
  }

  async updateStatus(id: string, status: AssignmentStatus, notes?: string): Promise<Assignment | null> {
    try {
      return await api.patch<Assignment>(`/api/drivers/tasks/${id}/status`, { status });
    } catch {
      return null;
    }
  }

  async getByReport(reportId: string): Promise<Assignment | null> {
    try {
      const tasks = await this.getAll();
      return tasks.find((t) => t.reportId === reportId) || null;
    } catch {
      return null;
    }
  }

  async getStats() {
    const all = await this.getAll();
    return {
      total: all.length,
      active: all.filter((t) => t.status !== "completed" && t.status !== "cancelled").length,
      completed: all.filter((t) => t.status === "completed").length,
      cancelled: all.filter((t) => t.status === "cancelled").length,
      enRoute: all.filter((t) => t.status === "en_route").length,
      collecting: all.filter((t) => t.status === "collecting").length,
    };
  }
}
