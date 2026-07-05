# Secondary Screens - CleanCity Frontend

## Overview

Created **11 secondary screens** to complement the existing tab-based navigation. These screens are accessible via Expo Router's file-based routing and provide detailed views for all major features.

## Architecture

```
app/                              # Routes (Expo Router)
├── report/[id].tsx               → ReportDetailScreen
├── rewards/[id].tsx              → RewardDetailScreen
├── marketplace/[id].tsx          → ProductDetailScreen
├── marketplace/create-listing.tsx → CreateListingScreen
├── profile/edit.tsx              → EditProfileScreen
├── settings.tsx                  → SettingsScreen
├── notifications.tsx             → NotificationsScreen
├── collection-schedule.tsx       → CollectionScheduleScreen
├── leaderboard.tsx               → LeaderboardScreen
├── wishlist.tsx                  → WishlistScreen
└── report-history.tsx            → ReportHistoryScreen

src/presentation/secondary/       # Screen components
├── index.ts                      # Barrel exports
└── screens/
    ├── ReportDetailScreen.tsx     # Full waste report view
    ├── RewardDetailScreen.tsx     # Reward detail + claim
    ├── ProductDetailScreen.tsx    # Product detail + sell
    ├── EditProfileScreen.tsx      # Edit user profile form
    ├── SettingsScreen.tsx         # App settings
    ├── NotificationsScreen.tsx    # Notification list
    ├── CollectionScheduleScreen.tsx # Weekly collection calendar
    ├── LeaderboardScreen.tsx      # User rankings
    ├── WishlistScreen.tsx         # Saved rewards
    ├── ReportHistoryScreen.tsx    # All reports with filters
    └── CreateListingScreen.tsx    # New marketplace listing form
```

## Screens Detail

| Screen | Route | Purpose | Key Features |
|--------|-------|---------|--------------|
| **Report Detail** | `/report/[id]` | View full report | Status timeline, location, actions |
| **Reward Detail** | `/rewards/[id]` | Reward info + claim | Hero icon, stock bar, discount, claim |
| **Product Detail** | `/marketplace/[id]` | Product info | Price trend, CO2 savings, tips, listings |
| **Edit Profile** | `/profile/edit` | Edit user profile | Avatar, name/email/phone form |
| **Settings** | `/settings` | App settings | Notifications toggles, dark mode, language |
| **Notifications** | `/notifications` | Notification list | Read/unread states, empty state |
| **Collection Schedule** | `/collection-schedule` | Weekly calendar | Day selector, routes, today highlight |
| **Leaderboard** | `/leaderboard` | User rankings | Podium (top 3), ranked list, current user |
| **Wishlist** | `/wishlist` | Saved rewards | Heart icons, remove, browse rewards CTA |
| **Report History** | `/report-history` | All reports list | Filter chips (All/Pending/In Progress/Resolved) |
| **Create Listing** | `/marketplace/create-listing` | New listing form | Category grid, quantity/price/location form |

## Navigation Updates

Existing screens updated with navigation links to secondary screens:

- **Dashboard** (`app/(tabs)/index.tsx`):
  - "Collection" quick access → `/collection-schedule`
  - Notification bell → `/notifications`
  - Recent reports (tappable) → `/report/[id]`
  - "View All" → `/report-history`

- **Profile** (`ProfileScreen.tsx`):
  - Edit button → `/profile/edit`
  - Notifications row → `/notifications`
  - Theme/About rows → `/settings`

- **Rewards** (`RewardsScreen.tsx`):
  - Reward cards (tappable) → `/rewards/[id]`

- **Marketplace** (`MarketplaceScreen.tsx`):
  - Product cards (tappable) → `/marketplace/[id]`
  - "Sell This Material" button → `/marketplace/create-listing`

## Tech Stack

- **Routing**: Expo Router (file-based, Stack navigator)
- **Styling**: StyleSheet.create with `src/core/theme/` (colors, spacing, typography)
- **Icons**: `@expo/vector-icons` (Ionicons)
- **TypeScript**: Strict mode, no errors
- **Lint**: ESLint clean (no warnings/errors in new code)

## Stats

- **11 new route files** in `app/`
- **11 screen components** in `src/presentation/secondary/screens/`
- **~72KB** total new code
- **0 TypeScript errors**, **0 ESLint errors**
