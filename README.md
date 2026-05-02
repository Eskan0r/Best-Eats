# 🍽️ Best Eats — Hilton Hotels Restaurant Recommendation App

**Team 7 LLC · Group 11**
*Tvisha Doshi · Shreya Kankipati · Zaar Songadwala · Ronak Chavva*

A cross-platform restaurant recommendation app for Hilton Hotel guests with dietary
restrictions. Built with **React Native (Expo)** for mobile + **Node.js / Express** for
the backend, runs from a single codebase on **iOS, Android, and Web**.

---

## ✨ Features Implemented

- ✅ **Landing / Login / Create Account** — full Hilton Best Eats branding (FR-04)
- ✅ **Password validation** — 12 chars + capital + lowercase + number + special (FR-09)
- ✅ **Login lockout** — 5 failed attempts → 15-min cooldown (NFR-03)
- ✅ **Google Login** — mock 1–2 sec redirect (NFR-04)
- ✅ **Explore page** — toggleable card list and map view (FR-17, FR-19)
- ✅ **Real-time location** — uses device GPS, falls back to Hilton Anatole Dallas
- ✅ **For You / Recommendations** — AI-style filtering by dietary > cuisine > rating > distance (FR-08)
- ✅ **AI chatbot input bar** — natural-language queries with quick-prompt chips
- ✅ **Restaurant cards** — name, logo, distance, rating, price, dietary tags, favorite/rate/view (FR-18)
- ✅ **Sponsored cards** — "Hilton Verified" ribbons, max 3 per page (FR-05, FR-06)
- ✅ **Rating modal** — star selector + review text + confirmation banner (FR-21, FR-22, FR-23)
- ✅ **Favorited restaurants** — with stats, search, top-rated badge (FR-11)
- ✅ **Dietary preferences** — all 8 options with checklist UI (FR-13, FR-16)
- ✅ **Cuisine preferences** — multi-select chips
- ✅ **Accessibility** — dark mode, color blind mode, text-to-speech toggle, scalable text, 7 languages (NFR-06)
- ✅ **Account settings** — profile fields, notifications/location toggles, log out (Sponsor Q3)
- ✅ **Backend API** — Express server with full REST endpoints

---

## 📋 Prerequisites

You need the following installed on your machine:

