# Onboarding — Document d'explication

## C'est quoi ?

L'**Onboarding** est une série d'écrans qu'on voit **la première fois** qu'on 
ouvre l'application. C'est comme une petite visite guidée qui explique à quoi 
sert l'app et comment l'utiliser.

---

## Les 3 écrans

| Écran | Icône | Ce qu'il dit |
|---|---|---|
| 1 | 🗑️ Poubelle | "Signalez les déchets" — Prenez une photo et signalez les problèmes dans la rue |
| 2 | 🏆 Trophée | "Gagnez des points" — Chaque signalement vous rapporte des points |
| 3 | 🎁 Cadeau | "Échangez vos récompenses" — Utilisez vos points pour obtenir des bons d'achat |

---

## Comment ça marche

1. L'utilisateur **glisse** les écrans avec le doigt (ou appuie sur "Suivant")
2. Les petits **points** en bas montrent où on en est
3. On peut **passer** à tout moment avec le bouton "Passer"
4. Au dernier écran, le bouton **"Commencer"** s'affiche
5. Une fois terminé, l'application **se souvient** qu'on a déjà vu l'onboarding
6. La prochaine fois, on ne verra **plus jamais** l'onboarding

---

## Où se trouve-t-il ?

```
src/presentation/features/onboarding/
├── OnboardingScreen.tsx     ← L'écran principal avec le glissement
├── OnboardingSlide.tsx      ← Le contenu d'un seul écran
└── data/
    └── slides.ts            ← Les textes et icônes des 3 écrans
```

Le fichier `app/onboarding.tsx` est la page web (la route). Il se contente 
d'afficher le composant `OnboardingScreen`.

---

## Le flux complet

```
App ouverte
    ↓
Splash Screen (2.5s) ← animation jolie
    ↓
┌─ Première fois ? ──→ Oui ──→ Onboarding (3 écrans)
└─ Déjà vu ? ────────→ Non ──→ Accueil (Home)
                                      ↓
                               (plus tard → Auth)
```

---

## Comment l'application se "souvient" ?

On utilise une **boîte à souvenirs** (AsyncStorage) qui garde un petit mot :
"l'utilisateur a déjà vu l'onboarding". C'est comme un post-it dans le téléphone,
il reste même quand on ferme l'application.

- La première fois : post-it vide → on montre l'onboarding → on écrit le post-it
- Les fois suivantes : post-it présent → on va directement à l'accueil

Pour effacer le souvenir et revoir l'onboarding :
```bash
# En développement, on peut effacer le post-it :
AsyncStorage.removeItem('@cleancity/hasSeenOnboarding')
```

---

*Document créé le 12/06/2026 — Compréhensible par tous*
