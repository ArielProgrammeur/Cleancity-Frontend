# CleanCity — Back Office (Admin Dashboard)

Interface d'administration mobile pour la gestion et le pilotage de l'application CleanCity. Dashboard moderne, dark theme, inspiré de Power BI mobile, avec visualisations SVG en temps réel.

---

## 🚀 Accès

| Champ | Valeur |
|---|---|
| URL | `/admin` ou `/admin/login` |
| Email | `admin@gmail.com` |
| Mot de passe | `root` |

> La connexion admin se fait **depuis l'écran de login principal** de l'application.  
> Si les identifiants `admin@gmail.com` / `root` sont saisis, l'utilisateur est redirigé vers le back-office au lieu de l'application classique.  
> Sinon, le comportement normal (connexion utilisateur → `/(tabs)`) est conservé.

---

## 📁 Structure des fichiers

```
app/admin/
├── _layout.tsx          # Layout Stack + guard d'authentification
├── login.tsx            # Écran de connexion admin (thème dark)
└── index.tsx            # Dashboard principal (compose tous les composants)

src/
├── core/contexts/
│   └── AdminContext.tsx # Contexte d'authentification admin (login/logout/state)
│
├── data/datasources/
│   └── AdminMockDatasource.ts  # Données mock agrégées (stats, rapports, tendances)
│
└── presentation/admin/components/
    ├── AnimatedCounter.tsx  # Compteur avec animation de défilement numérique
    ├── StatCard.tsx         # Carte de statistique vitrée avec barre lumineuse
    ├── ChartCard.tsx        # Conteneur de graphique avec badge Live
    ├── BarChart.tsx         # Diagramme à barres horizontal avec glow
    ├── DonutChart.tsx       # Diagramme donut SVG avec segments creux
    ├── TrendChart.tsx       # Barres d'évolution mensuelle avec dégradé
    └── TimelineList.tsx     # Liste chronologique des signalements récents
```

---

## 🧩 Composants

### `AnimatedCounter`
Compteur qui s'anime de 0 à la valeur cible avec un effet de défilement numérique.

| Prop | Type | Défaut |
|---|---|---|
| `value` | `number` | requis |
| `suffix` | `string` | `''` |
| `delay` | `number` | `0` |
| `duration` | `number` | `1000` |
| `precision` | `number` | `0` |

---

### `StatCard`
Carte vitrée affichant une métrique clé avec icône, compteur animé et barre lumineuse.

| Prop | Type | Description |
|---|---|---|
| `icon` | `string` | Nom Ionicons |
| `label` | `string` | Libellé (ex: "Signalements") |
| `value` | `number` | Valeur numérique |
| `color` | `string` | Couleur d'accent (hex) |
| `suffix` | `string` | Suffixe optionnel ("kg", "k") |
| `index` | `number` | Index pour délai d'animation |

---

### `ChartCard`
Conteneur générique pour section de graphique avec titre, sous-titre et badge Live.

| Prop | Type | Défaut |
|---|---|---|
| `title` | `string` | requis |
| `subtitle` | `string` | `undefined` |
| `icon` | `string` | requis |
| `accentColor` | `string` | `#10B981` |

---

### `BarChart`
Barres horizontales avec libellés, valeurs et effet de glow.

| Prop | Type |
|---|---|
| `data` | `{ category, count, color }[]` |

---

### `DonutChart`
Graphique donut SVG avec centre transparent affichant le total. Segments générés par arcs SVG.

| Prop | Type | Défaut |
|---|---|---|
| `data` | `{ status, count, color }[]` | requis |
| `size` | `number` | `160` |

---

### `TrendChart`
Barres verticales pour évolution mensuelle, avec dégradé de couleur.

| Prop | Type |
|---|---|
| `data` | `{ month, count }[]` |

---

### `TimelineList`
Liste verticale avec points de timeline, badges de statut et informations.

| Prop | Type |
|---|---|
| `reports` | `AdminReport[]` |

---

## 📊 Dashboard

Le dashboard est composé de 5 sections :

### 1. Header
- Avatar avec icône bouclier
- Nom de l'administrateur
- Horloge en temps réel (mise à jour toutes les 30s)
- Point vert pulsant (animation `RNAnimated.loop`)
- Bouton de déconnexion

### 2. 4 StatCards (grille 2×2)
- **Signalements** (bleu `#3B82F6`)
- **Utilisateurs** (vert `#10B981`)
- **Points émis** (ambre `#F59E0B`, suffixe `k`)
- **CO₂ sauvé** (violet `#8B5CF6`, suffixe `kg`)

