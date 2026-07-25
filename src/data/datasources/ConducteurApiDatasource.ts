import { api } from "../../core/api/api";
import { Conducteur } from "../../domain/entities/Conducteur";

export class ConducteurApiDatasource {
  async getAll(): Promise<Conducteur[]> {
    return api.get<Conducteur[]>("/api/drivers/");
  }

  async getAllSync(): Promise<Conducteur[]> {
    return this.getAll();
  }

  async getById(id: string): Promise<Conducteur | null> {
    try {
      return await api.get<Conducteur>(`/api/drivers/${id}`);
    } catch {
      return null;
    }
  }

  async create(data: Omit<Conducteur, "id" | "signalementsTraites" | "tauxCompletion" | "rotation" | "tempsMoyen" | "derniereActivite">): Promise<Conducteur> {
    return api.post<Conducteur>("/api/drivers/", data);
  }

  async update(id: string, data: Partial<Conducteur>): Promise<Conducteur | null> {
    try {
      return await api.put<Conducteur>(`/api/drivers/${id}`, data);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/drivers/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  async getStats() {
    const all = await this.getAll();
    return {
      total: all.length,
      actifs: all.filter((d) => d.statut === "actif").length,
      inactifs: all.filter((d) => d.statut === "inactif").length,
      suspendus: all.filter((d) => d.statut === "suspendu").length,
      totalTraites: all.reduce((sum, d) => sum + d.signalementsTraites, 0),
      completionMoyenne: all.length
        ? Math.round(all.reduce((sum, d) => sum + d.tauxCompletion, 0) / all.length)
        : 0,
    };
  }
}
