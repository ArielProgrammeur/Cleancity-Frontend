# Architecture Globale — CleanCity

## Stack technique

| Technologie | Version | Rôle |
|---|---|---|
| React Native | 0.81.5 | Framework mobile |
| Expo SDK | 54 | Plateforme de développement |
| Expo Router | 4.x | Navigation fichier-based |
| pnpm | — | Package manager |
| TypeScript | strict | Langage |
| Ionicons | — | Icônes |
| AsyncStorage | — | Stockage local |
| StyleSheet.create | — | Styles (pas de Tailwind) |

---

## Architecture : Clean Architecture 3 couches

```
src/
├── core/        ← Utilitaires transverses (Result, DI, theme)
├── domain/      ← Règles métier (entités, repositories abstraits)
├── data/        ← Implémentations concrètes (Firestore, API)
└── presentation/← UI features organisées par module
```

---

## Navigation : App Flow

```
app/ (Expo Router — fichier-based)
├── _layout.tsx       ← Root Stack (SafeAreaProvider)
├── index.tsx         → SplashScreen (2.5s, animation fade-in)
├── onboarding.tsx    → OnboardingScreen (3 slides swipe)
├── login.tsx         → LoginScreen (email/pwd, social)
├── signup.tsx        → SignUpScreen (name/email/pwd)
├── (tabs)/           ← Bottom Tab Navigator (5 tabs animés)
│   ├── _layout.tsx   → TabBar config + animations spring
│   ├── index.tsx     → Dashboard (stats, niveau, impact, activités)
│   ├── report.tsx    → ReportScreen (signalement déchet)
│   ├── rewards.tsx   → Placeholder récompenses
│   ├── marketplace.tsx → Marketplace (prix recyclage)
│   └── profile.tsx   → Placeholder profil
├── details.tsx       ← Page exemple (nettoyée, StyleSheet)
├── +html.tsx         ← Template web
└── +not-found.tsx    ← 404 (nettoyée, StyleSheet)
```

**Flux utilisateur :**
```
Splash (2.5s) → Onboarding (3 slides) → Login/SignUp → Dashboard (tabs)
```

---

## Dossier par dossier, fichier par fichier

### 1. `app/_layout.tsx` — Layout racine
- Wrappe l'app dans `SafeAreaProvider`
- Définit un `Stack` global pour la navigation
- Tous les écrans sont des enfants de ce Stack

### 2. `app/index.tsx` — Route racine (Splash)
- Affiche `SplashScreen`
- Le splash dure 2.5 secondes
- Redirige vers `/onboarding`
- **Pas de vérification AsyncStorage en mode dev**

### 3. `app/onboarding.tsx` — Onboarding
- 3 slides : Signaler → Gagner → Échanger
- Swipe horizontal (FlatList + pagingEnabled)
- Boutons Passer / Suivant / Commencer
- StepIndicator 1/3 2/3 3/3
- À la fin → `router.replace('/(tabs)')`

### 4. `app/login.tsx` — Connexion
- Affiche `LoginScreen`
- Champs : email, mot de passe
- Boutons Google / Apple
- Lien vers SignUp
- Connexion simulée (Firebase plus tard)

### 5. `app/signup.tsx` — Inscription
- Affiche `SignUpScreen`
- Champs : nom, email, mot de passe
- Boutons Google / Apple
- Lien vers SignIn

### 6. `app/(tabs)/` — Groupe de tabs

#### `app/(tabs)/_layout.tsx`
- Configure le `Bottom Tab Navigator` avec 5 tabs
- Icônes animées (bounce scale 1→1.4 au focus via `Animated.spring`)
- TabBar : fond blanc, bordure fine en haut
- Couleurs : actif `#2E7D32`, inactif `#9CA3AF`

#### `app/(tabs)/index.tsx` — Dashboard (page d'accueil)
- **Header vert** #2E7D32 avec :
  - Avatar + prénom "Ariel 👋"
  - Icône notifications avec badge rouge
  - Pills : points (240), reports (12), earned (€8)
- **Carte Niveau** : "Eco Warrior" avec barre XP 480/750
- **Impact environnemental** : 3 cartes (CO₂ 24kg, Eau 340L, +15% mois)
- **Quick Access** : grille 2×2 (Report, Rewards, Marketplace, Collection)
- **Next Collection** : mercredi 17 juin, 08h-12h
- **Recent Reports** : 4 signalements avec statuts (Pending/Approved/Collected)

#### `app/(tabs)/report.tsx`
- Affiche `ReportScreen`
- Formulaire : photo, catégorie, description, localisation, submit

#### `app/(tabs)/rewards.tsx`
- Écran placeholder "Coming soon"

#### `app/(tabs)/marketplace.tsx`
- Prix des matériaux recyclables (Plastique, Verre, Papier, Électronique, Textile, Métal)
- Grille 2 colonnes avec icônes et prix/kg

#### `app/(tabs)/profile.tsx`
- Écran placeholder "Coming soon"

### 7. `app/details.tsx`
- Page exemple nettoyée (ne dépend plus de `components/`)
- Utilise `StyleSheet.create` et `useLocalSearchParams<{ name?: string }>()`
- Affiche un fallback "No user specified" si paramètre absent

### 8. `app/+not-found.tsx`
- Page 404 nettoyée (ne dépend plus de `components/Container`)
- StyleSheet.create, fond blanc, lien vert vers Home

---

### 9. `src/core/` — Fondations transverses

| Fichier | Rôle |
|---|---|
| `utils/Result.ts` | Type Result<T, E> (Ok/Err) pour les retours de repositories |
| `errors/Failure.ts` | Classes d'erreur métier |
| `di/container.ts` | Conteneur d'injection de dépendances |
| `theme/colors.ts` | Palette de couleurs |
| `theme/spacing.ts` | Constantes d'espacement |
| `theme/typography.ts` | Constantes typographiques |

