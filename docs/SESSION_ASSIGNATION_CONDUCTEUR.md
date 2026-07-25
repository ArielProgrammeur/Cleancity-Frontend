# Session — Assignation conducteurs + Interface conducteur

## Ce qui a été fait

### 1. Entité Assignment + Datasource

**Fichiers créés :**
- `src/domain/entities/Assignment.ts` — Entité avec statuts typés (`assigned | en_route | collecting | completed | cancelled`), configuration couleurs/icônes par statut
- `src/data/datasources/AssignmentMockDatasource.ts` — CRUD complet :
  - `getAll()` / `getById()` / `getByConducteur()` / `getByReport()`
  - `assign(reportId, conducteurId, conducteurNom)` — crée une assignation
  - `updateStatus(id, status, notes?)` — change le statut
  - `getStats()` — stats globales
  - 8 assignations mock réparties sur 5 conducteurs et 6 signalements

### 2. Admin : Assigner un conducteur à un signalement

**Fichier modifié :** `app/admin/signalements/[id]/index.tsx`
- Import de `AssignmentMockDatasource`, `ConducteurMockDatasource`, `ASSIGNMENT_STATUS_CONFIG`
- Nouvelle section "Assignation conducteur" dans le détail du signalement :
  - **Pas d'assignation** → bouton "Assigner un conducteur" → `Alert.alert` liste les conducteurs actifs → crée l'assignation + passe le signalement en "Approuvé"
  - **Assignation existante** → affiche l'avatar (initiales), le nom, le statut, le badge ID → bouton "Désassigner" (passe l'assignation en "annulé")
- Ajout de `getAllSync()` sur `ConducteurMockDatasource` pour pouvoir lister les conducteurs dans l'Alert sans async

### 3. Admin : Voir les tournées d'un conducteur

**Fichier modifié :** `app/admin/conducteurs/[id]/index.tsx`
- Ajout de `load()` + `useEffect` qui n'existaient pas (le composant restait bloqué en loading)
- Nouvelle section "Tournées assignées (N)" dans le détail conducteur :
  - Liste des assignations avec titre, ID, statut (badge coloré)
  - Chaque ligne cliquable → navigate vers le détail du signalement
  - État vide si aucune assignation

### 4. Interface conducteur complète

**DriverContext :** `src/core/contexts/DriverContext.tsx`
- Auth par email professionnel (8 comptes mockés, ex: `mamadou.diop@cleancity.sn`)
- `login(email)` → vérifie l'email, connecte le conducteur
- `logout()` → déconnecte

**Écrans conducteur :**

| Route | Fichier | Description |
|---|---|---|
| `/driver/login` | `app/driver/login.tsx` | Connexion par email, thème dark, hint avec exemple |
| `/driver` | `app/driver/index.tsx` | Dashboard : stats (en cours/terminées/total), tournées actives, historique, navigation basse 3 tabs |
| `/driver/taches` | `app/driver/taches/index.tsx` | Liste des tournées avec 3 filtres (Toutes/En cours/Terminées), pull-to-refresh |
| `/driver/taches/[id]` | `app/driver/taches/[id]/index.tsx` | Détail tournée : infos signalement + assignation + 3 actions (En route → En collecte → Terminer) |
| `/driver/profil` | `app/driver/profil/index.tsx` | Profil : infos conducteur + déconnexion |

**Layout :** `app/driver/_layout.tsx`
- Auth guard avec `Redirect` + `usePathname` pour éviter la boucle infinie
- `DriverProvider` wrappé localement (pas dans le layout racine) pour éviter les conflits d'initialisation
- Navigation par bottom tabs (Accueil / Tournées / Profil)

### 5. Sidebar admin : Lien vers conducteur

**Fichier modifié :** `src/presentation/admin/components/Sidebar.tsx`
- Nouveau bouton "Mode conducteur" (vert, icône voiture) entre le menu et la déconnexion
- Navigue vers `/driver/login`

### 6. Corrections de bugs

| Problème | Cause | Correctif |
|---|---|---|
| `Maximum update depth exceeded` | `DriverProvider` dans la racine + `Redirect` dans `app/driver/_layout.tsx` bouclait pendant l'init d'Expo Router | `DriverProvider` déplacé dans le layout driver ; ajout de `pathname` guard dans les Redirect |
| `app/admin/conducteurs/[id]` bloqué en loading | Pas de `load()` + `useEffect` | Ajout de la fonction de chargement + useEffect |
| Erreurs TSC | Import `Assignment` depuis le mauvais module ; types `any` sur les states | Imports corrigés depuis les entités ; typage `Assignment[]` |

### 7. Fichiers modifiés/créés

```
CRÉÉS :
  src/domain/entities/Assignment.ts
  src/data/datasources/AssignmentMockDatasource.ts
  src/core/contexts/DriverContext.tsx
  app/driver/_layout.tsx
  app/driver/login.tsx
  app/driver/index.tsx
  app/driver/taches/index.tsx
  app/driver/taches/[id]/index.tsx
  app/driver/profil/index.tsx

MODIFIÉS :
  app/_layout.tsx                          ← retrait DriverProvider
  app/admin/_layout.tsx                    ← ajout pathname guard
  app/admin/signalements/[id]/index.tsx     ← assignation conducteur
  app/admin/conducteurs/[id]/index.tsx      ← tournées + fix loading
  src/data/datasources/ConducteurMockDatasource.ts  ← getAllSync()
  src/presentation/admin/components/Sidebar.tsx     ← bouton mode conducteur
```
