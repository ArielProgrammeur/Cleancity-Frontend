# CleanCity — Back Office (Admin Dashboard)

Interface d'administration mobile pour la gestion et le pilotage de l'application CleanCity. Dashboard moderne, dark theme, inspiré de Power BI mobile, avec visualisations SVG, sidebar navigation, et gestion complète des conducteurs (CRUD).

---

## 🚀 Accès

| Champ | Valeur |
|---|---|
| URL | `/admin` ou `/admin/login` |
| Email | `admin@gmail.com` |
| Mot de passe | `root` |

> La connexion admin se fait **depuis l'écran de login principal** de l'application (`app/login.tsx` → `LoginScreen.tsx`).  
> Si les identifiants `admin@gmail.com` / `root` sont saisis, l'utilisateur est redirigé vers le back-office au lieu de l'application classique.  
> Sinon, le comportement normal (connexion utilisateur → `/(tabs)`) est conservé.  
> **Aucun bouton admin** n'apparaît sur l'écran de login — seuls ceux qui connaissent les identifiants peuvent accéder.

---

## 📁 Structure complète des fichiers

```
app/admin/
├── _layout.tsx                    # Layout Stack + guard d'authentification + sidebar overlay
├── login.tsx                      # Écran de connexion admin (thème dark)
├── index.tsx                      # Dashboard principal (compose tous les composants)
├── signalements/
│   └── index.tsx                  # Placeholder — Gestion des signalements
├── utilisateurs/
│   └── index.tsx                  # Placeholder — Gestion des utilisateurs
├── recompenses/
│   └── index.tsx                  # Placeholder — Gestion des récompenses
├── parametres/
│   └── index.tsx                  # Placeholder — Paramètres administration
└── conducteurs/
    ├── index.tsx                  # Liste des conducteurs + stats + recherche
    ├── creer.tsx                  # Formulaire de création d'un conducteur
    └── [id]/
        ├── index.tsx              # Détail d'un conducteur (profil, stats, actions)
        └── editer.tsx             # Formulaire de modification d'un conducteur

src/
├── core/contexts/
│   ├── AdminContext.tsx           # Contexte d'authentification admin (login/logout/state)
│   └── SidebarContext.tsx         # Contexte d'état du tiroir de navigation (sidebar)
│
├── domain/entities/
│   └── Conducteur.ts             # Entité Conducteur (profil, véhicule, stats, performance)
│
├── data/datasources/
│   ├── AdminMockDatasource.ts    # Données mock agrégées (stats, rapports, tendances)
│   └── ConducteurMockDatasource.ts # Données mock CRUD conducteurs (10 profils)
│
└── presentation/admin/components/
    ├── Sidebar.tsx                # Tiroir de navigation latérale (6 sections)
    ├── AdminHeader.tsx            # Header premium avec gradient, avatar, métriques
    ├── StatCard.tsx               # Carte de statistique vitrée (pressable → modal)
    ├── StatDetailModal.tsx        # Modal bottom sheet avec breakdown par utilisateur
    ├── AnimatedCounter.tsx        # Compteur avec animation de défilement numérique
    ├── ChartCard.tsx              # Conteneur de graphique avec badge Live
    ├── BarChart.tsx               # Diagramme à barres horizontal avec glow
    ├── DonutChart.tsx             # Diagramme donut SVG avec segments creux
    ├── TrendChart.tsx             # Barres d'évolution mensuelle avec dégradé
    └── TimelineList.tsx           # Liste chronologique des signalements récents
```

---

## 🧩 Composants

### `Sidebar` — Tiroir de navigation

