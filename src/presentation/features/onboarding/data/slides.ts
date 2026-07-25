export interface OnboardingSlide {
  id: string;
  image: number;
  title: string;
  description: string;
  backgroundColor: string;
  imageResizeMode?: 'cover' | 'contain';
  circleSize?: number;
}

export const slides: OnboardingSlide[] = [
  {
    id: '1',
    image: require('../../../../../assets/onboarding1.png'),
    title: 'Signalez les déchets',
    description:
      'Vous voyez un dépôt sauvage ou un encombrant dans la rue ? Prenez une photo, décrivez-le et signalez-le en un clic.',
    backgroundColor: '#2E7D32',
  },
  {
    id: '2',
    image: require('../../../../../assets/onboarding2.png'),
    title: 'Gagnez des points',
    description:
      'Chaque signalement vous rapporte des points. Plus vous signalez, plus vous cumulez !',
    backgroundColor: '#2E7D32',
  },
  {
    id: '3',
    image: require('../../../../../assets/onboarding3.png'),
    imageResizeMode: 'contain',
    title: 'Échangez vos récompenses',
    description:
      'Utilisez vos points pour obtenir des bons d\'achat, des réductions, ou d\'autres cadeaux. Votre ville vous remercie !',
    backgroundColor: '#2E7D32',
  },
];
