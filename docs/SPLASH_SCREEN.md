# Splash Screen — Document d'explication

## C'est quoi ?

Le **Splash Screen** est le premier écran qu'on voit quand on ouvre l'application.
C'est comme le générique de début d'un film : il dure quelques secondes, montre 
le logo et le nom de l'application, puis laisse place à l'écran principal.

---

## Ce qu'il fait

1. **Au démarrage** : on voit une feuille blanche (l'icône) sur fond vert, avec 
   le nom "CleanCity" écrit en grand
2. **Animation** : la feuille apparaît en fondu et grossit légèrement (comme un 
   ressort qui se détend), puis la phrase "Gardons notre ville propre" apparaît 
   en douceur en bas
3. **Après 2.5 secondes** : l'écran d'accueil principal s'affiche automatiquement

---

## Où se trouve-t-il ?

```
src/presentation/features/splash/
├── SplashScreen.tsx   ← Le code de l'écran
```

Le fichier `app/index.tsx` est le point d'entrée. Il affiche simplement le 
SplashScreen. C'est comme la porte d'entrée de la maison : on entre par là, 
et le SplashScreen nous accueille avant de nous guider vers le salon (l'accueil).

---

## Pourquoi un Splash Screen ?

- **Donner une identité** : l'utilisateur voit tout de suite le nom et le logo
- **Temps de chargement** : pendant ces 2.5 secondes, l'application peut 
  préparer discrètement ce qu'il faut (vérifier la connexion, charger des 
  données…)
- **Expérience fluide** : plutôt qu'un écran noir ou figé, on a une animation 
  agréable qui "réveille" l'application

---

## Les couleurs

- Fond : vert foncé (#2E7D32) — couleur principale de CleanCity, associée à 
  la nature et la propreté
- Texte : blanc — lisible sur fond vert
- Petit texte en bas : blanc légèrement transparent

*Ces couleurs sont définies dans `src/core/theme/colors.ts`*

---

## Et après ?

Une fois le SplashScreen terminé, on arrive sur **l'écran d'accueil** 
(`app/home.tsx`). C'est là que l'utilisateur pourra voir la carte, les 
signalements, et commencer à utiliser l'application.

---

*Document créé le 12/06/2026 — Compréhensible par tous*
