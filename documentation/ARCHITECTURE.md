# Architecture du Frontend CleanCity

---

## Vue d'ensemble

Le frontend est une application **React Native / Expo SDK 54** construite avec une **Clean Architecture** en 3 couches, utilisant **expo-router v6** pour le routing file-based.

```
┌─────────────────────────────────────────────┐
│           Presentation Layer                │
│    (Ecrans, Composants, Hooks, Contexts)    │
├─────────────────────────────────────────────┤
│              Data Layer                     │
│    (API Datasources, Repository Impls)      │
├─────────────────────────────────────────────┤
│              Domain Layer                   │
│       (Entites, Interfaces Repository)      │
└─────────────────────────────────────────────┘
```

---

## Structure des dossiers

```
Frontend/
├── app/                              # ROUTING (expo-router file-based)
│   ├── _layout.tsx                   # Root Stack (SafeAreaProvider + Contexts)
│   ├── index.tsx                     # Splash screen → redirect auto
│   ├── login.tsx                     # Connexion
│   ├── signup.tsx                    # Inscription
│   ├── forgot-password.tsx           # Mot de passe oublie
│   ├── otp-verification.tsx          # Verification OTP
│   ├── onboarding.tsx                # 3 slides de presentation
│   ├── language.tsx                  # Selection langue (fr/en)
│   ├── notifications.tsx             # Notifications
│   ├── report-history.tsx            # Historique des signalements
│   ├── report/[id].tsx               # Detail d'un signalement
│   ├── settings.tsx                  # Reglages
│   ├── wishlist.tsx                  # Liste de souhaits
│   ├── leaderboard.tsx               # Classement
│   ├── collection-schedule.tsx       # Planning de collecte (optimisé par IA)
│   ├── tracking.tsx                  # Suivi GPS temps réel des camions
│   ├── predictions.tsx               # Prédictions IA volumes de déchets
│   ├── rewards/[id].tsx              # Detail recompense
│   ├── marketplace/[id].tsx          # Detail produit
│   ├── marketplace/create-listing.tsx # Creer une annonce
│   ├── profile/edit.tsx              # Modifier le profil
│   │
│   ├── (tabs)/                       # TAB NAVIGATOR (5 onglets)
│   │   ├── _layout.tsx               # Bottom tabs config
│   │   ├── index.tsx                 # Home
│   │   ├── report.tsx                # Signalement
│   │   ├── marketplace.tsx           # Marketplace
│   │   ├── rewards.tsx               # Recompenses
│   │   └── profile.tsx               # Profil
│   │
│   ├── admin/                        # ROUTES ADMIN
│   │   ├── _layout.tsx               # Admin Stack + auth guard
│   │   ├── login.tsx                 # Login admin
│   │   ├── index.tsx                 # Dashboard admin
│   │   ├── conducteurs/              # CRUD conducteurs
│   │   ├── signalements/             # Gestion signalements
│   │   ├── utilisateurs/             # Consultation users
│   │   ├── recompenses/              # CRUD recompenses
│   │   └── parametres/               # Parametres
│   │
│   └── driver/                       # ROUTES CONDUCTEUR
│       ├── _layout.tsx               # Driver Stack + auth guard
│       ├── login.tsx                 # Login conducteur
│       ├── index.tsx                 # Dashboard conducteur
│       ├── taches/                   # Liste taches
│       └── profil/                   # Profil conducteur
│
├── src/
│   ├── core/                         # FONDATIONS
│   │   ├── firebase.ts               # Init Firebase (app, auth)
│   │   ├── api/api.ts                # ApiService central (fetch + Bearer)
│   │   ├── contexts/                 # React Contexts
│   │   │   ├── UserContext.tsx        # Etat utilisateur principal
│   │   │   ├── AdminContext.tsx       # Auth admin + role check
│   │   │   ├── DriverContext.tsx      # Auth conducteur
│   │   │   └── SidebarContext.tsx     # Sidebar ouverture/fermeture
│   │   ├── services/                 # Services métier
│   │   │   └── gpsTrackingService.ts # Hook GPS continuation (tracking temps réel)
│   │   ├── theme/                    # Design tokens
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   ├── spacing.ts
│   │   │   └── index.ts
│   │   ├── utils/                    # Utilitaires
│   │   │   ├── format.ts             # formatPrice (XOF), etc.
│   │   │   ├── Result.ts             # Success<T> / Failure
│   │   │   └── index.ts
│   │   ├── errors/Failure.ts         # Classe d'erreur
│   │   └── i18n/                     # Internationalisation
│   │       ├── index.ts              # Config i18next
│   │       ├── fr.json               # Traductions FR
│   │       └── en.json               # Traductions EN
│   │
│   ├── domain/                       # ENTITES
│   │   ├── User.ts                   # User, UserRole
│   │   ├── Profile.ts                # UserProfile, Badge, Impact
│   │   ├── WasteReport.ts            # WasteReport
│   │   ├── Reward.ts                 # Reward
│   │   ├── Product.ts                # Product
│   │   ├── Conducteur.ts             # Conducteur
│   │   ├── Assignment.ts             # Assignment
│   │   ├── CollectionRoute.ts        # CollectionRoute
│   │   ├── CollectionWaypoint.ts     # CollectionWaypoint
│   │   ├── WasteCategory.ts          # Categories enum
│   │   └── ReportStatus.ts           # Statuts enum
│   │
│   ├── data/                         # COUCHE DONNEES
│   │   ├── datasources/              # Appels API REST
│   │   │   ├── ProfileApiDatasource.ts
│   │   │   ├── SignalementApiDatasource.ts
│   │   │   ├── ConducteurApiDatasource.ts
│   │   │   ├── AssignmentApiDatasource.ts
│   │   │   ├── AdminApiDatasource.ts
│   │   │   ├── RecompenseApiDatasource.ts
│   │   │   ├── RewardApiDatasource.ts
│   │   │   ├── UtilisateurApiDatasource.ts
│   │   │   ├── NotificationApiDatasource.ts
│   │   │   ├── MarketplaceApiDatasource.ts
│   │   │   ├── TrackingApiDatasource.ts    # Suivi GPS temps réel
│   │   │   └── AiApiDatasource.ts          # Classification IA + prédictions
│   │   └── repositories/             # Implementations Repository
│   │       ├── ProfileRepositoryImpl.ts
│   │       ├── MarketplaceRepositoryImpl.ts
│   │       └── RewardRepositoryImpl.ts
│   │
│   └── presentation/                 # COUCHE PRESENTATION
│       ├── features/
│       │   ├── auth/                 # Auth (Login, SignUp, OTP)
│       │   ├── reporting/            # Signalement (wizard 3 etapes)
│       │   ├── rewards/              # Recompenses (liste, cards, claim)
│       │   ├── marketplace/          # Marketplace (produits, listings)
│       │   ├── profile/              # Profil (stats, badges, impact)
│       │   ├── admin/                # Composants admin
│       │   └── shared/               # Composants partages
│       └── secondary/                # Ecrans secondaires
│           ├── TrackingScreen.tsx     # Carte GPS temps réel
│           ├── PredictionsScreen.tsx  # Prédictions IA
│           └── CollectionScheduleScreen.tsx # Planning optimisé
│
├── documentation/
├── package.json
├── app.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── eas.json
└── .env
```

