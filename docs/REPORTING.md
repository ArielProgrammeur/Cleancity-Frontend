# Reporting — Document d'explication

## C'est quoi ?

Le **Reporting** est la fonction principale de CleanCity. Elle permet à 
l'utilisateur de **signaler un déchet** dans la rue en quelques clics.

---

## L'écran "Report Waste" (/report)

```
┌──────────────────────────┐
│  ←  Report Waste         │
├──────────────────────────┤
│                          │
│  [Zone photo]            │
│  Tapez pour prendre      │
│  une photo               │
│                          │
│  CATEGORY                │
│  ┌────┐ ┌────┐ ┌────┐   │
│  │Plast│ │Verr│ │Orga│   │
│  └────┘ └────┘ └────┘   │
│  ┌────┐ ┌────┐ ┌────┐   │
│  │Elec│ │Dang│ │Autr│   │
│  └────┘ └────┘ └────┘   │
│                          │
│  DESCRIPTION             │
│  ┌──────────────────┐    │
│  │ Describe...       │    │
│  └──────────────────┘    │
│                          │
│  📍 Current Location     │
│  Auto-detected...        │
│                          │
│  [📤 Submit Report]      │
└──────────────────────────┘
```

## Les catégories

| Catégorie | Icône | Couleur |
|---|---|---|
| Plastique | 💧 | Bleu |
| Verre | 🍷 | Vert |
| Organique | 🌿 | Vert clair |
| Électronique | 💻 | Violet |
| Dangereux | ⚠️ | Rouge |
| Autre | … | Gris |

## Où se trouve-t-il ?

```
src/presentation/features/reporting/
├── screens/
│   └── ReportScreen.tsx     ← Le formulaire
├── components/
│   ├── CategorySelector.tsx ← Grille des catégories
│   └── ImagePicker.tsx      ← Zone photo
├── data/
│   └── categories.ts        ← Les 6 catégories
└── index.ts

app/report.tsx               ← Route /report
```

## À venir

- Prise de photo réelle (expo-image-picker)
- Géolocalisation automatique
- Envoi vers Firebase
- Écran liste des signalements

---

*Document créé le 12/06/2026 — Compréhensible par tous*
