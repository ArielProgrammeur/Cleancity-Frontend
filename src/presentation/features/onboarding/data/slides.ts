import type { Ionicons } from '@expo/vector-icons';

export interface OnboardingSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  backgroundColor: string;
}

export const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'trash-bin',
    title: 'Signalez les déchets',
    description:
      'Vous voyez un dépôt sauvage ou un encombrant dans la rue ? Prenez une photo, décrivez-le et signalez-le en un clic.',
    backgroundColor: '#2E7D32',
  },
  {
    id: '2',
    icon: 'trophy',
    title: 'Gagnez des points',
    description:
      'Chaque signalement vous rapporte des points. Plus vous signalez, plus vous cumulez !',
    backgroundColor: '#1B5E20',
  },
  {
    id: '3',
    icon: 'gift',
    title: 'Échangez vos récompenses',
    description:
      'Utilisez vos points pour obtenir des bons d’achat, des réductions, ou d’autres cadeaux. Votre ville vous remercie !',
    backgroundColor: '#0D3B0F',
  },
];
