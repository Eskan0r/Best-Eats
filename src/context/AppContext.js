import React, { createContext, useContext, useState, useCallback } from 'react';
import { RESTAURANTS, HILTON_LOCATION } from '../data/mockData';

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

const LANGUAGE_STRINGS = {
  English: { explore: 'Explore', forYou: 'For You', profile: 'Profile' },
  Espanol: { explore: 'Explorar', forYou: 'Para Ti', profile: 'Perfil' },
  Mandarin: { explore: '探索', forYou: '为你推荐', profile: '个人资料' },
  Japanese: { explore: '探索', forYou: 'あなたに', profile: 'プロフィール' },
  Hindi: { explore: 'खोजें', forYou: 'आपके लिए', profile: 'प्रोफ़ाइल' },
  Korean: { explore: '탐색', forYou: '추천', profile: '프로필' },
  Deutsch: { explore: 'Entdecken', forYou: 'Für Dich', profile: 'Profil' },
};

export const AppProvider = ({ children }) => {
  // Auth state — mock auth, any valid email/password works for demo
  const [user, setUser] = useState(null);

  // User location (real or fallback to Hilton location)
  const [userLocation, setUserLocation] = useState(HILTON_LOCATION);

  // Dietary preferences (FR-13) — start with none selected per FR-08 default behavior
  const [dietaryPrefs, setDietaryPrefs] = useState([]);

  // Cuisine preferences for AI ranking
  const [cuisinePrefs, setCuisinePrefs] = useState([]);

  // Favorites
  const [favorites, setFavorites] = useState([]);

  // Submitted ratings (FR-21 to FR-23)
  const [ratings, setRatings] = useState({}); // { restaurantId: { stars, review } }

  // Accessibility settings
  const [darkMode, setDarkMode] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [textSize, setTextSize] = useState(1); // multiplier: 0.85, 1, 1.15, 1.3
  const [language, setLanguage] = useState('English');

  // Notifications & location toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const t = useCallback((key) => {
    return LANGUAGE_STRINGS[language]?.[key] || LANGUAGE_STRINGS.English[key];
  }, [language]);

  // Auth functions
  const login = (email, password) => {
    if (!email || !password) return { ok: false, error: 'Please fill in all fields.' };
    if (!email.includes('@')) return { ok: false, error: 'Please enter a valid email.' };
    setUser({
      email,
      firstName: email.split('@')[0],
      lastName: '',
      passwordLastChanged: '3d ago',
    });
    return { ok: true };
  };

  const createAccount = ({ firstName, lastName, email, password, confirmPassword, agreed }) => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return { ok: false, error: 'All fields are required.' };
    }
    // FR-09 password requirements
    if (password.length < 12) return { ok: false, error: 'Password must be at least 12 characters.' };
    if (!/[A-Z]/.test(password)) return { ok: false, error: 'Password must contain at least 1 capital letter.' };
    if (!/[a-z]/.test(password)) return { ok: false, error: 'Password must contain at least 1 lowercase letter.' };
    if (!/[0-9]/.test(password)) return { ok: false, error: 'Password must contain at least 1 number.' };
    if (!/[!@%&#]/.test(password)) return { ok: false, error: 'Password must contain at least 1 special character (! @ % & #).' };
    if (password !== confirmPassword) return { ok: false, error: 'Passwords do not match.' };
    if (!agreed) return { ok: false, error: 'You must agree to the terms.' };
    if (!email.includes('@')) return { ok: false, error: 'Please enter a valid email.' };

    setUser({ email, firstName, lastName, passwordLastChanged: 'just now' });
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    setRatings({});
  };

  // Favorites
  const toggleFavorite = (restaurantId) => {
    setFavorites((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  // Dietary preferences
  const toggleDietary = (key) => {
    setDietaryPrefs((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Cuisine preferences
  const toggleCuisine = (cuisine) => {
    setCuisinePrefs((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  // Submit rating (FR-21, FR-22)
  const submitRating = (restaurantId, stars, review) => {
    setRatings((prev) => ({ ...prev, [restaurantId]: { stars, review, timestamp: Date.now() } }));
  };

  // Get filtered + ranked restaurants per AI Business Analyst priority order:
  // dietary restrictions > preferences/cuisine > rating > distance
  const getRecommendations = useCallback((options = {}) => {
    const { excludeNonMatchingDietary = false, maxRadius = 15 } = options;

    let list = RESTAURANTS.filter((r) => r.distance <= maxRadius);

    // Dietary filter logic
    if (dietaryPrefs.length > 0) {
      if (excludeNonMatchingDietary) {
        list = list.filter((r) => dietaryPrefs.every((p) => r.dietary.includes(p)));
      }
    }

    // Sort: dietary match count → cuisine match → rating → distance
    list.sort((a, b) => {
      const aDietaryMatch = dietaryPrefs.filter((p) => a.dietary.includes(p)).length;
      const bDietaryMatch = dietaryPrefs.filter((p) => b.dietary.includes(p)).length;
      if (aDietaryMatch !== bDietaryMatch) return bDietaryMatch - aDietaryMatch;

      const aCuisineMatch = cuisinePrefs.includes(a.cuisine) ? 1 : 0;
      const bCuisineMatch = cuisinePrefs.includes(b.cuisine) ? 1 : 0;
      if (aCuisineMatch !== bCuisineMatch) return bCuisineMatch - aCuisineMatch;

      if (a.rating !== b.rating) return b.rating - a.rating;
      return a.distance - b.distance;
    });

    return list;
  }, [dietaryPrefs, cuisinePrefs]);

  // Check if a restaurant fully meets dietary preferences
  const meetsDietary = (restaurant) => {
    if (dietaryPrefs.length === 0) return true;
    return dietaryPrefs.every((p) => restaurant.dietary.includes(p));
  };

  // Get unmet dietary restrictions for a restaurant
  const getUnmetDietary = (restaurant) => {
    return dietaryPrefs.filter((p) => !restaurant.dietary.includes(p));
  };

  // AI chatbot mock — parses query and filters restaurants accordingly
  const handleAiQuery = (query) => {
    const q = query.toLowerCase();
    let list = RESTAURANTS.filter((r) => r.distance <= 15);

    // Detect cuisines
    const detectedCuisine = ['italian','mexican','japanese','chinese','indian','thai','french','korean','vietnamese','mediterranean','american']
      .find((c) => q.includes(c));
    if (detectedCuisine) {
      list = list.filter((r) => r.cuisine.toLowerCase() === detectedCuisine);
    }

    // Detect dietary tags
    if (q.includes('vegetarian')) list = list.filter((r) => r.dietary.includes('vegetarian'));
    if (q.includes('vegan')) list = list.filter((r) => r.dietary.includes('vegan'));
    if (q.includes('gluten')) list = list.filter((r) => r.dietary.includes('glutenFree'));
    if (q.includes('halal')) list = list.filter((r) => r.dietary.includes('halal'));
    if (q.includes('keto')) list = list.filter((r) => r.dietary.includes('ketoFriendly'));

    // Detect price range
    if (q.includes('cheap') || q.includes('budget') || q.includes('low price')) {
      list = list.filter((r) => r.priceRange === '$' || r.priceRange === '$$');
    }
    if (q.includes('expensive') || q.includes('upscale') || q.includes('fancy') || q.includes('romantic')) {
      list = list.filter((r) => r.priceRange === '$$$' || r.priceRange === '$$$$');
    }

    // Detect open now
    if (q.includes('open') || q.includes('now') || q.includes('tonight')) {
      list = list.filter((r) => r.isOpen);
    }

    // Detect spicy
    if (q.includes('spicy')) {
      list = list.filter((r) => ['Indian','Thai','Mexican','Korean'].includes(r.cuisine));
    }

    list.sort((a, b) => b.rating - a.rating || a.distance - b.distance);
    return list.slice(0, 5);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        userLocation,
        setUserLocation,
        dietaryPrefs,
        cuisinePrefs,
        favorites,
        ratings,
        darkMode,
        colorBlindMode,
        textToSpeech,
        textSize,
        language,
        notificationsEnabled,
        locationEnabled,
        // setters
        setDarkMode,
        setColorBlindMode,
        setTextToSpeech,
        setTextSize,
        setLanguage,
        setNotificationsEnabled,
        setLocationEnabled,
        // actions
        login,
        createAccount,
        logout,
        toggleFavorite,
        toggleDietary,
        toggleCuisine,
        submitRating,
        getRecommendations,
        meetsDietary,
        getUnmetDietary,
        handleAiQuery,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
