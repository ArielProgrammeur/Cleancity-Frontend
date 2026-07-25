import { api } from "../../core/api/api";

export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  avatar: string;
  points: number;
  niveau: string;
  signalements: number;
  collectes: number;
  co2Sauve: number;
  dateInscription: string;
  derniereActivite: string;
  statut: string;
  zone: string;
}

export class UtilisateurApiDatasource {
  private NIVEAU_COLORS: Record<string, string> = {
    Diamond: "#B91C1C",
    Gold: "#D97706",
    Silver: "#6B7280",
    Bronze: "#92400E",
    Novice: "#1E40AF",
  };

  async getAll(): Promise<Utilisateur[]> {
    const users = await api.get<any[]>("/api/admin/users");
    return users.map((u) => ({
      id: u.id,
      nom: u.name.split(" ").pop() || "",
      prenom: u.name.split(" ").slice(0, -1).join(" ") || u.name,
      email: u.email,
      telephone: "",
      avatar: u.name.split(" ").map((n: string) => n[0]).join("").toUpperCase(),
      points: u.points,
      niveau: this.getNiveau(u.points),
      signalements: 0,
      collectes: 0,
      co2Sauve: 0,
      dateInscription: u.createdAt,
      derniereActivite: u.createdAt,
      statut: "actif",
      zone: "Douala Centre",
    }));
  }

  async getById(id: string): Promise<Utilisateur | null> {
    try {
      const u = await api.get<any>(`/api/admin/users/${id}`);
      return {
        id: u.id,
        nom: u.name.split(" ").pop() || "",
        prenom: u.name.split(" ").slice(0, -1).join(" ") || u.name,
        email: u.email,
        telephone: "",
        avatar: u.name.split(" ").map((n: string) => n[0]).join("").toUpperCase(),
        points: u.points,
        niveau: this.getNiveau(u.points),
        signalements: 0,
        collectes: 0,
        co2Sauve: 0,
        dateInscription: u.createdAt,
        derniereActivite: u.createdAt,
        statut: "actif",
        zone: "Douala Centre",
      };
    } catch {
      return null;
    }
  }

  async getStats() {
    const all = await this.getAll();
    return {
      total: all.length,
      actifs: all.filter((u) => u.statut === "actif").length,
      totalPoints: all.reduce((sum, u) => sum + u.points, 0),
      totalSignalements: all.reduce((sum, u) => sum + u.signalements, 0),
      totalCo2: all.reduce((sum, u) => sum + u.co2Sauve, 0),
    };
  }

  getNiveauColors(): Record<string, string> {
    return this.NIVEAU_COLORS;
  }

  private getNiveau(points: number): string {
    if (points >= 1000) return "Diamond";
    if (points >= 500) return "Gold";
    if (points >= 200) return "Silver";
    if (points >= 100) return "Bronze";
    return "Novice";
  }
}