---

## Routing (expo-router)

### Navigation Hierarchy

```
Root Stack (_layout.tsx)
├── (public) login, signup, onboarding, etc.
├── (tabs)/ → Bottom Tab Navigator
│   ├── Home
│   ├── Report
│   ├── Marketplace
│   ├── Rewards
│   └── Profile
├── admin/ → Admin Stack
│   ├── login
│   ├── index (dashboard)
│   ├── conducteurs/...
│   ├── signalements/...
│   ├── utilisateurs/...
│   ├── recompenses/...
│   └── parametres/
└── driver/ → Driver Stack
    ├── login
    ├── index (dashboard)
    ├── taches/...
    └── profil/
```

### Redirect Logic (app/index.tsx)

```
Splash Screen
    │
    ├── Firebase Auth user existe ?
    │   NON → /onboarding → /login
    │
    ├── user.role == "admin" ?
    │   OUI → /admin
    │
    ├── user.role == "driver" ?
    │   OUI → /driver
    │
    └── SINON → /(tabs) (app citoyen)
```

---

## Les 3 Contexts Auth

### UserContext (`src/core/contexts/UserContext.tsx`)

| State | Type | Description |
|-------|------|-------------|
| `userId` | `string` | Firebase UID |
| `userName` | `string` | Nom affiche |
| `isLoggedIn` | `boolean` | Etat de connexion |
| `profile` | `UserProfile \| null` | Profil charge depuis l'API |
| `badges` | `Badge[]` | Badges de l'utilisateur |
| `avatarUri` | `string \| null` | URI de l'avatar |
| `isLoading` | `boolean` | Chargement en cours |

Ecoute `onAuthStateChanged(auth)` pour detecter les changements de session.

### AdminContext (`src/core/contexts/AdminContext.tsx`)

