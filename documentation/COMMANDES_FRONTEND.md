# Guide des Commandes Frontend - CleanCity

---

## 1. Installation initiale

```bash
# Installer pnpm (si pas encore installe)
npm install -g pnpm

# Se placer dans le dossier Frontend
cd Frontend

# Installer toutes les dependances
pnpm install

# Configurer l'environnement
cp .env.example .env
# Editer .env avec les cles Firebase
```

---

## 2. Lancer le serveur de developpement

```bash
# Lancer Expo (recommande)
pnpm start

# Lancer avec Expo Go (scan QR code)
pnpm start --go

# Lancer directement sur Android (emulateur ou USB)
pnpm android

# Lancer directement sur iOS (emulateur)
pnpm ios

# Lancer sur le web (pour debug)
pnpm web

# Lancer avec cache clear
pnpm start --clear
```

---

## 3. Types et Lint

```bash
# Verifier les types TypeScript
pnpm typecheck

# Lancer le linter ESLint
pnpm lint

# Linter et corriger automatiquement
pnpm lint --fix

# Formatter avec Prettier
npx prettier --write .
```

---

## 4. Gestion des dependances

```bash
# Installer un package
pnpm add <package>

# Installer un package de dev
pnpm add -D <package>

# Installer un package Expo recommande
npx expo install <package>

# Mettre a jour les dependances
pnpm update

# Supprimer un package
pnpm remove <package>

# Voir les dependances dependances
pnpm list
```

### Packages importants du projet

| Package | Commande d'installation |
|---------|------------------------|
| expo-location | `npx expo install expo-location` |
| react-native-maps | `npx expo install react-native-maps` |
| firebase | `pnpm add firebase` |
| i18next | `pnpm add i18next react-i18next` |
| reanimated | `npx expo install react-native-reanimated` |
| expo-image-picker | `npx expo install expo-image-picker` |
| expo-linear-gradient | `npx expo install expo-linear-gradient` |

---

## 5. Build (Construction de l'app)

### Via EAS Build

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter a Expo
eas login

# Configurer le projet
eas build:configure

# Build development (pour tester sur device)
eas build --platform android --profile development
eas build --platform ios --profile development

# Build preview (pour sharing)
eas build --platform android --profile preview

# Build production (pour le store)
eas build --platform android --profile production
eas build --platform ios --profile production
```

### Localement (sans EAS)

```bash
# Android : generer APK
eas build --platform android --profile development --local

# Prebuild pour natif
npx expo prebuild
cd android && ./gradlew assembleDebug
```

---

## 6. Expo Go vs Build natif

### Packages necessitant un build natif

Ces packages **ne fonctionnent pas** avec Expo Go — il faut un build custom :

| Package | Raison |
|---------|--------|
| `@react-native-firebase/app` | SDK Firebase natif |
| `@react-native-firebase/auth` | Auth Firebase native |
| `react-native-maps` | Composant natif |
| `expo-image-picker` | Acces camera/gallery |
| `react-native-reanimated` | Bridge natif |

### Pour开发pendant le dev

Utilise Expo Go pour tout sauf Firebase natif. Pour Firebase, utilise `firebase` (JS SDK) qui fonctionne dans Expo Go.

---

## 7. Debug

```bash
# Logs React Native
npx expo start

# Debugger avec Chrome DevTools
# Ouvrir chrome://inspect

# Logs specifiques Android
adb logcat | grep ReactNative

# Logs specifiques iOS
# Console Xcode

# Reset le cache Metro
npx expo start --clear

# Voir les dependances problematiques
npx expo doctor
```

### Outils utiles

- **React Native Debugger** : Debugger visuel
- **Flipbo** : Inspection reseau, AsyncStorage, etc.
- **Expo DevTools** : Dashboard de developpement

---

## 8. Tests

```bash
# Lancer les tests (si Jest est configure)
pnpm test

# Lancer les tests avec couverture
pnpm test --coverage

# Lancer un fichier specifique
pnpm test -- path/to/test

# Watch mode
pnpm test --watch
```

---

## 9. Git

```bash
# Voir le statut
git status

# Ajouter les changements
git add .

# Committer
git commit -m "feat: description du changement"

# Pousser
git push

# Creer une branche
git checkout -b feature/nom-de-la-feature

# Merge
git checkout main
git merge feature/nom-de-la-feature
```

### Convention de commit

```
feat:     Nouvelle fonctionnalite
fix:      Correction de bug
docs:     Documentation
style:    Formatage (pas de changement de code)
refactor: Refactorisation
test:     Ajout de tests
chore:    Maintenance
```

---

## 10. Variables d'environnement

Le fichier `.env` du Frontend contient les cles Firebase publiques :

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=cleancity-xxxxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=cleancity-xxxxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=cleancity-xxxxx.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

> **Important** : Les cles `EXPO_PUBLIC_*` sont exposees dans le build. Ce sont des cles publiques Firebase, pas des secrets.

---

## 11. Deploiement

### Expo Updates (OTA)

```bash
# Push un update sans rebuild
eas update --branch production --message "Fix bug login"
```

### Store

```bash
# Android (Google Play)
eas submit --platform android

# iOS (App Store)
eas submit --platform ios
```

---

## 12. Commandes de depannage

```bash
# Erreur : "Unable to resolve module"
npx expo start --clear
rm -rf node_modules
pnpm install

# Erreur : "Firebase not initialized"
# Verifier .env et firebase.ts

# Erreur : "Network request failed"
# Verifier l'URL du backend dans src/core/api/api.ts

# Erreur : TypeScript
pnpm typecheck

# Erreur : ESLint
pnpm lint

# Erreur : Metro bundler
npx expo start --clear --reset-cache

# Erreur : Build echoue
eas build --platform android --profile development --clear
```

---

## 13. Resumé de toutes les commandes

| Commande | Description |
|----------|-------------|
| `pnpm install` | Installer les dependances |
| `pnpm start` | Lancer le serveur Expo |
| `pnpm start --go` | Lancer avec Expo Go |
| `pnpm android` | Lancer sur Android |
| `pnpm ios` | Lancer sur iOS |
| `pnpm typecheck` | Verifier les types |
| `pnpm lint` | Linter le code |
| `pnpm test` | Lancer les tests |
| `eas build` | Builder l'app |
| `eas update` | Push un update OTA |
| `eas submit` | Soumettre au store |
| `npx expo doctor` | Diagnostic de sante |
| `npx expo start --clear` | Reset le cache |
