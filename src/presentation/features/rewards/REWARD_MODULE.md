# Module Reward — Documentation Complète

## Architecture

Le module suit une **Clean Architecture** en 3 couches :

```
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                        │
│  screens/RewardsScreen.tsx                                  │
│  components/ (RewardHero, RewardCard, ...)                   │
│  hooks/useRewards.ts                                        │
├─────────────────────────────────────────────────────────────┤
│                      DATA LAYER                             │
│  repositories/RewardRepositoryImpl.ts                       │
│  datasources/RewardMockDatasource.ts                        │
│  datasources/IRewardRemoteDatasource.ts                     │
├─────────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                           │
│  entities/Reward.ts                                         │
│  repositories/IRewardRepository.ts                          │
└─────────────────────────────────────────────────────────────┘
```

**Règles :**
- La **Presentation** ne connaît que le **Domain** (via l'interface `IRewardRepository`)
- La **Data** implémente les contrats du **Domain**
- Le **Domain** n'a aucune dépendance vers les autres couches

---

## Structure des fichiers

```
src/
├── domain/
│   ├── entities/
│   │   └── Reward.ts                    ← Entité métier
│   └── repositories/
│       └── IRewardRepository.ts          ← Interface du repository
├── data/
│   ├── datasources/
│   │   ├── IRewardRemoteDatasource.ts    ← Interface de la source de données
│   │   └── RewardMockDatasource.ts       ← Données mockées (17 rewards)
│   └── repositories/
│       └── RewardRepositoryImpl.ts       ← Implémentation du repository
└── presentation/features/rewards/
    ├── index.ts                          ← Barrel exports
    ├── hooks/
    │   └── useRewards.ts                ← Hook principal (état + actions)
    ├── components/
    │   ├── RewardHero.tsx               ← Carte héros animée
    │   ├── RewardCard.tsx               ← Carte récompense
    │   ├── CategoryFilter.tsx           ← Filtres par catégorie
    │   ├── SearchBar.tsx                ← Barre de recherche
    │   ├── SuccessAnimation.tsx         ← Animation de succès
    │   └── HistorySheet.tsx             ← Historique des réclamations
    ├── screens/
    │   └── RewardsScreen.tsx            ← Écran principal
    └── REWARD_MODULE.md                 ← Ce fichier
```

---

## 1. Domaine — `src/domain/`

### `entities/Reward.ts`

Définit le type `Reward` et les types associés.

```typescript
export type RewardCategory = 'eco' | 'premium' | 'limited' | 'donation' | 'experience';
export type RewardTier = 'bronze' | 'silver' | 'gold' | 'platinum';
```

**`Reward`** — Entité principale représentant une récompense.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | `string` | Identifiant unique |
| `name` | `string` | Nom de la récompense |
| `description` | `string` | Description détaillée |
| `pointsCost` | `number` | Coût en points |
| `discountPrice?` | `number` | Prix promo (si en solde) |
| `icon` | `string` | Nom de l'icône Ionicons |
| `color` | `string` | Couleur hex de l'icône |
| `bgColor` | `string` | Couleur hex du fond d'icône |
| `category` | `RewardCategory` | Catégorie |
| `stock` | `number` | Stock restant |
| `totalStock` | `number` | Stock initial |
| `isLimited` | `boolean` | Édition limitée ? |
| `expiresAt?` | `string` | Date d'expiration ISO |
| `partnerName?` | `string` | Partenaire |
| `terms?` | `string` | Conditions |

---

### `repositories/IRewardRepository.ts`

Contrat que toute implémentation de repository doit respecter.

**`ClaimedReward`** — Récompense réclamée.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | `string` | ID unique de la transaction |
| `rewardId` | `string` | ID de la récompense originale |
| `rewardName` | `string` | Nom (copié pour l'historique) |
| `rewardIcon` | `string` | Icône Ionicons |
| `rewardColor` | `string` | Couleur hex |
| `rewardBgColor` | `string` | Couleur de fond hex |
| `pointsSpent` | `number` | Points dépensés |
| `claimedAt` | `string` | Date ISO de la réclamation |
| `voucherCode` | `string` | Code voucher unique |
| `status` | `'pending' \| 'fulfilled' \| 'cancelled'` | Statut de la réclamation |

**`UserRewardData`** — Données utilisateur liées aux rewards.

| Champ | Type | Description |
|-------|------|-------------|
| `totalPoints` | `number` | Points actuels |
| `lifetimePoints` | `number` | Points gagnés cumulés |
| `totalClaimed` | `number` | Nombre total de réclamations |
| `currentTier` | `'bronze' \| 'silver' \| 'gold' \| 'platinum'` | Palier actuel |
| `tierProgress` | `number` | Points accumulés dans ce palier |
| `nextTierPoints` | `number` | Points requis pour le palier suivant |

**`IRewardRepository`** — Interface avec 7 méthodes :

| Méthode | Retour | Description |
|---------|--------|-------------|
| `getAll()` | `Promise<Result<Reward[]>>` | Récupère toutes les récompenses |
| `getById(id)` | `Promise<Result<Reward>>` | Récupère une récompense par ID |
| `getCategories()` | `Promise<Result<RewardCategory[]>>` | Liste des catégories |
| `search(query)` | `Promise<Result<Reward[]>>` | Recherche textuelle |
| `claimReward(userId, rewardId)` | `Promise<Result<ClaimedReward>>` | Réclame une récompense |
| `getHistory(userId)` | `Promise<Result<ClaimedReward[]>>` | Historique des réclamations |
| `getUserData(userId)` | `Promise<Result<UserRewardData>>` | Données utilisateur |

Toutes les méthodes retournent `Result<T>` (monade : `Success<T>` ou `Failure`) pour une gestion propre des erreurs.

---

## 2. Data — `src/data/`

### `datasources/IRewardRemoteDatasource.ts`

Interface de la source de données distante. Même signature que `IRewardRepository` mais :
- Ne retourne **pas** `Result<T>` (lancera des erreurs en cas d'échec)
- Utilise des noms différents (`fetchAll` au lieu de `getAll`)

```typescript
export interface IRewardRemoteDatasource {
  fetchAll(): Promise<Reward[]>;
  fetchById(id: string): Promise<Reward>;
  fetchCategories(): Promise<RewardCategory[]>;
  searchRewards(query: string): Promise<Reward[]>;
  claimReward(userId: string, rewardId: string): Promise<ClaimedReward>;
  fetchHistory(userId: string): Promise<ClaimedReward[]>;
  fetchUserData(userId: string): Promise<UserRewardData>;
}
```

### `datasources/RewardMockDatasource.ts`

Implémentation mockée de `IRewardRemoteDatasource`. Contient :

- **17 récompenses** réparties en 5 catégories :
  - `eco` : Eco Tote Bag (500pts), Bamboo Toothbrush Set (300pts), Seed Starter Kit (400pts, -12%), Beeswax Food Wraps (600pts), Compost Bin (1000pts)
  - `premium` : Reusable Water Bottle (800pts, -19%), Eco Cleaning Kit (1500pts), Solar Power Bank (2000pts)
  - `limited` : Smart Waste Sensor (2500pts), Signed Eco Book (1800pts), VIP Recycling Tour (3000pts), Exclusive Workshop Pass (2200pts) — toutes avec `expiresAt`
  - `donation` : Plant a Tree (1200pts), School Garden Donation (2500pts), Ocean Cleanup Contribution (3000pts)
  - `experience` : Zero-Waste Cooking Class (1500pts), Guided Nature Hike (1000pts)
- **Historique mocké** : 3 réclamations passées
- **Données utilisateur** : 2450pts, palier Silver

**Méthodes :**

| Méthode | Comportement |
|---------|--------------|
| `fetchAll()` | Retourne une copie de `MOCK_REWARDS` après 200-350ms de délai simulé |
| `fetchById(id)` | Trouve par ID, erreur si introuvable |
| `fetchCategories()` | Retourne les 5 catégories |
| `searchRewards(query)` | Filtre par `name`, `description` ou `partnerName` en insensible à la casse |
| `claimReward(userId, rewardId)` | Décrémente le stock, génère un voucher code, retourne une `ClaimedReward` |
| `fetchHistory(userId)` | Retourne `MOCK_HISTORY` |
| `fetchUserData(userId)` | Retourne `MOCK_USER_DATA` |

**`makeVoucherCode()`** — Fonction utilitaire qui génère un code formaté `RWD-XXXX-XXXX-XXXX` (lettres majuscules + chiffres).

### `repositories/RewardRepositoryImpl.ts`

Pont entre la datasource et le domaine. Implémente `IRewardRepository` en :
1. Appelant la datasource
2. Attrapant les erreurs
3. Emballant le résultat dans `Result<T>` (`success()` ou `failure()`)

```typescript
export class RewardRepositoryImpl implements IRewardRepository {
  constructor(private datasource: IRewardRemoteDatasource) {}
  // Chaque méthode suit le pattern :
  //   try { return success(await datasource.method()) }
  //   catch { return failure(new ServerFailure(message)) }
}
```

---

## 3. Présentation — `src/presentation/features/rewards/`

### `hooks/useRewards.ts`

Le cœur de la logique métier côté UI. C'est un hook React qui gère tout l'état et toutes les actions.

**Types exportés :**

```typescript
type SortOption = 'popular' | 'low-high' | 'high-low';

interface UseRewardsReturn { /* 23 propriétés — voir ci-dessous */ }
```

**Constantes et helpers :**

| Symbole | Description |
|---------|-------------|
| `CATEGORY_LABELS` | Mapping `RewardCategory` → label lisible |
| `CATEGORY_ICONS` | Mapping `RewardCategory` → icône Ionicons |
| `REWARD_CATEGORIES` | `['all', 'eco', 'premium', 'limited', 'donation', 'experience']` — ordre d'affichage |
| `getCategoryLabel(cat)` | Retourne le label affichable d'une catégorie |
| `getCategoryIcon(cat)` | Retourne le nom d'icône Ionicons d'une catégorie |

**Fonction principale : `useRewards(repository, userId)`**

Paramètres :
- `repository: IRewardRepository` — l'implémentation à utiliser
- `userId: string` (défaut `'user_1'`)

Retourne `UseRewardsReturn` avec 23 propriétés :

| Propriété | Type | Description |
|-----------|------|-------------|
| `rewards` | `Reward[]` | Récompenses filtrées + triées |
| `categories` | `RewardCategory[]` | Catégories disponibles |
| `history` | `ClaimedReward[]` | Historique des réclamations |
| `userData` | `UserRewardData \| null` | Données utilisateur |
| `isLoading` | `boolean` | Chargement initial |
| `isRefreshing` | `boolean` | Pull-to-refresh actif |
| `error` | `string \| null` | Message d'erreur |
| `activeCategory` | `RewardCategory \| 'all'` | Catégorie sélectionnée |
| `searchQuery` | `string` | Texte de recherche (valeur immédiate) |
| `sortBy` | `SortOption` | Tri actif |
| `claimedIds` | `Set<string>` | IDs des rewards déjà réclamés |
| `wishlistIds` | `Set<string>` | IDs des rewards en favoris |
| `filteredCount` | `number` | Nombre de résultats filtrés |
| `lastClaimed` | `ClaimedReward \| null` | Dernière réclamation (pour la modale succès) |
| `showSuccess` | `boolean` | Afficher la modale de succès |
| `refresh` | `() => void` | Déclencher un rafraîchissement |
| `claimReward` | `(Reward) => Promise<boolean>` | Réclamer une récompense |
| `dismissSuccess` | `() => void` | Fermer la modale de succès |
| `toggleWishlist` | `(rewardId) => void` | Ajouter/retirer des favoris |
| `setCategory` | `(category) => void` | Changer le filtre catégorie |
| `setSearch` | `(query) => void` | Mettre à jour la recherche |
| `setSort` | `(sort) => void` | Changer le tri |

**Flux interne :**

```
1. loadData() est appelé au montage
   ├── Promise.all(rewards, categories, history, userData)
   ├── Met à jour allRewards (brut), categories, history, userData
   └── Calcule claimedIds depuis l'historique

2. Search → rawSearch → debounce 300ms → searchQuery
   Active la mémoïsation de `rewards` (useMemo)

3. Filtre/Sort → useMemo sur [allRewards, activeCategory, searchQuery, sortBy]
   ├── Filtre par catégorie si activeCategory !== 'all'
   ├── Filtre par texte si searchQuery.trim()
   └── Trie selon sortBy

4. claimReward(reward)
   ├── Vérifie que reward non déjà réclamé
   ├── Appelle repository.claimReward()
   ├── Succès : ajoute à claimedIds, update userData, setShowSuccess(true)
   └── Échec : retourne false, l'UI affiche une erreur

5. refresh() → loadData(true) → isRefreshing = true
```

---

## 4. Composants

### `RewardHero.tsx`

**Rôle :** Carte héros animée affichant les points, le palier et les stats.

**Props :**
- `userData: UserRewardData | null`
- `claimedCount: number`

**Fonctions internes :**

**`PointsCounter({ value })`** — Composant interne qui affiche le nombre de points avec une animation de "bounce" (scale spring) à chaque changement de valeur.

**Sous-composants animés :**
- `circle1` + `circle2` : Deux orbes blanches décoratives qui pulsent lentement (opacity + scale animés avec `withRepeat` + `withTiming`)
- `progressFill` : Barre de progression XP animée avec `withSpring`
- `statsRow` : 3 statistiques (Redeemed, Earned, Claimed) avec entrée différée `FadeIn.delay(400)`
- `tierBadge` : Badge du palier actuel (Bronze/Silver/Gold/Platinum) avec couleur et icône correspondantes

**`TIER_CONFIG` :** Configuration des 4 paliers :
| Palier | Icône | Couleur | Points requis |
|--------|-------|---------|---------------|
| Bronze | `shield-outline` | `#CD7F32` | 0 |
| Silver | `shield-half-outline` | `#E8E8E8` | 1000 |
| Gold | `shield-checkmark` | `#FFD700` | 3000 |
| Platinum | `diamond` | `#E5E4E2` | 6000 |

---

### `RewardCard.tsx`

**Rôle :** Carte individuelle d'une récompense avec animations.

**Props :**
- `reward: Reward`
- `userPoints: number`
- `isWishlisted: boolean`
- `isClaimed: boolean`
- `onClaim: (Reward) => void`
- `onToggleWishlist: (rewardId) => void`
- `index: number` — pour le délai d'entrée animée

**Fonctions internes :**

- `handlePressIn()` → Scale spring à 0.97 (effet de pression)
- `handlePressOut()` → Scale spring retour à 1

**États visuels :**

| État | Comportement |
|------|--------------|
| ✅ `isClaimed` | Affiche une carte "Redeemed" verte avec checkmark |
| 💔 `canAfford === false` | Bouton grisé avec cadenas + texte "Need X more" |
| 🔴 `lowStock` (`stock ≤ 5`) | Barre de stock rouge + texte "Only X left" |
| 🏷️ `hasDiscount` | Badge rouge "-X%" + prix barré + prix promo |
| ❤️ `isWishlisted` | Cœur rouge (sinon gris) |

**Barre de stock :**
- Vert si `stock > 50%`
- Jaune si `stock 10-50%`
- Rouge si `stock ≤ 5`

**Animation :** Entrée avec `FadeInUp.delay(index * 80).springify()` — chaque carte apparaît avec un décalage basé sur son index.

---

### `CategoryFilter.tsx`

**Rôle :** Scroll horizontal de chips filtrants avec icônes.

**Props :**
- `activeCategory: RewardCategory | 'all'`
- `onCategoryChange: (category) => void`

**Fonctionnalités :**
- Les catégories sont définies dans `REWARD_CATEGORIES` (ordre : All, Eco, Premium, Limited, Donation, Experience)
- Chaque chip a une icône Ionicons + un label (via `getCategoryIcon` / `getCategoryLabel`)
- La chip active a le fond vert `#2E7D32` et le texte blanc
- Scroll automatique vers la chip active via `scrollRef.current.scrollTo()`
- Les positions des chips sont capturées via `onLayout` pour le scroll automatique
- Animation d'entrée : `FadeIn.delay(idx * 50)` sur chaque chip

---

### `SearchBar.tsx`

**Rôle :** Barre de recherche iOS-like.

**Props :**
- `value: string` — valeur actuelle
- `onChange: (text) => void` — callback de changement
- `onClear?: () => void` — callback quand l'utilisateur vide la recherche

**Comportement :**
- Icône de recherche à gauche
- Placeholder "Search rewards..."
- Bouton "clear" (✕) avec animation FadeIn/FadeOut quand `value.length > 0`
- Style : fond blanc, bordure grise, border radius 16, ombre légère

---

### `SuccessAnimation.tsx`

**Rôle :** Animation pleine page après une réclamation réussie.

**Props :**
- `visible: boolean`
- `claimed: ClaimedReward | null`
- `onDismiss: () => void`

**Composants internes :**

**`Sparkle({ index, color })`** — Particule animée qui :
1. Apparaît avec un scale spring
2. Se déplace radialement (angle = `index / 8 * 2π`, distance = 60-100px)
3. Disparaît (opacity → 0, scale → 0)
Chromatisme arc-en-ciel : 6 couleurs différentes.

**`Checkmark()`** — Checkmark animé en 2 temps :
1. **Cercle** : scale spring de 0 à 1 (cercle vert avec icône checkmark blanche)
2. **Checkmark** : scale spring différé de 300ms (contient les Sparkles)

**Affichage :**
1. Overlay semi-transparent (fond noir 50%)
2. Carte blanche qui slide depuis le bas (`SlideInDown`)
3. Checkmark animé + Sparkles
4. Titre "Reward Redeemed!"
5. Icône + nom de la récompense
6. Points dépensés
7. **Carte voucher** avec code (style bordure dashed, fond vert clair)
8. Bouton "Done"

Le fond est cliquable pour fermer via `onPress` sur `TouchableOpacity`.

---

### `HistorySheet.tsx`

**Rôle :** Bottom sheet affichant l'historique des réclamations sous forme de timeline.

**Props :**
- `visible: boolean`
- `history: ClaimedReward[]`
- `onClose: () => void`

**Composants internes :**

**`HistoryItem({ item, isLast })`** — Une entrée de l'historique :
- **Timeline** : Point coloré + ligne verticale (sauf pour le dernier)
- **Icône** : Fond + icône de la récompense
- **Infos** : Nom, statut (badge), points (-X pts), date, code voucher

**Affichage :**
1. Overlay semi-transparent
2. Sheet qui slide depuis le bas (`SlideInDown`)
3. Poignée de drag (barre grise arrondie)
4. Header : "Redemption History" + sous-titre "X rewards claimed" + bouton close
5. `FlatList` des entrées avec timeline
6. **État vide** : Icône d'horloge + "No history yet" + "Your redeemed rewards will appear here"

**STATUS_CONFIG :** Configuration des 3 statuts :
| Statut | Icône | Couleur |
|--------|-------|---------|
| `pending` | `time-outline` | `#F59E0B` |
| `fulfilled` | `checkmark-circle` | `#059669` |
| `cancelled` | `close-circle` | `#DC2626` |

**`formatDate(iso)`** — Formate une date ISO en "Mon DD, YYYY" (ex: "Jun 15, 2026").

---

## 5. Écran principal — `RewardsScreen.tsx`

**Rôle :** Point d'entrée du module. Orchestre tous les composants.

**Flux de rendu :**

```
RewardsScreen()
├── state local : showHistory (boolean)
├── Instancie le datasource + repository (singletons)
├── Appelle useRewards(repository)
│
├── ⏳ isLoading = true → Affiche 4 SkeletonCards
│
├── ❌ error != null → Affiche écran d'erreur avec bouton "Try Again"
│
└── ✅ Données chargées →
    ├── TopBar (titre + boutons sort/history)
    ├── FlatList
    │   ├── ListHeaderComponent
    │   │   ├── RewardHero
    │   │   ├── SearchBar
    │   │   ├── CategoryFilter
    │   │   └── SectionHeader (titre + count)
    │   ├── Pour chaque reward → RewardCard
    │   └── ListEmptyComponent (si aucun résultat)
    ├── SuccessAnimation (overlay)
    └── HistorySheet (overlay)
```

**Fonctions :**

| Fonction | Description |
|----------|-------------|
| `handleClaim(reward)` | Affiche une `Alert.alert` de confirmation → appelle `claimReward()` → si échec affiche une erreur |
| `handleSortPress()` | Affiche un `Alert.alert` avec les 3 options de tri (Popular, Low-High, High-Low) + checkmark sur l'option active |
| `renderHeader()` | Memoïsé via `useCallback` — rend le header du FlatList |
| `renderEmpty()` | État vide avec icône + texte contextuel (selon si recherche active ou non) |

**SkeletonCards** — 4 cartes factices avec :
- Placeholder icône (carré gris)
- Placeholder titre + sous-titre (lignes grises)
- Placeholder description (2 lignes)
- Placeholder badge + bouton

**Pull-to-refresh** : `RefreshControl` avec couleur `#2E7D32`.

---

## 6. Data Flow Complet

```
1. CHARGEMENT INITIAL
   
   RewardsScreen mount
       ↓
   useRewards(repository)
       ↓
   loadData() (useEffect)
       ↓
   repository.getAll() + getCategories() + getHistory() + getUserData()
       ↓ (Promise.all)
   RewardRepositoryImpl
       ↓ (appels datasource)
   RewardMockDatasource (délai 200-350ms)
       ↓
   Retour → Success ou Failure
       ↓
   isLoading = false
       ↓
   UI se rend avec les données

2. RECHERCHE

   Utilisateur tape dans SearchBar
       ↓
   setRawSearch(text) → rawSearch = "bottle"
       ↓ (debounce 300ms)
   setSearchQuery(rawSearch) → searchQuery = "bottle"
       ↓ (déclenche useMemo)
   rewards = allRewards.filter(...).sort(...)
       ↓
   FlatList se re-rend avec les résultats filtrés

3. FILTRE CATÉGORIE

   Utilisateur tape sur une chip
       ↓
   setActiveCategory('eco')
       ↓ (déclenche useMemo)
   rewards = allRewards.filter(r.category === 'eco').sort(...)
       ↓
   FlatList se re-rend

4. TRI

   Utilisateur tape sur le bouton sort → Alert
       ↓
   setSortBy('low-high')
       ↓ (déclenche useMemo)
   Rewards triés par points croissants
       ↓
   FlatList se re-rend

5. RÉCLAMATION (Claim)

   Utilisateur tape "Redeem"
       ↓
   handleClaim(reward) → Alert "Redeem X?"
       ↓ "Yes, redeem"
   claimReward(reward) dans le hook
       ↓
   repository.claimReward(userId, rewardId)
       ↓
   RewardMockDatasource.claimReward()
       ├── Vérifie stock > 0
       ├── stock -= 1
       ├── Génère voucherCode
       └── Retourne ClaimedReward
       ↓
   Succès :
       ├── setLastClaimed(claimed) → pour la modale
       ├── setClaimedIds(prev + reward.id)
       ├── setHistory([claimed, ...prev])
       ├── setUserData(prev - points, + totalClaimed)
       └── setShowSuccess(true) → modale apparaît
       ↓
   Échec : retourne false → RewardsScreen affiche Alert d'erreur
```

---

## 7. Types : Tableau récapitulatif

### Domain

```typescript
RewardCategory    = 'eco' | 'premium' | 'limited' | 'donation' | 'experience'
RewardTier        = 'bronze' | 'silver' | 'gold' | 'platinum'
Reward            = { id, name, description, pointsCost, discountPrice?, icon, color, bgColor, category, stock, totalStock, isLimited, expiresAt?, partnerName?, terms? }
```

### Repository

```typescript
ClaimedReward     = { id, rewardId, rewardName, rewardIcon, rewardColor, rewardBgColor, pointsSpent, claimedAt, voucherCode, status }
UserRewardData    = { totalPoints, lifetimePoints, totalClaimed, currentTier, tierProgress, nextTierPoints }
IRewardRepository = { getAll, getById, getCategories, search, claimReward, getHistory, getUserData }
```

### Presentation

```typescript
SortOption        = 'popular' | 'low-high' | 'high-low'
UseRewardsReturn  = { rewards, categories, history, userData, isLoading, isRefreshing, error, activeCategory, searchQuery, sortBy, claimedIds, wishlistIds, filteredCount, lastClaimed, showSuccess, refresh, claimReward, dismissSuccess, toggleWishlist, setCategory, setSearch, setSort }
RewardCardProps   = { reward, userPoints, isWishlisted, isClaimed, onClaim, onToggleWishlist, index }
RewardHeroProps   = { userData, claimedCount }
CategoryFilterProps = { activeCategory, onCategoryChange }
SearchBarProps    = { value, onChange, onClear? }
SuccessAnimationProps = { visible, claimed, onDismiss }
HistorySheetProps = { visible, history, onClose }
```

---

## 8. Palette de couleurs

| Usage | Couleur hex | Rôle |
|-------|-------------|------|
| Primaire | `#2E7D32` | Vert principal, boutons, chips actifs |
| Secondaire | `#1B5E20` | Fond hero card |
| Points | `#FF8F00` | Ambre/doré pour les points |
| Fond page | `#F8FAFB` | Gris très clair |
| Texte fort | `#111827` | Gris foncé |
| Texte doux | `#6B7280` | Gris moyen |
| Bordure | `#E5E7EB` | Gris clair |
| Discount | `#DC2626` | Rouge pour les promos |
| Succès | `#F0FDF4` | Vert clair pour "claimed" |
| Wishlist | `#DC2626` | Rouge pour le cœur |

---

## 9. Schéma du rendu final

```
┌──────────────────────────────────────┐
│  Rewards                     ⌗ ⏱    │  ← TopBar
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │ ✦ GOLD                        │  │
│  │                                │  │
│  │       2,450 pts                │  │
│  │  ████████████░░               │  │  ← RewardHero
│  │  550 pts to platinum          │  │
│  │                                │  │
│  │  8 Redeemed | 4,150 Earned | 3 │  │
│  └────────────────────────────────┘  │
│                                       │
│  🔍 Search rewards...                 │  ← SearchBar
│                                       │
│  [All] [🌱Eco] [💎Premium] [⏱Limited]│  ← CategoryFilter
│  [❤️Donation] [🧭Experience]          │
│                                       │
│  All Rewards • 17 items               │  ← SectionHeader
│                                       │
│  ┌────────────────────────────────┐  │
│  │ 💧  Reusable Bottle     ❤️    │  │
│  │     AquaSave                   │  │
│  │  Gourde isotherme 500ml...     │  │  ← RewardCard
│  │  ⚡ 800 pts      [🎁 Redeem]  │  │
│  │  ████████████░░░ 15/30        │  │
│  └────────────────────────────────┘  │
│                                       │
│  ┌────────────────────────────────┐  │
│  │ 🌱  Seed Starter Kit     🤍    │  │
│  │     GrowGreen                  │  │
│  │  Kit de 6 variétés...         │  │  ← RewardCard (soldé)
│  │  🔴 -12%                      │  │
│  │  ⚡ ~~400~~ 350 pts [🎁 Redeem]│  │
│  │  ████████████████ 30/40       │  │
│  └────────────────────────────────┘  │
│              ...                      │
│                                       │
│  ┌────────────────────────────────┐  │
│  │ 🛒  Smart Waste Sensor   ❤️    │  │
│  │  Capteur intelligent...       │  │
│  │  ⚡ 2500 pts   [🔒 Need 50]   │  │  ← RewardCard (indispo)
│  │  █████░░░ Only 5 left!        │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘

│  ┌─── SUCCESS OVERLAY ────────────┐  │
│  │       ✅ (animated)           │  │
│  │   Reward Redeemed!            │  │
│  │       🍃 Seed Starter Kit     │  │  ← SuccessAnimation
│  │    ⚡ -350 pts                 │  │
│  │  ┌─ VOUCHER ─────────────────┐│  │
│  │  │ RWD-7K9M-2P1X-8Q4Z       ││  │
│  │  └───────────────────────────┘│  │
│  │        [Done]                │  │
│  └──────────────────────────────┘  │

┌─── HISTORY SHEET ──────────────────┐
│ ═══ (handle)                       │
│ Redemption History          ✕     │
│ 3 rewards claimed                  │
│                                    │
│ ● 🍃 Seed Starter Kit  ✅Fulfilled│  ← HistorySheet
│ │   ⚡ -400 pts  Jun 15, 2026     │     (timeline)
│ │   🏷️ RWD-7K9M-2P1X-8Q4Z        │
│ ● 💧 Reusable Bottle  ⏱Pending   │
│ │   ⚡ -800 pts  Jun 10, 2026     │
│ │   🏷️ RWD-3B6N-9W2E-1R8T        │
│ ● 👜 Eco Tote Bag     ✅Fulfilled │
│     ⚡ -500 pts  May 28, 2026     │
│     🏷️ RWD-5H7J-4K2L-9M3N        │
└────────────────────────────────────┘
```