| State | Type | Description |
|-------|------|-------------|
| `isAuthenticated` | `boolean` | Admin connecte |
| `admin` | `User \| null` | Donnees admin |
| `isLoading` | `boolean` | Chargement |

Verifie le custom claim `role: "admin"` dans le token Firebase.

### DriverContext (`src/contexts/DriverContext.tsx`)

| State | Type | Description |
|-------|------|-------------|
| `isAuthenticated` | `boolean` | Conducteur connecte |
| `driver` | `Conducteur \| null` | Profil conducteur |
| `isLoading` | `boolean` | Chargement |

Fetch le profil depuis `/api/drivers/by-email/{email}`.

---

## Flux de donnees

### Citoyen

```
Screen → Hook (useProfile, useRewards, etc.)
    → Repository (ProfileRepositoryImpl, etc.)
        → ApiDatasource (ProfileApiDatasource, etc.)
            → ApiService (api.ts)
                → fetch() → Backend FastAPI → Firestore
```

### Admin

```
AdminScreen → ApiDatasource directe (AdminApiDatasource, etc.)
    → ApiService → fetch() → Backend → Firestore
```

### Conducteur

```
DriverScreen → ApiDatasource (ConducteurApiDatasource, etc.)
    → ApiService → fetch() → Backend → Firestore
```

---

## Service API Central (`src/core/api/api.ts`)

```typescript
class ApiService {
  private baseURL = "http://192.168.100.3:8000";

  async get<T>(endpoint: string): Promise<T>
  async post<T>(endpoint: string, data: unknown): Promise<T>
  async put<T>(endpoint: string, data: unknown): Promise<T>
  async patch<T>(endpoint: string, data: unknown): Promise<T>
  async delete<T>(endpoint: string): Promise<T>
  async upload<T>(endpoint: string, formData: FormData): Promise<T>
}
```

- Ajoute automatiquement le token Firebase dans `Authorization: Bearer <token>`
- Gere les erreurs HTTP et les transforme en exceptions metier
- Utilise `fetch()` natif (pas axios)

### Configuration de l'URL

| Environnement | URL | Usage |
|--------------|-----|-------|
| Emulateur Android | `http://10.0.2.2:8000` | Par defaut |
| Emulateur iOS | `http://localhost:8000` | - |
| Telephone reel | `http://IP_PC:8000` | Meme reseau WiFi |
| Production | `https://api.cleancity.cm` | Backend deploye |

---

## Conventions de code

### Naming

| Element | Convention | Exemple |
|---------|-----------|---------|
| Fichiers ecrans | `PascalCase.tsx` | `ProfileScreen.tsx` |
| Fichiers hooks | `camelCase.ts` | `useProfile.ts` |
| Fichiers composants | `PascalCase.tsx` | `RewardCard.tsx` |
| Fichiers datasources | `PascalCase.ts` | `ProfileApiDatasource.ts` |
| Fichiers entites | `PascalCase.ts` | `WasteReport.ts` |
| Contexts | `PascalCase.tsx` | `UserContext.tsx` |
| Routes (repertoires) | `kebab-case` | `create-listing/` |

### Patterns utilises

- **Result pattern** : `Success<T>` / `Failure` pour les retours repository
- **Custom hooks** : `useXxx` pour la logique d'ecran (fetch, filtres, etat)
- **Datasource pattern** : Une classe par domaine API
- **Barrel exports** : Fichiers `index.ts` pour simplifier les imports

### Design System

| Mode | Theme | Couleur principale |
|------|-------|-------------------|
| Citoyen | Clair (`#F8FAFB`) | `#2563EB` (bleu) / `#2E7D32` (vert) |
| Admin | Sombre (`#0A0F1E`) | `#10B981` (vert) |
| Conducteur | Sombre (`#0A0F1E`) | `#10B981` (vert) |

---

## DevDependencies cles

| Package | Usage |
|---------|-------|
| `expo` SDK 54 | Framework React Native |
| `expo-router` v6 | Routing file-based |
| `firebase` v10 | Auth + config |
| `@react-native-firebase/app` | Firebase natif |
| `i18next` + `react-i18next` | Traductions |
| `react-native-reanimated` | Animations |
| `react-native-maps` | Cartes |
| `expo-location` | Geolocalisation |
| `react-native-svg` | Graphiques (DonutChart, BarChart) |
| `expo-linear-gradient` | Degrades visuels |
| `@expo/vector-icons` | Icones |

---

## Lancer le projet

```bash
cd Frontend
pnpm install
pnpm start        # Lance Expo
pnpm start --go   # Lance avec Expo Go
```

### Build natif

```bash
# Android
eas build --platform android --profile development

# iOS
eas build --platform ios --profile development
```
