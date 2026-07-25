export type AssignmentStatus = 'assigned' | 'en_route' | 'collecting' | 'completed' | 'cancelled';

export interface Assignment {
  id: string;
  reportId: string;
  reportTitle: string;
  reportCategory: string;
  reportLocation: string;
  reportDate: string;
  conducteurId: string;
  conducteurNom: string;
  adminId: string;
  status: AssignmentStatus;
  assignedAt: string;
  completedAt?: string;
  notes?: string;
}

export const ASSIGNMENT_STATUS_CONFIG: Record<AssignmentStatus, { label: string; color: string; bg: string; icon: string }> = {
  assigned: { label: 'Assigné', color: '#3B82F6', bg: '#3B82F615', icon: 'mail' },
  en_route: { label: 'En route', color: '#F59E0B', bg: '#F59E0B15', icon: 'navigate' },
  collecting: { label: 'En collecte', color: '#8B5CF6', bg: '#8B5CF615', icon: 'trash' },
  completed: { label: 'Terminé', color: '#10B981', bg: '#10B98115', icon: 'checkmark-circle' },
  cancelled: { label: 'Annulé', color: '#EF4444', bg: '#EF444415', icon: 'close-circle' },
};
