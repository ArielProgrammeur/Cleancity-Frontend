LISTES DES COMMANDES IMPORTANTES 

# Pour les icônes (au lieu d'emojis)
npx expo install @expo/vector-icons

# Pour les animations avancées
npx expo install react-native-reanimated

# Pour la caméra (signaler avec photo)
npx expo install expo-camera expo-image-picker

# Pour la géolocalisation (carte/suivi)
npx expo install expo-location

# Pour les requêtes API
pnpm add axios

# AsyncStorage (pour onboarding/auth)
npx expo install @react-native-async-storage/async-storage

# Initialise Git
git init

# Ajoute tous les fichiers (sauf ceux dans .gitignore)
git add .

# Vérifie ce qui sera sauvegardé
git status

Tu devrais voir :
```
Changes to be committed:
  new file:   app/(auth)/_layout.tsx
  new file:   app/(auth)/login.tsx
  new file:   app/(auth)/register.tsx
  ...

# git commit -m "🎉 Initial commit - CleanCity Frontend avec Expo Router

- ✅ Splash screen avec animation
- ✅ Onboarding (3 étapes)
- ✅ Authentification (login, register, forgot-password)
- ✅ Tabs (home, report, map, marketplace, profile)
- ✅ Constants (Colors, Sizes)
- 🎨 UI complète avec design CleanCity"

# Étape 5 : Créer un repo sur GitHub

Option A : Via l'interface GitHub (recommandé)

Va sur https://github.com
Clique sur le + en haut à droite → New repository
Remplis :

Repository name : CleanCity-Frontend
Description : Application mobile CleanCity - Gestion des déchets et recyclage
Public ou Private (ton choix)
NE COCHE PAS "Add a README" (on en a déjà un)
Clique sur Create repository


🔗 Étape 6 : Lier le repo local à GitHub

# Remplace TON_USERNAME par ton nom d'utilisateur GitHub
git remote add origin https://github.com/TON_USERNAME/CleanCity-Frontend.git

# Vérifie que c'est bien lié
git remote -v
```

Tu devrais voir :
```
origin  https://github.com/TON_USERNAME/CleanCity-Frontend.git (fetch)
origin  https://github.com/TON_USERNAME/CleanCity-Frontend.git (push)


🚀 Étape 7 : Pousser le code sur GitHub

# Renomme la branche en main (si elle s'appelle master)
git branch -M main

# Push vers GitHub
git push -u origin main

# 🌱 CleanCity - Frontend Mobile

Application mobile de gestion des déchets et de recyclage pour une ville propre.

## 🚀 Technologies

- **React Native** avec **Expo Router**
- **TypeScript**
- **Expo SDK 52**
- **AsyncStorage** pour la persistance locale

## 📱 Fonctionnalités

### ✅ Implémentées
- 🎬 **Splash Screen** avec animation
- 📖 **Onboarding** (3 étapes)
- 🔐 **Authentification** (Login, Register, Forgot Password)
- 🏠 **Home** - Dashboard avec statistiques
- 📍 **Report** - Signalement des déchets
- 🗺️ **Map** - Suivi des collectes en temps réel
- 🛒 **Marketplace** - Achat/vente de matériaux recyclés
- 👤 **Profile** - Gestion du profil utilisateur

### 🔜 À venir
- Intégration API Laravel
- Géolocalisation GPS
- Capture de photos
- Notifications push
- Mode dark

## 🛠️ Installation
```bash
# Clone le projet
git clone https://github.com/TON_USERNAME/CleanCity-Frontend.git
cd CleanCity-Frontend

# Installe les dépendances
pnpm install

# Lance l'app
pnpm start
```

## 📂 Structure du projet
```
app/
├── (onboarding)/     # Écrans d'introduction
├── (auth)/           # Authentification
├── (tabs)/           # App principale (5 tabs)
├── _layout.tsx       # Layout root
└── index.tsx         # Splash screen

constants/
├── Colors.ts         # Palette de couleurs
├── Sizes.ts          # Tailles et espacements
└── index.ts          # Exports
```

## 🎨 Design

- Couleur principale : **#4CAF50** (Vert)
- UI/UX : Design moderne et épuré
- Navigation : Expo Router (file-based)

## 👨‍💻 Auteur

**Ariel Ngadeu "ArielProgrammeur"**


Commandes Git utiles pour plus tard

# Voir l'état actuel
git status

# Voir les changements
git diff

# Ajouter et commit en une ligne
git add . && git commit -m "Message"

# Pousser vers GitHub
git push

# Voir l'historique
git log --oneline

# Créer une branche
git checkout -b nom-de-la-branche

# Revenir à main
git checkout main

# Workflow pour continuer à travailler
Chaque fois que tu fais des modifications :

# 1. Ajoute les fichiers modifiés
git add .

# 2. Commit avec un message clair
git commit -m "✨ Ajout de la fonctionnalité X"

# 3. Push vers GitHub
git push