Tiroir latéral coulissant (72% de la largeur de l'écran) avec 6 sections :

| Section | Icône | Route | Badge |
|---|---|---|---|
| Tableau de bord | `grid` | `/admin` | — |
| Conducteurs | `people` | `/admin/conducteurs` | `10` |
| Signalements | `flag` | `/admin/signalements` | — |
| Utilisateurs | `person` | `/admin/utilisateurs` | — |
| Récompenses | `gift` | `/admin/recompenses` | — |
| Paramètres | `settings` | `/admin/parametres` | — |

- Fond overlay semi-transparent (appui pour fermer)
- Animation slide-in depuis la gauche (Reanimated v4)
- Élément actif détecté via `usePathname()` (surligné en vert)
- Pied de tiroir avec bouton de déconnexion rouge
- Géré via `SidebarContext` (`useSidebar()` expose `visible`, `toggle()`, `close()`)

### `AdminHeader` — Header premium

Header défilant avec dégradé `LinearGradient` traversant `#0A0F1E → #10B981 → #0A0F1E` :

- Avatar avec cercle vert gradient + point de statut vert pulsant
- Texte "Admin CleanCity" + sous-titre "Back Office"
- Barre de métriques horizontale (3 indicateurs : signalements/jour, conducteurs actifs, points émis)
- Bouton menu (hamburger) → ouvre la Sidebar
- Effet de glow subtil sous le header

### `StatCard` → `StatDetailModal`

Chaque carte de statistique est **pressable** ( `onPress` ). Au clic, un `StatDetailModal` s'ouvre en bottom sheet :

| Prop | Type | Description |
|---|---|---|
| `icon` | `string` | Nom Ionicons |
| `label` | `string` | Libellé (ex: "Signalements") |
| `value` | `number` | Valeur numérique |
| `color` | `string` | Couleur d'accent (hex) |
| `suffix` | `string` | Suffixe optionnel ("kg", "k") |
| `index` | `number` | Index pour délai d'animation |
| `onPress` | `() => void` | Callback d'ouverture du modal |

Le `StatDetailModal` affiche :
- Titre et sous-titre de la section
- Breakdown par utilisateur avec avatar (initiale + rond coloré)
- Valeur, icône de catégorie, date formatée, badge de statut
- Animations d'entrée cascadées (FadeInDown avec délai progressif)

### `AnimatedCounter`

Compteur qui s'anime de 0 à la valeur cible avec un effet de défilement numérique.

| Prop | Type | Défaut |
|---|---|---|
| `value` | `number` | requis |
| `suffix` | `string` | `''` |
| `delay` | `number` | `0` |
| `duration` | `number` | `1000` |
| `precision` | `number` | `0` |

### `ChartCard`

Conteneur générique pour section de graphique avec titre, sous-titre et badge Live.

| Prop | Type | Défaut |
|---|---|---|
| `title` | `string` | requis |
| `subtitle` | `string` | `undefined` |
| `icon` | `string` | requis |
| `accentColor` | `string` | `#10B981` |

### `BarChart`

Barres horizontales avec libellés, valeurs et effet de glow.

| Prop | Type |
|---|---|
| `data` | `{ category, count, color }[]` |

Animations cascadées `FadeInRight` avec délai basé sur l'index.

### `DonutChart`

Graphique donut SVG avec centre transparent affichant le total. Segments générés par arcs SVG (calcul des angles proportionnels).

| Prop | Type | Défaut |
|---|---|---|
| `data` | `{ status, count, color }[]` | requis |
| `size` | `number` | `160` |

### `TrendChart`

Barres verticales pour évolution mensuelle, avec dégradé de couleur.

| Prop | Type |
|---|---|
| `data` | `{ month, count }[]` |

12 barres avec hauteur proportionnelle, dégradé `#10B981 → #34D399`, pied avec moyenne + badge variation.

### `TimelineList`

Liste verticale avec points de timeline, badges de statut et informations.

| Prop | Type |
|---|---|
| `reports` | `AdminReport[]` |

Structure `AdminReport` : `id, user, category, status, date, location`.

---

## 📊 Dashboard

Le dashboard ( `app/admin/index.tsx` ) est composé de 6 sections :

### 1. Header premium
- `AdminHeader` avec gradient et métriques
- Animation live indicator (point vert pulsant)

### 2. 4 StatCards (grille 2×2)
| Carte | Icône | Couleur | Suffixe |
|---|---|---|---|
| Signalements | `flag` | `#3B82F6` (bleu) | — |
| Utilisateurs | `people` | `#10B981` (vert) | — |
| Points émis | `star` | `#F59E0B` (ambre) | `k` |
| CO₂ sauvé | `leaf` | `#8B5CF6` (violet) | `kg` |

Chaque carte : icône dans anneau avec glow, statut dot, compteur animé, barre lumineuse.  
Pressable → `StatDetailModal` avec breakdown détaillé.

### 3. Signalements par catégorie
BarChart horizontal : 6 catégories (Plastique, Verre, Organique, Électronique, Dangereux, Autre).  
Barres remplies avec effet glow, valeurs numériques alignées à droite.

### 4. Statut des signalements
DonutChart SVG : 3 statuts (En attente, Approuvé, Collecté).  
Segments proportionnels, centre transparent avec total, légende avec dot coloré + compteur.

### 5. Tendance mensuelle
TrendChart SVG : 12 mois, barres avec dégradé, moyenne mensuelle, badge de variation (+12%).

### 6. Signalements récents
TimelineList : 8 entrées, points de statut colorés, ligne de connexion, badges.

### Pull-to-refresh
Le dashboard utilise `ScrollView.refreshControl` avec animation de rechargement (2s simulée).

---

## 🧑‍💼 Gestion des Conducteurs (CRUD complet)

### Entité Conducteur

```typescript
interface Conducteur {
  id: string;
  nom: string; prenom: string; email: string; telephone: string;
  adresse: string; dateNaissance: string; permis: string;
  categoriePermis: 'B' | 'C' | 'D' | 'EB' | 'EC';
  dateEmbauche: string; zone: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  vehiculeMarque: string; vehiculeModele: string;
  vehiculeImmatriculation: string; vehiculeType: string;
  // Stats calculées
  totalCollectes: number; signalementsTraités: number;
  evaluation: number; totalPoints: number;
}
```

### `ConducteurMockDatasource`

Méthodes exposées :

| Méthode | Signature | Description |
|---|---|---|
| `getAll` | `() => Promise<Conducteur[]>` | Retourne les 10 conducteurs mock |
| `getById` | `(id: string) => Promise<Conducteur \| undefined>` | Un conducteur par ID |
| `create` | `(data: Omit<Conducteur, 'id' \| 'totalCollectes' \| ...>) => Promise<Conducteur>` | Crée avec ID auto-généré |
| `update` | `(id: string, data: Partial<Conducteur>) => Promise<Conducteur>` | Met à jour partiellement |
| `delete` | `(id: string) => Promise<void>` | Supprime un conducteur |
| `getStats` | `() => Promise<{ total, actifs, traites, evaluationMoyenne }>` | Stats agrégées |

Temps de réponse simulé : **300-400ms** pour imiter un backend réel.

### Écrans

#### Liste (`app/admin/conducteurs/index.tsx`)
- **Header** : hamburger + titre + bouton d'ajout
- **Stats row** : 3 indicateurs (Total, Actifs, Traités) dans des capsules
- **Search bar** : champ de recherche avec icône, filtre sur nom/prénom/email/zone
- **Cards conducteurs** : avatar initiale, nom, zone, statut (dot coloré + label), badge de complétion %, icône flèche
- **Pull-to-refresh** : rechargement avec indicateur natif
- **Empty state** : icône + message + CTA quand aucun résultat

#### Création (`app/admin/conducteurs/creer.tsx`)
- Formulaire complet en 4 sections (Identité, Permis, Véhicule, Affectation)
- Champs : Nom, Prénom, Email, Téléphone, Adresse, Date naissance, Permis, Catégorie (picker chips), Marque, Modèle, Immatriculation, Type véhicule, Zone (picker chips), Statut (picker chips), Date embauche
- Validation champs requis (nom, prénom, email, téléphone)
- Alert success + retour arrière automatique
- Indicateur de chargement pendant la sauvegarde

#### Détail (`app/admin/conducteurs/[id]/index.tsx`)
- **Profile card** : avatar large (initiale), nom, zone, statut badge, évaluation (étoiles)
- **Quick stats** : 3 cartes horizontales (Collectes, Traités, Points)
- **Personal info** : email, téléphone, adresse, date naissance
- **Vehicle info** : marque, modèle, immatriculation, type
- **Activity section** : 2 lignes (date d'embauche, permis)
- **Actions** : bouton Modifier (→ `/admin/conducteurs/[id]/editer`) + bouton Supprimer avec confirmation Alert
- **Error state** : si conducteur introuvable, message d'erreur avec bouton retour

#### Édition (`app/admin/conducteurs/[id]/editer.tsx`)
- Chargement des données existantes par ID
- Mêmes champs que le formulaire de création
- Sauvegarde avec indicateur de chargement
- Alert success + retour arrière

---

## 🔐 Authentification

Le système d'authentification admin est géré par `AdminContext` :

```tsx
// Contexte exposé via useAdmin()
const { isAuthenticated, admin, login, logout } = useAdmin();

// Connexion (vérification hardcodée admin@gmail.com / root)
const result = await login(email, password);
// result.success → true/false
// result.error → message d'erreur si échec

// Déconnexion
logout();
```

### Flux d'authentification

1. L'utilisateur visite `/admin` ou `/admin/login`
2. `app/admin/_layout.tsx` vérifie `isAuthenticated`
3. Si non authentifié → `<Redirect href="/admin/login" />` (déclaratif, pas de `useEffect` + `router.replace` → évite les boucles infinies)
4. Si authentifié → affiche le `Stack` avec le dashboard + overlay sidebar
5. La connexion depuis le login principal (`LoginScreen.tsx`) détecte les identifiants admin (comparaison string `admin@gmail.com` / `root`) et appelle `admin.login()` puis redirige vers `/admin`
6. L'admin peut aussi se connecter directement via `/admin/login` (écran dark dédié)

### Intégration dans le login principal (`app/login.tsx` → `LoginScreen.tsx`)

```typescript
// LoginScreen.tsx — extrait clé
const admin = useAdmin();

const handleLogin = async () => {
  if (email === 'admin@gmail.com' && password === 'root') {
    await admin.login(email, password);
    router.replace('/admin');
    return;
  }
  // Connexion utilisateur normale → /(tabs)
};
```

---

## 🔄 SidebarContext

Contexte d'état du tiroir de navigation :

```tsx
// Exposé via useSidebar()
const { visible, toggle, close } = useSidebar();
```

- `visible: boolean` — état d'ouverture/fermeture
- `toggle()` — bascule l'état
- `close()` — ferme le tiroir

Wrappé dans `app/_layout.tsx` via `<SidebarProvider>` pour être accessible depuis tout le back-office.

---

## 📊 AdminMockDatasource — Données mock

### Dashboard

| Métrique | Valeur |
|---|---|
| Signalements totaux | 584 |
| Utilisateurs actifs | 342 |
| Points émis (k) | 128.45 |
| CO₂ sauvé (kg) | 4 280 |
| Catégories | 6 (Plastique, Verre, Organique, Électronique, Dangereux, Autre) |
| Statuts | 3 (En attente, Approuvé, Collecté) |
| Mois de tendance | 12 |
| Signalements récents | 8 |
| Temps de réponse simulé | 300ms |

### Conducteurs

| Métrique | Valeur |
|---|---|
| Conducteurs mock | 10 |
| Zones | 8 (Dakar Nord/Sud/Centre/Ouest/Est, Pikine, Guediawaye, Thiaroye) |
| Statuts | actif, inactif, suspendu |
| Temps de réponse simulé | 300-400ms |

### Breakdown stats (StatDetailModal)

Chaque `StatDetailModal` contient un tableau d'utilisateurs/conducteurs avec :
- `name` : nom de l'utilisateur
- `value` : contribution/valeur numérique
- `icon` : icône Ionicons de catégorie
- `date` : date formatée
- `status` : statut avec couleur associée

Ces données sont mockées dans `AdminMockDatasource.getStatsBreakdown()`.

---

## 🎨 Thème

Le back-office utilise une palette dark moderne, différente du thème principal de l'application :

| Rôle | Couleur | Usage |
|---|---|---|
| Fond principal | `#0A0F1E` | Arrière-plan principal |
| Surface | `#131A2E` | Cartes et conteneurs |
| Surface claire | `#1A2340` | Barres de progression, fonds secondaires |
| Surface secondaire | `#0F172A` | Inputs, backgrounds de chips |
| Bordure | `#1E2A4A` | Bordures de cartes et séparateurs |
| Texte principal | `#F1F5F9` | Titres et valeurs |
| Texte secondaire | `#94A3B8` | Libellés d'options, métadonnées |
| Texte tertiaire | `#6B7AA8` | Libellés, sous-titres |
| Accent vert | `#10B981` | Élément principal (badges, charts, boutons) |
| Accent bleu | `#3B82F6` | Signalements, statut approuvé |
| Accent ambre | `#F59E0B` | Points, statut en attente |
| Accent violet | `#8B5CF6` | CO₂ sauvé |
| Accent rouge | `#EF4444` | Déchets dangereux, déconnexion |
| Surface bouton | `#1E293B` | Boutons secondaires, fond de menu |

---

## 📱 Technologies utilisées

| Technologie | Version | Rôle |
|---|---|---|
| React Native | ~0.81.5 | Framework mobile |
| Expo SDK | ~54 | Plateforme de développement |
| Expo Router | ~4.x | Navigation fichier-based |
| TypeScript | strict | Langage |
| react-native-reanimated | ^4 | Animations fluides (sidebar, modaux) |
| react-native-svg | 15.12.1 | Graphiques vectoriels (donut, barres, tendances) |
| expo-linear-gradient | — | Dégradés du header premium |
| react-native-safe-area-context | — | Gestion des safe areas |
| @expo/vector-icons | — | Ioniconcs (iconographie) |

---

## 🏗️ Architecture et flux de navigation

```
App Root (_layout.tsx)
├── SafeAreaProvider
│   ├── UserProvider (avatar partagé)
│   ├── AdminProvider (auth admin)
│   ├── SidebarProvider (état sidebar)
│   └── Stack Navigator
│       ├── Splash → Onboarding → Login/SignUp
│       ├── (tabs) → Application principale
│       └── /admin/**
│           ├── _layout.tsx (guard auth + sidebar overlay)
│           ├── login.tsx
│           ├── index.tsx (dashboard)
│           ├── conducteurs/
│           ├── signalements/
│           ├── utilisateurs/
│           ├── recompenses/
│           └── parametres/
```

---

## 🔌 Intégration future (Backend réel)

### Dashboard — API Endpoints

```
AdminMockDatasource.ts          → API Backend
──────────────────────────────────────────────────
getStats()                      → GET /api/admin/stats
getStatsBreakdown()             → GET /api/admin/stats/breakdown?metric=<name>
```

Types d'API :

```typescript
// GET /api/admin/stats
interface AdminStatsResponse {
  totalReports: number;
  activeUsers: number;
  totalPointsIssued: number;
  totalCo2Saved: number;
  reportsByCategory: { category: string; count: number; color: string }[];
  reportsByStatus: { status: string; count: number; color: string }[];
  monthlyReports: { month: string; count: number }[];
  recentReports: {
    id: string; user: string; category: string;
    status: string; date: string; location: string;
  }[];
}

// GET /api/admin/stats/breakdown?metric=reports
interface StatsBreakdownResponse {
  metric: string;
  label: string;
  items: {
    name: string; value: number; icon: string;
    date: string; status: { label: string; color: string };
  }[];
}
```

### Conducteurs — API Endpoints

```
ConducteurMockDatasource.ts     → API Backend
──────────────────────────────────────────────────
getAll()                        → GET /api/admin/conducteurs
getById(id)                     → GET /api/admin/conducteurs/:id
create(data)                    → POST /api/admin/conducteurs
update(id, data)                → PUT /api/admin/conducteurs/:id
delete(id)                      → DELETE /api/admin/conducteurs/:id
getStats()                      → GET /api/admin/conducteurs/stats
```

---

## 🧪 Tests et qualité

```bash
# Vérification TypeScript
npx tsc --noEmit

# Lancement du projet
npx expo start -c
```

Le code est validé avec `TypeScript strict` — 0 erreurs.

---

## 🏗️ Évolution possible

- [ ] **Écrans Signalements** : liste avec filtres (date, catégorie, statut, zone), vue détail avec photo et localisation sur carte, actions (assigner à conducteur, changer statut)
- [ ] **Écrans Utilisateurs** : liste paginée, profil détaillé (stats individuelles, historique des signalements, récompenses gagnées), bannissement
- [ ] **Écrans Récompenses** : catalogue avec création/édition, statistiques de redemption, validation manuelle
- [ ] **Paramètres** : configuration générale (zones, catégories), gestion des administrateurs, préférences de notification
- [ ] **Filtres temporels** : 7 jours, 30 jours, année personnalisée
- [ ] **Export PDF/CSV** des données du dashboard
- [ ] **Carte thermique** des signalements (intégration MapView)
- [ ] **Notifications push** pour nouveaux signalements
- [ ] **Multi-administrateurs** avec rôles et permissions
- [ ] **Graphes interactifs** (zoom, sélection de période)
- [ ] **Mode paysage** optimisé pour tablette
- [ ] **Assignation de tournées** : lier des conducteurs à des routes de collecte
- [ ] **Mode hors-ligne** : cache local des données avec synchronisation

---

## 📝 Notes de développement

- Le `tsc --noEmit` doit toujours passer avant commit
- Les imports suivent le pattern `../../../src/...` depuis `app/`
- Le `SidebarContext` est wrappé dans `app/_layout.tsx` au niveau racine, pas dans `app/admin/_layout.tsx`, pour permettre une éventuelle utilisation hors admin
- Les données mock utilisent des `setTimeout` pour simuler la latence réseau
- Chaque composant chart est autonome (pas de dépendance vers le contexte ou les datasources)

---

*Document créé le 09/07/2026 — Couvre dashboard, sidebar, conducteurs CRUD, authentification, placeholders*