### 10. `src/domain/` — Couche métier

Entités :

| Fichier | Contenu |
|---|---|
| `entities/User.ts` | Interface User (id, name, email, avatar, points, level) |
| `entities/WasteReport.ts` | Interface WasteReport (id, userId, category, description, imageUrl, coordinates, status, dates) |
| `entities/Reward.ts` | Interface Reward (id, title, description, pointsCost, imageUrl, stock) |
| `entities/CollectionRoute.ts` | Interface CollectionRoute (id, zone, dayOfWeek, timeRange, waypoints) |
| `entities/WasteCategory.ts` | Enum : PLASTIC, GLASS, ORGANIC, ELECTRONIC, HAZARDOUS, OTHER |
| `entities/ReportStatus.ts` | Enum : PENDING, APPROVED, COLLECTED, REJECTED |
| `entities/CollectionWaypoint.ts` | Interface point de collecte (lat, lng, address, estimatedTime) |

Repositories (contrats) :

| Fichier | Contenu |
|---|---|
| `repositories/IAuthRepository.ts` | login, signup, logout, getCurrentUser |
| `repositories/IWasteReportRepository.ts` | create, getAll, getByUser, updateStatus |
| `repositories/IRewardRepository.ts` | getAll, getById, redeem |

### 11. `src/presentation/features/splash/` — Module Splash

| Fichier | Rôle |
|---|---|
| `screens/SplashScreen.tsx` | Fond vert, icône feuille, animation fade-in + spring, navigation vers /onboarding après 2.5s |

### 12. `src/presentation/features/onboarding/` — Module Onboarding

| Fichier | Rôle |
|---|---|
| `screens/OnboardingScreen.tsx` | FlatList 3 slides, StepIndicator, navigation vers /(tabs) |
| `components/OnboardingSlide.tsx` | Slide : titre, description, StepIndicator intégré |
| `data/slides.ts` | 3 slides : Signaler, Gagner, Échanger |
| `hooks/useOnboarding.ts` | Marque l'onboarding comme complété (AsyncStorage) |

### 13. `src/presentation/features/auth/` — Module Auth

| Fichier | Rôle |
|---|---|
| `screens/LoginScreen.tsx` | Email/password, forgot password, Google/Apple, lien SignUp |
| `screens/SignUpScreen.tsx` | Nom/email/password, Google/Apple, lien SignIn |
| `components/AuthInput.tsx` | Champ réutilisable avec icône et focus vert |

### 14. `src/presentation/features/reporting/` — Module Reporting

| Fichier | Rôle |
|---|---|
| `screens/ReportScreen.tsx` | Formulaire complet : photo, catégories, description, localisation, submit |
| `components/CategorySelector.tsx` | Grille 6 catégories cliquables |
| `components/ImagePicker.tsx` | Zone photo avec aperçu |
| `data/categories.ts` | 6 catégories (icône, couleur, bgColor) |

### 15. `src/presentation/shared/` — Composants partagés

| Fichier | Rôle |
|---|---|
| `StepIndicator.tsx` | Cercles 1→2→3 avec lignes de connexion |

---

## Cleanup effectué

| Problème | Correctif |
|---|---|
| `components/Button.tsx`, `Container.tsx`, `EditScreenInfo.tsx`, `ScreenContent.tsx` | **Supprimés** — boilerplate inutilisé du template |
| `src/index.ts`, `src/presentation/index.ts`, `src/presentation/features/onboarding/components/index.ts` | **Supprimés** — barrel files jamais importés |
| `app/+not-found.tsx` utilisait NativeWind + `@/components/Container` | **Réécrit** en StyleSheet.create, plus de dépendance morte |
| `app/details.tsx` utilisait NativeWind + `@/components/Container` | **Réécrit** en StyleSheet.create, `name` typé avec fallback |
| `app/(tabs)/index.tsx` progress bar `as any` sur width | **Remplacé** par `as DimensionValue` (type-safe) |

---

## Décisions techniques clés

1. **StyleSheet.create plutôt que NativeWind** — NativeWind ne fonctionnait pas sur les Animated.View. StyleSheet.create est fiable et typé.

2. **Imports relatifs (../src/) plutôt que @/** — Évite les soucis de résolution de paths.

3. **StepIndicator intégré dans OnboardingSlide** — Naturellement sous la description.

4. **Connexion simulée** — Firebase viendra avec la couche data/.

5. **Splash skip AsyncStorage en dev** — Redirige toujours vers /onboarding.

6. **Tab bar animée** — Scale bounce 1→1.4 via `Animated.spring` avec `useNativeDriver`.

7. **Dashboard enrichi** — Niveau, XP, impact environnemental, statuts des signalements.

8. **Pas de dépendances mortes** — Tout fichier non utilisé a été supprimé, `tsc --noEmit` = 0 erreur.

---

## Commandes utiles

```bash
# Lancer le projet (cache vidé)
npx expo start -c

# Vérifier les types TypeScript
npx tsc --noEmit

# Installer une dépendance
pnpm add <package>
```

---

## Prochaines étapes

- [ ] Connexion Firebase (Auth + Firestore)
- [ ] Prise de photo réelle (expo-image-picker)
- [ ] Géolocalisation (expo-location)
- [ ] Écran Rewards complet
- [ ] Écran Profile complet
- [ ] Marketplace : mise en vente réelle
- [ ] Notifications push
- [ ] Tests unitaires

---

*Document créé le 12/06/2026 — Nettoyage final : 0 erreur, 0 fichier mort*
