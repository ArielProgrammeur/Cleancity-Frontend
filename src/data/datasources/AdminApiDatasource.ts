import { api } from "../../core/api/api";

export interface CategoryStat {
  category: string;
  count: number;
  color: string;
}

export interface StatusStat {
  status: string;
  count: number;
  color: string;
}

export interface AdminStats {
  totalReports: number;
  activeUsers: number;
  totalPointsIssued: number;
  totalCo2Saved: number;
  reportsByCategory: CategoryStat[];
  reportsByStatus: StatusStat[];
  monthlyReports: { month: string; count: number }[];
  recentReports: any[];
}

export interface StatDetailItem {
  id: string;
  icon: string;
  label: string;
  value: string;
  sublabel: string;
  date: string;
  status?: string;
  color?: string;
}

export class AdminApiDatasource {
  private categoryColors: Record<string, string> = {
    plastic: "#3B82F6",
    glass: "#10B981",
    organic: "#84CC16",
    electronic: "#8B5CF6",
    hazardous: "#EF4444",
    other: "#6B7280",
  };

  private statusColors: Record<string, string> = {
    pending: "#F59E0B",
    in_progress: "#3B82F6",
    resolved: "#10B981",
  };

  async getStats(): Promise<AdminStats> {
    const raw = await api.get<any>("/api/admin/stats");
    return {
      totalReports: raw.totalReports || 0,
      activeUsers: raw.activeUsers || 0,
      totalPointsIssued: raw.totalPointsIssued || 0,
      totalCo2Saved: raw.totalCo2Saved || 0,
      reportsByCategory: this.transformToCategoryStats(raw.reportsByCategory),
      reportsByStatus: this.transformToStatusStats(raw.reportsByStatus),
      monthlyReports: raw.monthlyReports || [],
      recentReports: raw.recentReports || [],
    };
  }

  private transformToCategoryStats(data: any): CategoryStat[] {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];
    return Object.entries(data).map(([category, count]) => ({
      category,
      count: typeof count === "number" ? count : 0,
      color: this.categoryColors[category] || "#6B7280",
    }));
  }

  private transformToStatusStats(data: any): StatusStat[] {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];
    return Object.entries(data).map(([status, count]) => ({
      status,
      count: typeof count === "number" ? count : 0,
      color: this.statusColors[status] || "#6B7280",
    }));
  }

  async getSignalementsDetail(): Promise<StatDetailItem[]> {
    const reports = await api.get<any[]>("/api/admin/reports");
    return reports.map((r) => ({
      id: r.id,
      icon: "document-text",
      label: r.title || "Signalement",
      value: r.category,
      sublabel: r.status,
      date: r.createdAt,
      status: r.status,
      color: "#3B82F6",
    }));
  }

  async getUtilisateursDetail(): Promise<StatDetailItem[]> {
    const users = await api.get<any[]>("/api/admin/users");
    return users.map((u) => ({
      id: u.id,
      icon: "person",
      label: u.name,
      value: `${u.points} pts`,
      sublabel: u.email,
      date: u.createdAt,
      color: "#10B981",
    }));
  }

  async getPointsDetail(): Promise<StatDetailItem[]> {
    const users = await api.get<any[]>("/api/admin/users");
    return users.slice(0, 10).map((u) => ({
      id: u.id,
      icon: "star",
      label: u.name,
      value: `${u.points} pts`,
      sublabel: u.email,
      date: u.createdAt,
      color: "#F59E0B",
    }));
  }

  async getCo2Detail(): Promise<StatDetailItem[]> {
    return [];
  }
}
