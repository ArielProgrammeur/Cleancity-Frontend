import { api } from "../../core/api/api";

export interface Signalement {
  id: string;
  user: string;
  userId: string;
  category: string;
  categoryColor: string;
  status: "pending" | "approved" | "collected" | "rejected";
  date: string;
  location: string;
  description: string;
  photo?: string;
  userAvatar?: string;
}

export class SignalementApiDatasource {
  async getAll(): Promise<Signalement[]> {
    const reports = await api.get<any[]>("/api/reports/");
    return reports.map((r) => ({
      id: r.id,
      user: r.userId,
      userId: r.userId,
      category: r.category,
      categoryColor: this.getCategoryColor(r.category),
      status: this.mapStatus(r.status),
      date: r.createdAt,
      location: `${r.latitude}, ${r.longitude}`,
      description: r.description,
      photo: r.imageUrl,
    }));
  }

  async getById(id: string): Promise<Signalement | null> {
    try {
      const r = await api.get<any>(`/api/reports/${id}`);
      return {
        id: r.id,
        user: r.userId,
        userId: r.userId,
        category: r.category,
        categoryColor: this.getCategoryColor(r.category),
        status: this.mapStatus(r.status),
        date: r.createdAt,
        location: `${r.latitude}, ${r.longitude}`,
        description: r.description,
        photo: r.imageUrl,
      };
    } catch {
      return null;
    }
  }

  async updateStatus(id: string, status: string): Promise<Signalement | null> {
    try {
      const backendStatus = this.mapStatusToBackend(status);
      const r = await api.patch<any>(`/api/reports/${id}/status`, { status: backendStatus });
      return {
        id: r.id,
        user: r.userId,
        userId: r.userId,
        category: r.category,
        categoryColor: this.getCategoryColor(r.category),
        status: this.mapStatus(r.status),
        date: r.createdAt,
        location: `${r.latitude}, ${r.longitude}`,
        description: r.description,
        photo: r.imageUrl,
      };
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/reports/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  async getStats() {
    const all = await this.getAll();
    return {
      total: all.length,
      pending: all.filter((r) => r.status === "pending").length,
      approved: all.filter((r) => r.status === "approved").length,
      collected: all.filter((r) => r.status === "collected").length,
      rejected: all.filter((r) => r.status === "rejected").length,
      categories: {},
    };
  }

  getCategories() {
    return [
      { id: "plastic", label: "Plastique", color: "#3B82F6" },
      { id: "glass", label: "Verre", color: "#10B981" },
      { id: "organic", label: "Organique", color: "#84CC16" },
      { id: "electronic", label: "Électronique", color: "#8B5CF6" },
      { id: "hazardous", label: "Dangereux", color: "#EF4444" },
      { id: "other", label: "Autre", color: "#6B7280" },
    ];
  }

  getStatusConfig() {
    return {
      pending: { label: "En attente", color: "#F59E0B", bg: "#F59E0B15" },
      approved: { label: "Approuvé", color: "#3B82F6", bg: "#3B82F615" },
      collected: { label: "Collecté", color: "#10B981", bg: "#10B98115" },
      rejected: { label: "Rejeté", color: "#EF4444", bg: "#EF444415" },
    };
  }

  private getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      plastic: "#3B82F6",
      glass: "#10B981",
      organic: "#84CC16",
      electronic: "#8B5CF6",
      hazardous: "#EF4444",
      other: "#6B7280",
    };
    return colors[category] || "#6B7280";
  }

  private mapStatus(status: string): "pending" | "approved" | "collected" | "rejected" {
    const map: Record<string, "pending" | "approved" | "collected" | "rejected"> = {
      pending: "pending",
      in_progress: "approved",
      resolved: "collected",
      rejected: "rejected",
    };
    return map[status] || "pending";
  }

  private mapStatusToBackend(status: string): string {
    const map: Record<string, string> = {
      pending: "pending",
      approved: "in_progress",
      collected: "resolved",
      rejected: "rejected",
    };
    return map[status] || "pending";
  }
}
