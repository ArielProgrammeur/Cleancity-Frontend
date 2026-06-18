import type { Ionicons } from '@expo/vector-icons';

export interface ReportCategory {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
}

export const categories: ReportCategory[] = [
  {
    id: 'plastic',
    label: 'Plastique',
    icon: 'water-outline',
    color: '#2563EB',
    bgColor: '#EFF6FF',
  },
  {
    id: 'glass',
    label: 'Verre',
    icon: 'wine-outline',
    color: '#059669',
    bgColor: '#ECFDF5',
  },
  {
    id: 'organic',
    label: 'Organique',
    icon: 'leaf-outline',
    color: '#65A30D',
    bgColor: '#F7FEE7',
  },
  {
    id: 'electronic',
    label: 'Électronique',
    icon: 'laptop-outline',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
  },
  {
    id: 'hazardous',
    label: 'Dangereux',
    icon: 'warning-outline',
    color: '#DC2626',
    bgColor: '#FEF2F2',
  },
  {
    id: 'other',
    label: 'Autre',
    icon: 'ellipsis-horizontal-outline',
    color: '#6B7280',
    bgColor: '#F3F4F6',
  },
];