Chaque carte contient :
- Icône dans un anneau avec glow
- Point de statut
- Compteur avec animation de défilement
- Barre lumineuse en bas

### 3. Signalements par catégorie
Barres horizontales avec :
- 6 catégories (Plastique, Verre, Organique, Électronique, Dangereux, Autre)
- Barre de remplissage + effet glow superposé
- Valeur numérique alignée à droite
- Animations cascadées `FadeInRight`

### 4. Statut des signalements
Donut chart SVG + légende :
- 3 statuts (En attente, Approuvé, Collecté)
- Segments calculés avec arcs SVG
- Centre transparent affichant le total
- Légende avec dot coloré et compteur

### 5. Tendance mensuelle
Barres verticales SVG avec :
- 12 mois de données
- Dégradé de couleur (`#10B981` → `#34D399`)
- Pied de carte avec moyenne mensuelle et badge de variation (+12%)

### 6. Signalements récents
Timeline verticale avec :
- Points de statut colorés sur la gauche
- Ligne de connexion entre les points
- Badge de statut (En attente/Approuvé/Collecté)
- Catégorie et localisation
- Date formatée

---

## 🔐 Authentification

Le système d'authentification admin est géré par `AdminContext` :

```tsx
// Contexte exposé
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
3. Si non authentifié → `<Redirect href="/admin/login" />`
4. Si authentifié → affiche le `Stack` avec le dashboard
5. La connexion depuis le login principal détecte les identifiants admin et redirige vers `/admin`

---

## 🔌 Intégration future (Backend réel)

Les données mock actuelles (`AdminMockDatasource.ts`) sont conçues pour être remplacées par des appels API REST :

```
AdminMockDatasource.ts          → API Backend
──────────────────────────────────────────────────
getStats()                      → GET /api/admin/stats
Données :                       Réponse :
  totalReports                    { totalReports, activeUsers, ... }
  reportsByCategory               { reportsByCategory: [...] }
  reportsByStatus                 { reportsByStatus: [...] }
  monthlyReports                  { monthlyReports: [...] }
  recentReports                   { recentReports: [...] }
```

### Types d'API à exposer

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
```

---

## 🎨 Thème

Le dashboard utilise une palette dark moderne, différente du thème principal de l'application :

| Rôle | Couleur | Usage |
|---|---|---|
| Fond | `#0A0F1E` | Arrière-plan principal |
| Surface | `#131A2E` | Cartes et conteneurs |
| Surface claire | `#1A2340` | Barres de progression, fonds secondaires |
| Bordure | `#1E2A4A` | Bordures de cartes et séparateurs |
| Texte principal | `#F1F5F9` | Titres et valeurs |
| Texte secondaire | `#6B7AA8` | Libellés et métadonnées |
| Accent vert | `#10B981` | Élément principal (badges, charts) |
| Accent bleu | `#3B82F6` | Signalements, statut approuvé |
| Accent ambre | `#F59E0B` | Points, statut en attente |
| Accent violet | `#8B5CF6` | CO₂ sauvé |
| Accent rouge | `#EF4444` | Déchets dangereux |

---

## 📱 Technologies utilisées

- **React Native** (Expo SDK 54)
- **Expo Router** (v6, file-based routing)
- **react-native-reanimated** (v4, animations fluides)
- **react-native-svg** (graphiques vectoriels)
- **react-native-safe-area-context** (gestion des safe areas)
- **@expo/vector-icons / Ionicons** (iconographie)

---

## 🧪 Données mock

Le fichier `AdminMockDatasource.ts` contient des données de démonstration :

- **584 signalements**, **342 utilisateurs actifs**
- **128 450 points émis**, **4 280 kg CO₂ sauvé**
- **6 catégories** de déchets, **3 statuts** de traitement
- **12 mois** de tendance, **8 signalements récents**
- Temps de réponse simulé de **300ms**

---

## 🏗️ Évolution possible

- [ ] **Filtres temporels** (7 jours, 30 jours, année personnalisée)
- [ ] **Export PDF/CSV** des données
- [ ] **Carte thermique** des signalements (intégration MapView)
- [ ] **Notifications push** pour nouveaux signalements
- [ ] **Gestion des utilisateurs** (liste, bannissement)
- [ ] **Gestion des récompenses** (catalogue, création)
- [ ] **Multi-administrateurs** avec rôles et permissions
- [ ] **Graphes interactifs** (zoom, sélection de période)
- [ ] **Mode paysage** optimisé pour tablette