1. **Node.js** (v18 or later) — [Download here](https://nodejs.org/)
2. **VS Code** — [Download here](https://code.visualstudio.com/)
3. **Expo Go app** on your phone (for mobile testing):
   - **iOS**: [App Store link](https://apps.apple.com/app/expo-go/id982107779)
   - **Android**: [Play Store link](https://play.google.com/store/apps/details?id=host.exp.exponent)

To verify Node is installed, open a terminal and run:
```bash
node --version
npm --version
```
Both should print version numbers.

---

## 🚀 Quick Start (5 minutes)

### Step 1 — Open the project in VS Code

1. Unzip the `best-eats` folder anywhere you like (e.g., `Documents/best-eats`).
2. Open VS Code.
3. Go to **File → Open Folder** and select the `best-eats` folder.
4. Open VS Code's terminal: **Terminal → New Terminal** (or `` Ctrl+` ``).

### Step 2 — Install dependencies

Run these commands one at a time in the terminal:

```bash
# Install the React Native / Expo dependencies (1–2 min)
npm install

# Install the server dependencies (15 sec)
cd server
npm install
cd ..
```

### Step 3 — Start the app

```bash
npx expo start
```

You'll see a QR code in the terminal and a list of options. The Expo Dev Tools will also open in your browser.

### Step 4 — View the app on each platform

#### 📱 On your phone (iOS or Android)

1. Open the **Expo Go** app on your phone.
2. **Make sure your phone and computer are on the same Wi-Fi network.**
3. Scan the QR code in the terminal:
   - **iOS**: open the Camera app, point it at the QR code, tap the popup notification.
   - **Android**: open the Expo Go app and tap "Scan QR Code".
4. The app will load in 10–30 seconds.

#### 💻 In a web browser

Press `w` in the terminal where Expo is running. The app opens at `http://localhost:8081`.

#### 🤖 In an Android emulator (optional)

Press `a` in the terminal (requires Android Studio installed).

#### 🍎 In an iOS simulator (optional, Mac only)

Press `i` in the terminal (requires Xcode installed).

---

## 🌐 Make the app shareable with anyone (portable link)

You have **three options**, ranked by ease:

### Option 1 — Expo Tunnel (5 min, works for friends with Expo Go)

This shares a link anyone with the Expo Go app can open, regardless of network.

```bash
npx expo start --tunnel
```

You'll get a URL like `exp://u.expo.dev/xxxx-yyyy-zzzz`. Send that link to anyone and they can open it in Expo Go.

> 💡 The first time you run this, Expo may prompt you to install `@expo/ngrok`. Just say yes.

### Option 2 — Deploy the web version to Netlify (free, permanent link)

```bash
# Build the static web bundle
npx expo export --platform web
```

This creates a `dist/` folder. Then:

1. Go to [netlify.com](https://app.netlify.com/drop) (free account required).
2. Drag the `dist/` folder onto the page.
3. You get a permanent URL like `https://best-eats-xyz.netlify.app`.

### Option 3 — Publish to Expo (free, permanent link for mobile)

```bash
npx expo login        # create a free Expo account if you don't have one
eas update --branch preview --message "Best Eats v1"
```

You get a URL anyone with Expo Go can open. (Requires `eas-cli`: `npm install -g eas-cli`.)

---

## 🖥️ Running the backend server (optional)

The mobile app works fully offline using local mock data, but the backend
is included if you want to demo the REST API.

In a **second terminal** (keep Expo running in the first one):

```bash
cd server
npm start
```

The server runs on `http://localhost:3001`. Test it:

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/restaurants
```

### API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Server health check |
| GET | `/api/hilton` | Get current Hilton property info |
| GET | `/api/restaurants` | List all restaurants (supports `?dietary=&cuisine=&search=&maxDistance=`) |
| GET | `/api/restaurants/:id` | Get a single restaurant |
| POST | `/api/auth/login` | Mock login |
| POST | `/api/auth/register` | Mock register with FR-09 validation |
| POST | `/api/recommendations` | AI-style restaurant ranking |
| POST | `/api/ai/query` | Natural-language restaurant query |
| POST | `/api/ratings` | Submit a rating |
| POST | `/api/favorites/toggle` | Toggle favorite |
| GET | `/api/favorites/:userId` | Get user's favorites |

---

## 📁 Project Structure

```
best-eats/
├── App.js                          # Root component + navigation
├── app.json                        # Expo configuration
├── package.json                    # Frontend dependencies
├── babel.config.js                 # Babel preset
│
├── assets/                         # Icons & splash images
│
├── src/
│   ├── theme/
│   │   └── colors.js              # Hilton Best Eats brand palette
│   │
│   ├── data/
│   │   └── mockData.js            # 15 mock restaurants + dietary tags
│   │
│   ├── context/
│   │   └── AppContext.js          # Global state (auth, prefs, favorites, theme)
│   │
│   ├── components/
│   │   ├── Header.js              # Reusable header + Logo
│   │   ├── RestaurantCard.js      # The card per FR-18
│   │   └── RatingModal.js         # FR-21, FR-22, FR-23
│   │
│   └── screens/
│       ├── LandingScreen.js
│       ├── LoginScreen.js
│       ├── CreateAccountScreen.js
│       ├── ExploreScreen.js              (FR-17: cards + map view)
│       ├── ForYouScreen.js               (FR-08: AI recommendations)
│       ├── ProfileScreen.js
│       ├── AccountSettingsScreen.js
│       ├── DietaryPreferencesScreen.js   (FR-13, FR-16)
│       ├── FavoritedScreen.js            (FR-11)
│       └── AccessibilityScreen.js        (NFR-06: WCAG 2.1)
│
└── server/
    ├── server.js                  # Express REST API
    ├── restaurants.js             # Server-side mock data
    └── package.json
```

---

## 🎨 Brand Colors (per Marketing Lead spec)

| Hex | Name | Usage |
| --- | --- | --- |
| `#5A2328` | Maroon | Primary brand, CTAs, headers |
| `#7A9B76` | Sage Green | Success actions, "Best Eats" wordmark |
| `#C8BFC7` | Cream | "Hilton" wordmark, soft accents |
| `#8A7E72` | Warm Gray | Secondary text, dividers |
| `#090302` | Black | Header backgrounds, dark mode |

---

## 🧪 Demo Login

You don't need a real account — any valid email and password will work:

- **Email:** `demo@hilton.com`
- **Password:** any password (login screen does mock validation only)

Or use **Create Account** to test the full FR-09 password validation flow.

---

## 🔧 Troubleshooting

### "Metro bundler doesn't start" / "Port 8081 in use"

Kill the process using port 8081 and try again:

```bash
# Mac/Linux
lsof -ti:8081 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 8081).OwningProcess | Stop-Process -Force
```

### "Can't connect to phone" when using QR code

- Confirm phone and computer are on the **same Wi-Fi network**.
- Try `npx expo start --tunnel` instead (works across networks).
- On Windows, allow the Node.js firewall prompt.

### "expo-location" permission denied on web

This is expected — browsers require HTTPS for geolocation. The app falls back
to the Hilton Anatole location automatically.

### "Module not found" errors

Delete `node_modules` and `package-lock.json` and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Web build doesn't show map markers properly

The "map view" is a simplified positional layout (not Google Maps). To use a
real Google Map you'd need a Google Maps API key — out of scope for this demo.

---

## 📝 Notes for grading / review

- **Architecture**: matches the Microservices Architecture described in your SED — backend has clear service modules (auth, restaurants, recommendations, ratings, favorites).
- **Mock auth**: real Google OAuth requires a Google Cloud Console project and was substituted with a mock that simulates the 1–2 sec redirect (NFR-04).
- **Map**: uses a custom positional pin layout instead of `react-native-maps` because that library doesn't run on web without a Google API key. The implementation still demonstrates FR-17 (card/map toggle) and FR-24 (tap marker → bottom card).
- **AI recommendation engine**: rule-based per the AI Business Analyst priority order (dietary > preferences > rating > distance). Extending to a real LLM would mean swapping in an Anthropic API call inside `server.js → /api/ai/query`.
- **Persistence**: in-memory only (Map objects in server.js, React state in the app). For a production deployment you'd add PostgreSQL on AWS RDS as your physical architecture diagram shows.

---

## 🙋 Need help?

If something doesn't work, start the app with `npx expo start --clear` to clear the bundler cache.

Built with ❤️ by Team 7 LLC for CS-3354 Spring 2026.
