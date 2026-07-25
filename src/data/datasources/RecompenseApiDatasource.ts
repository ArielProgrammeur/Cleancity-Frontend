import { api } from "../../core/api/api";

export interface Recompense {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  imageUrl: string;
  stock: number;
  totalRedeemed: number;
  category: "physique" | "digitale" | "bonus";
  statut: "active" | "inactive";
  dateCreation: string;
}

export class RecompenseApiDatasource {
  async getAll(): Promise<Recompense[]> {
    const rewards = await api.get<any[]>("/api/rewards/");
    return rewards.map((r) => ({
      id: r.id,
      title: r.name,
      description: r.description,
      pointsCost: r.pointsCost,
      imageUrl: r.icon,
      stock: r.stock,
      totalRedeemed: r.totalStock - r.stock,
      category: this.mapCategory(r.category),
      statut: r.stock > 0 ? "active" : "inactive",
      dateCreation: r.expiresAt || "",
    }));
  }

  async getById(id: string): Promise<Recompense | null> {
    try {
      const r = await api.get<any>(`/api/rewards/${id}`);
      return {
        id: r.id,
        title: r.name,
        description: r.description,
        pointsCost: r.pointsCost,
        imageUrl: r.icon,
        stock: r.stock,
        totalRedeemed: r.totalStock - r.stock,
        category: this.mapCategory(r.category),
        statut: r.stock > 0 ? "active" : "inactive",
        dateCreation: r.expiresAt || "",
      };
    } catch {
      return null;
    }
  }

  async create(data: Partial<Recompense>): Promise<Recompense> {
    return api.post<Recompense>("/api/rewards/", data);
  }

  async update(id: string, data: Partial<Recompense>): Promise<Recompense | null> {
    try {
      return await api.put<Recompense>(`/api/rewards/${id}`, data);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/rewards/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  async getStats() {
    const all = await this.getAll();
    return {
      total: all.length,
      actives: all.filter((r) => r.statut === "active").length,
      totalRedeemed: all.reduce((sum, r) => sum + r.totalRedeemed, 0),
      valeurMoyenne: all.length
        ? Math.round(all.reduce((sum, r) => sum + r.pointsCost, 0) / all.length)
        : 0,
    };
  }

  getCategoryLabels() {
    return { physique: "Physique", digitale: "Digitale", bonus: "Bonus" };
  }

  getCategoryColors() {
    return { physique: "#3B82F6", digitale: "#8B5CF6", bonus: "#F59E0B" };
  }

  private mapCategory(category: string): "physique" | "digitale" | "bonus" {
    const map: Record<string, "physique" | "digitale" | "bonus"> = {
      eco: "physique",
      premium: "digitale",
      limited: "physique",
      donation: "bonus",
      experience: "digitale",
    };
    return map[category] || "bonus";
  }
}
