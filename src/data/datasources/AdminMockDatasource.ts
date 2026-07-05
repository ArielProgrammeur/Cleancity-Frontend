export interface AdminStats {
  totalReports: number;
  activeUsers: number;
  totalPointsIssued: number;
  totalCo2Saved: number;
  reportsByCategory: { category: string; count: number; color: string }[];
  reportsByStatus: { status: string; count: number; color: string }[];
  monthlyReports: { month: string; count: number }[];
  recentReports: AdminReport[];
}

export interface AdminReport {
  id: string;
  user: string;
  category: string;
  status: string;
  date: string;
  location: string;
}

export interface StatDetailItem {
  id: string;
  icon: string;
  label: string;
  value: string;
  sublabel: string;
  date: string;
  status?: string;
  color: string;
}

export class AdminMockDatasource {
  async getStats(): Promise<AdminStats> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      totalReports: 584,
      activeUsers: 342,
      totalPointsIssued: 128_450,
      totalCo2Saved: 4_280,
      reportsByCategory: [
        { category: 'Plastique', count: 182, color: '#3B82F6' },
        { category: 'Verre', count: 94, color: '#10B981' },
        { category: 'Organique', count: 128, color: '#84CC16' },
        { category: 'Électronique', count: 67, color: '#8B5CF6' },
        { category: 'Dangereux', count: 45, color: '#EF4444' },
        { category: 'Autre', count: 68, color: '#6B7280' },
      ],
      reportsByStatus: [
        { status: 'En attente', count: 143, color: '#F59E0B' },
        { status: 'Approuvé', count: 271, color: '#3B82F6' },
        { status: 'Collecté', count: 170, color: '#10B981' },
      ],
      monthlyReports: [
        { month: 'Jan', count: 38 }, { month: 'Fév', count: 42 },
        { month: 'Mar', count: 51 }, { month: 'Avr', count: 47 },
        { month: 'Mai', count: 63 }, { month: 'Juin', count: 58 },
        { month: 'Juil', count: 72 }, { month: 'Août', count: 68 },
        { month: 'Sep', count: 55 }, { month: 'Oct', count: 61 },
        { month: 'Nov', count: 49 }, { month: 'Déc', count: 44 },
      ],
      recentReports: [
        { id: 'RPT-001', user: 'Sophie Martin', category: 'Plastique', status: 'pending', date: '2024-12-18', location: 'Rue de la Paix, Paris' },
        { id: 'RPT-002', user: 'Lucas Bernard', category: 'Verre', status: 'approved', date: '2024-12-17', location: 'Bd St-Germain, Paris' },
        { id: 'RPT-003', user: 'Emma Dubois', category: 'Organique', status: 'collected', date: '2024-12-17', location: 'Rue de Rivoli, Paris' },
        { id: 'RPT-004', user: 'Thomas Petit', category: 'Électronique', status: 'pending', date: '2024-12-16', location: 'Av. Champs-Élysées, Paris' },
        { id: 'RPT-005', user: 'Julie Leroy', category: 'Dangereux', status: 'approved', date: '2024-12-16', location: 'Rue du Bac, Paris' },
        { id: 'RPT-006', user: 'Antoine Moreau', category: 'Plastique', status: 'collected', date: '2024-12-15', location: 'Place Vendôme, Paris' },
        { id: 'RPT-007', user: 'Camille Roux', category: 'Autre', status: 'pending', date: '2024-12-15', location: 'Rue Montorgueil, Paris' },
        { id: 'RPT-008', user: 'Hugo Laurent', category: 'Verre', status: 'approved', date: '2024-12-14', location: 'Bd Haussmann, Paris' },
      ],
    };
  }

  async getSignalementsDetail(): Promise<StatDetailItem[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [
      { id: '1', icon: 'person', label: 'Sophie Martin', value: 'Plastique', sublabel: 'Rue de la Paix, Paris', date: '2024-12-18', status: 'pending', color: '#3B82F6' },
      { id: '2', icon: 'person', label: 'Lucas Bernard', value: 'Verre', sublabel: 'Bd St-Germain, Paris', date: '2024-12-17', status: 'approved', color: '#10B981' },
      { id: '3', icon: 'person', label: 'Emma Dubois', value: 'Organique', sublabel: 'Rue de Rivoli, Paris', date: '2024-12-17', status: 'collected', color: '#84CC16' },
      { id: '4', icon: 'person', label: 'Thomas Petit', value: 'Électronique', sublabel: 'Av. Champs-Élysées, Paris', date: '2024-12-16', status: 'pending', color: '#8B5CF6' },
      { id: '5', icon: 'person', label: 'Julie Leroy', value: 'Dangereux', sublabel: 'Rue du Bac, Paris', date: '2024-12-16', status: 'approved', color: '#EF4444' },
      { id: '6', icon: 'person', label: 'Antoine Moreau', value: 'Plastique', sublabel: 'Place Vendôme, Paris', date: '2024-12-15', status: 'collected', color: '#3B82F6' },
      { id: '7', icon: 'person', label: 'Camille Roux', value: 'Autre', sublabel: 'Rue Montorgueil, Paris', date: '2024-12-15', status: 'pending', color: '#6B7280' },
      { id: '8', icon: 'person', label: 'Hugo Laurent', value: 'Verre', sublabel: 'Bd Haussmann, Paris', date: '2024-12-14', status: 'approved', color: '#10B981' },
    ];
  }

  async getUtilisateursDetail(): Promise<StatDetailItem[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [
      { id: '1', icon: 'trophy', label: 'Sophie Martin', value: '1 280 pts', sublabel: '12 signalements · Membre depuis 2023', date: '2024-12-18', color: '#F59E0B' },
      { id: '2', icon: 'trophy', label: 'Lucas Bernard', value: '940 pts', sublabel: '8 signalements · Membre depuis 2023', date: '2024-12-17', color: '#F59E0B' },
      { id: '3', icon: 'trophy', label: 'Emma Dubois', value: '815 pts', sublabel: '7 signalements · Membre depuis 2024', date: '2024-12-17', color: '#F59E0B' },
      { id: '4', icon: 'trophy', label: 'Thomas Petit', value: '720 pts', sublabel: '6 signalements · Membre depuis 2024', date: '2024-12-16', color: '#F59E0B' },
      { id: '5', icon: 'trophy', label: 'Julie Leroy', value: '650 pts', sublabel: '5 signalements · Membre depuis 2024', date: '2024-12-16', color: '#F59E0B' },
      { id: '6', icon: 'trophy', label: 'Antoine Moreau', value: '510 pts', sublabel: '4 signalements · Membre depuis 2024', date: '2024-12-15', color: '#F59E0B' },
    ];
  }

  async getPointsDetail(): Promise<StatDetailItem[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [
      { id: '1', icon: 'star', label: 'Signalement #RPT-001', value: '+50 pts', sublabel: 'Sophie Martin · Plastique', date: '2024-12-18', color: '#10B981' },
      { id: '2', icon: 'star', label: 'Signalement #RPT-002', value: '+50 pts', sublabel: 'Lucas Bernard · Verre', date: '2024-12-17', color: '#10B981' },
      { id: '3', icon: 'star', label: 'Signalement #RPT-003', value: '+50 pts', sublabel: 'Emma Dubois · Organique', date: '2024-12-17', color: '#10B981' },
      { id: '4', icon: 'star', label: 'Récompense: Bouteille', value: '-300 pts', sublabel: 'Sophie Martin', date: '2024-12-16', color: '#EF4444' },
      { id: '5', icon: 'star', label: 'Signalement #RPT-004', value: '+50 pts', sublabel: 'Thomas Petit · Électronique', date: '2024-12-16', color: '#10B981' },
      { id: '6', icon: 'star', label: 'Signalement #RPT-005', value: '+50 pts', sublabel: 'Julie Leroy · Dangereux', date: '2024-12-16', color: '#10B981' },
      { id: '7', icon: 'star', label: 'Récompense: Sac Bio', value: '-150 pts', sublabel: 'Lucas Bernard', date: '2024-12-15', color: '#EF4444' },
      { id: '8', icon: 'star', label: 'Bonus éco', value: '+100 pts', sublabel: 'Emma Dubois · 3 signalements en 1 sem.', date: '2024-12-15', color: '#8B5CF6' },
    ];
  }

  async getCo2Detail(): Promise<StatDetailItem[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [
      { id: '1', icon: 'leaf', label: 'Sophie Martin', value: '48 kg', sublabel: 'Plastique recyclé · 12 signalements', date: '2024-12-18', color: '#10B981' },
      { id: '2', icon: 'leaf', label: 'Lucas Bernard', value: '36 kg', sublabel: 'Verre recyclé · 8 signalements', date: '2024-12-17', color: '#10B981' },
      { id: '3', icon: 'leaf', label: 'Emma Dubois', value: '28 kg', sublabel: 'Organique composté · 7 signalements', date: '2024-12-17', color: '#84CC16' },
      { id: '4', icon: 'leaf', label: 'Thomas Petit', value: '22 kg', sublabel: 'Électronique recyclé · 6 signalements', date: '2024-12-16', color: '#8B5CF6' },
      { id: '5', icon: 'leaf', label: 'Julie Leroy', value: '18 kg', sublabel: 'Déchets dangereux traités · 5 signalements', date: '2024-12-16', color: '#EF4444' },
      { id: '6', icon: 'leaf', label: 'Antoine Moreau', value: '14 kg', sublabel: 'Plastique recyclé · 4 signalements', date: '2024-12-15', color: '#3B82F6' },
    ];
  }
}
