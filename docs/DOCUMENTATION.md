# DOCUMENTATION — CleanCity

## Architecture du projet

CleanCity est une application mobile de gestion des déchets en ville.

### Stack
- **React Native** 0.81.5 / **Expo SDK** 54 / **Expo Router** 4.x
- **pnpm** / **TypeScript** strict / **StyleSheet.create** (pas de NativeWind)

### Clean Architecture (3 couches)
```
src/
├── core/       ← Utilitaires (Result, DI, theme)
├── domain/     ← Entités + repositories abstraits
├── data/       ← Implémentations (Firebase à venir)
└── presentation/ ← UI par features (splash, onboarding, auth, reporting)
```

### Navigation
```
Splash → Onboarding → Login/SignUp → Dashboard (Bottom Tabs)
                                         ├── Home (Dashboard)
                                         ├── Report
                                         ├── Rewards
                                         ├── Marketplace
                                         └── Profile
```

### Fonctionnalités actuelles
- **Splash** : animation fade-in, redirection vers onboarding
- **Onboarding** : 3 slides (Signaler → Gagner → Échanger)
- **Auth** : Login/SignUp (simulé, Firebase à venir)
- **Dashboard** : stats, niveau/XP, impact CO₂, Quick Access, collecte, rapports récents
- **Reporting** : formulaire signalement (photo, catégorie, description)
- **Marketplace** : prix des matériaux recyclables

### Commandes
```bash
npx expo start -c    # Lancer (cache vidé)
npx tsc --noEmit     # Vérifier les types
```

*Voir docs/ARCHITECTURE_GLOBALE.md pour le détail complet*
