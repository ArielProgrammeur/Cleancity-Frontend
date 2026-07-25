# Analyse du projet CleanCity — Frontend Mobile

## Vue d'ensemble

CleanCity est une application React Native/Expo de gestion des déchets, visant à connecter citoyens, conducteurs et administrateurs. Le projet est en phase de **prototype fonctionnel** avec données mockées, UI complète, et navigation fluide.

---

## Points forts

### 1. Architecture propre et maintenable
- **Clean Architecture 3 couches** bien respectée : `core/` (utilitaires) → `domain/` (entités + contrats) → `data/` (implémentations) → `presentation/` (UI)
- **Séparation claire des responsabilités** : chaque dossier correspond à un concept (onboarding, auth, reporting, marketplace, rewards, admin, driver)
- **Result<T> monad** pour la gestion d'erreur fonctionnelle — pattern propre et typé

### 2. Navigation robuste (Expo Router)
- Fichier-based : routes auto-générées, faciles à comprendre
- Navigation imbriquée propre : racine → tabs | admin | driver
- Layouts avec guards d'authentification (Redirect) — pattern sûr après correction des boucles infinies
- Bottom tabs animés (spring scale 1→1.4)

### 3. UI/UX aboutie
- **Thème dark premium** pour le back office (#0A0F1E), cohérent sur tous les écrans admin
- **Dashboard Power BI-like** avec 4 types de charts SVG (Bar, Donut, Trend, Timeline)
- **Animations Reanimated** (FadeInDown, SlideInLeft) — navigation fluide
- **Pull-to-refresh** sur toutes les listes
- **États vides, chargement, et erreur** — chaque écran gère les 3 états

### 4. Complétude fonctionnelle
- **4 domaines mockés** : signalements, utilisateurs, récompenses, conducteurs — CRUD complet
- **Interface conducteur** complète : login, dashboard, tâches (list/detail/update status), profil
- **i18n** Français/Anglais configuré
- **20+ écrans** dans l'application

### 5. Qualité technique
- **TypeScript strict** — 0 erreur tsc
- **0 dépendances mortes** — cleanup effectué
- **StyleSheet.create** partout — fiable, pas de NativeWind/Tailwind

---

## Points faibles

### 1. Aucun test
- **0 test unitaire, 0 test d'intégration** — `__tests__` inexistant, aucun fichier `.test.ts`
- Risque de régression élevé à chaque modification
- Les mock datasources sont parfaites pour être testées unitairement mais aucun test ne les exploite

### 2. Firebase non intégré
- Firebase installé (`v10.5.2`) et initialisé dans `utils/firebase.ts` mais **jamais utilisé**
- Aucun service Firebase branché : Auth, Firestore, Storage
- Toutes les données sont mockées avec `setTimeout` — pas de persistance
- Les `.env` sont gitignorés mais aucune variable d'environnement n'est réellement utilisée

### 3. Pas de connexion API réelle
- `fetch` et `axios` absents du codebase
- Aucun endpoint backend défini ou appelé
- L'application est un **prototype statique** — pas de backend, pas de synchronisation

### 4. Gestion d'état simpliste
- `useState` + `useContext` partout — pas de Redux/Zustand/Jotai
- Pas de mécanisme de cache (React Query, SWR, AsyncStorage pour autre chose que l'onboarding)
- Les contextes ne sont pas persistés — l'admin/conducteur est déconnecté au refresh

### 5. Domaines incomplets
- **Profile** et **Rewards** sont des placeholders dans les tabs
- **Marketplace** affiche des prix statiques mais pas de transactions
- **Signalements** : pas de synchronisation avec les conducteurs en temps réel
- **Notifications** : inexistantes (ni push, ni in-app)

### 6. Pas de gestion de permissions/rôles
- Admin détecté par comparaison de strings (`admin@gmail.com`/`root`)
- Conducteur authentifié par email uniquement (pas de mot de passe)
- Pas de système de rôles modulaire — tout est codé en dur

### 7. Clean Architecture partiellement appliquée
- Les **usecases** sont absents (`src/domain/usecases/` est vide)
- Certaines datasources sont appelées **directement depuis les screens** (notamment dans l'admin), court-circuitant le repository
- L'injection de dépendances (`core/di/container.ts`) existe mais n'est utilisée nulle part

### 8. Pas de gestion des erreurs réseau
- Les `try/catch` des mock datasources sont silencieux — `catch {}` sans log ni retry
- Pas de timeout, pas de retry, pas de fallback UI pour erreur réseau

---

## Problèmes identifiés

| Problème | Sévérité | Détail |
|---|---|---|
| **Boucle de Redirect** (résolu) | Critique | `app/driver/_layout.tsx` + `DriverProvider` dans la racine causaient "Maximum update depth exceeded" |
| **ConducteurDetail bloqué en loading** (résolu) | Haute | `load()` + `useEffect` manquants |
| Aucun test | Haute | Impossible de refactorer sans risque |
| Firebase inutilisé | Haute | Dépendance morte de 100+ lignes dans pnpm-lock |
| Pas de backend | Haute | Application non fonctionnelle sans mock |
| Usecases absents | Moyenne | Clean Architecture incomplète |
| DI non utilisée | Moyenne | Service container existe mais inutilisé |
| Contexte non persisté | Moyenne | Déconnexion au refresh |
| `catch {}` silencieux | Basse | Erreurs avalées silencieusement |

---

## Recommandations

### Court terme (prioritaire)
1. **Écrire des tests unitaires** — commencer par les datasources (ConducteurMockDatasource, AssignmentMockDatasource) qui sont déjà mockées et testables
2. **Remplacer les mock datasources par Firebase** — commencer par Auth, puis Firestore pour les signalements
3. **Persister l'auth admin/conducteur** — AsyncStorage pour garder la session au refresh
4. **Supprimer Firebase** si le backend est ailleurs, ou **le brancher** réellement

### Moyen terme
5. **Ajouter React Query** (TanStack Query) pour la gestion de cache, retry, loading states
6. **Implémenter les usecases** manquants dans `src/domain/usecases/`
7. **Utiliser le conteneur DI** existant (`core/di/container.ts`) plutôt que des `new Datasource()` dans les screens
8. **Séparer les routes driver** avec un vrai mot de passe (pas que l'email)
9. **Ajouter des notifications push** (Expo Notifications)

### Long terme
10. **Remplacer les charts SVG maison** par `react-native-chart-kit` ou `victory-native` si plus de complexité nécessaire
11. **Ajouter des maps** (expo-location + MapView) pour visualiser les signalements géolocalisés
12. **Mode hors-ligne** avec AsyncStorage comme fallback
13. **CI/CD** avec EAS et GitHub Actions, incluant lint + tsc + tests

---

## Chiffres clés

| Métrique | Valeur |
|---|---|
| Fichiers TypeScript | ~94 |
| Écrans | ~20 |
| Datasources mock | 12 |
| Entités domain | 12 |
| Composants partagés | ~10 |
| Erreurs tsc | 0 |
| Tests | 0 |
| Firebase usage | 0% |
| Vrai backend | Non |

---

## Conclusion

CleanCity est un **prototype front-end complet et bien architecturé** mais qui n'est pas encore connecté à un backend. Les choix techniques (Clean Architecture, TypeScript strict, StyleSheet.create, Expo Router) sont solides. La priorité absolue est de **brancher un backend** (Firebase ou API custom) et d'**ajouter des tests** avant d'aller plus loin. La session actuelle a ajouté un module d'assignation conducteur et une interface conducteur complète, ce qui complète le triangle admin→conducteur→signalement.
