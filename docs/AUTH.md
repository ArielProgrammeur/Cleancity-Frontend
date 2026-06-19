# Authentification (Auth) — Document d'explication

## C'est quoi ?

L'**Auth** (authentification) est la partie qui permet de **créer un compte** 
et de **se connecter** à l'application. C'est comme une porte d'entrée : sans 
elle, on ne peut pas utiliser l'application.

---

## Les 2 écrans

### 🔑 Connexion (Login)
- Saisir son **email** et son **mot de passe**
- Bouton "Sign In" pour se connecter
- Lien "Forgot password?" pour réinitialiser
- Boutons Google et Apple pour se connecter rapidement
- Lien "Sign Up" si on n'a pas encore de compte

### ✨ Inscription (Sign Up)
- Saisir son **nom**, son **email** et son **mot de passe**
- Bouton "Create Account" pour s'inscrire
- Boutons Google et Apple
- Lien "Sign In" si on a déjà un compte

---

## Le flux complet (maintenant)

```
App ouverte → Splash (2.5s) → Onboarding (3 slides)
                                    ↓
                               Login ou SignUp
                                    ↓
                               Accueil (Home)
```

---

## À quoi ça ressemble ?

Chaque écran a :
- Un **logo** en haut (feuille verte)
- Un **titre** et une petite phrase d'accueil
- Des **champs** de texte avec icônes et bordures vertes au focus
- Un **bouton vert** principal avec ombre
- Un **séparateur** "or continue with"
- Des **boutons sociaux** (Google, Apple)
- Un **lien** vers l'autre écran (Sign Up ←→ Sign In)

---

## Où se trouve-t-il ?

```
src/presentation/features/auth/
├── screens/
│   ├── LoginScreen.tsx     ← Écran de connexion
│   └── SignUpScreen.tsx    ← Écran d'inscription
├── components/
│   └── AuthInput.tsx       ← Champ de texte réutilisable
└── index.ts

app/
├── login.tsx               ← Route /login
└── signup.tsx              ← Route /signup
```

---

## Et la sécurité ?

Pour l'instant, la connexion est **simulée** (elle ne vérifie rien). 
Quand on appuie sur "Sign In" ou "Create Account", ça attend 1.5 seconde 
puis ça envoie vers l'accueil. 

**Prochaine étape :** connecter Firebase Auth pour que les comptes soient 
réels et sécurisés.

---

*Document créé le 12/06/2026 — Compréhensible par tous*
