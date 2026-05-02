/**
 * Best Eats API Server
 * Team 7 LLC, Group 11
 *
 * Endpoints:
 *   GET  /api/health              — health check
 *   GET  /api/restaurants         — all restaurants (with optional ?dietary=&cuisine=&maxDistance=)
 *   GET  /api/restaurants/:id     — single restaurant
 *   POST /api/auth/login          — mock login (any email + password)
 *   POST /api/auth/register       — mock register
 *   POST /api/recommendations     — AI-style recommendations (rule-based mock)
 *   POST /api/ai/query            — natural-language restaurant query
 *   GET  /api/hilton              — current Hilton property info
 *
 * The mobile app works fully offline using local mock data,
 * so this server is optional but available for backend demo.
 */

const express = require('express');
const cors = require('cors');
const { RESTAURANTS, HILTON_LOCATION } = require('./restaurants');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Mock in-memory user store
const users = new Map();
const ratings = new Map();
const favorites = new Map();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Best Eats API', timestamp: new Date().toISOString() });
});

// Get Hilton property info
app.get('/api/hilton', (req, res) => {
  res.json(HILTON_LOCATION);
});

// Get all restaurants with optional filters
app.get('/api/restaurants', (req, res) => {
  const { dietary, cuisine, maxDistance = 15, search } = req.query;
  let list = [...RESTAURANTS];

  if (maxDistance) {
    list = list.filter((r) => r.distance <= parseFloat(maxDistance));
  }
  if (dietary) {
    const tags = dietary.split(',');
    list = list.filter((r) => tags.every((t) => r.dietary.includes(t)));
  }
  if (cuisine) {
    list = list.filter((r) => r.cuisine.toLowerCase() === cuisine.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (r) => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
    );
  }

  res.json({ count: list.length, restaurants: list });
});

// Get single restaurant
app.get('/api/restaurants/:id', (req, res) => {
  const r = RESTAURANTS.find((x) => x.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'Restaurant not found' });
  res.json(r);
});

// Mock login (FR-14 single-factor auth)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  // Mock auth — any valid email + password works
  res.json({
    success: true,
    user: { email, firstName: email.split('@')[0], lastName: '' },
    token: `mock-jwt-${Date.now()}`,
  });
});

// Mock register (FR-09 password validation)
app.post('/api/auth/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields required' });
  }
  if (password.length < 12) {
    return res.status(400).json({ error: 'Password must be at least 12 characters' });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least 1 capital letter' });
  }
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least 1 lowercase letter' });
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least 1 number' });
  }
  if (!/[!@%&#]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain a special character (! @ % & #)' });
  }

  users.set(email, { email, firstName, lastName, createdAt: Date.now() });
  res.json({
    success: true,
    user: { email, firstName, lastName },
    token: `mock-jwt-${Date.now()}`,
  });
});

// AI-style recommendations
// Per AI Business Analyst rules: prioritize dietary > preferences > rating > distance
app.post('/api/recommendations', (req, res) => {
  const { dietary = [], cuisine = [], maxRadius = 15 } = req.body;

  let list = RESTAURANTS.filter((r) => r.distance <= maxRadius);

  // Exclude restaurants that don't fully meet dietary restrictions (Recommendation page rule)
  if (dietary.length > 0) {
    list = list.filter((r) => dietary.every((d) => r.dietary.includes(d)));
  }

  // Sort by priority order
  list.sort((a, b) => {
    const aCuisineMatch = cuisine.includes(a.cuisine) ? 1 : 0;
    const bCuisineMatch = cuisine.includes(b.cuisine) ? 1 : 0;
    if (aCuisineMatch !== bCuisineMatch) return bCuisineMatch - aCuisineMatch;
    if (a.rating !== b.rating) return b.rating - a.rating;
    return a.distance - b.distance;
  });

  res.json({ count: list.length, recommendations: list });
});

// Natural-language query mock
app.post('/api/ai/query', (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });

  const q = query.toLowerCase();
  let list = RESTAURANTS.filter((r) => r.distance <= 15);

  const cuisines = ['italian','mexican','japanese','indian','thai','french','korean','vietnamese','mediterranean','american'];
  const detectedCuisine = cuisines.find((c) => q.includes(c));
  if (detectedCuisine) list = list.filter((r) => r.cuisine.toLowerCase() === detectedCuisine);

  if (q.includes('vegetarian')) list = list.filter((r) => r.dietary.includes('vegetarian'));
  if (q.includes('vegan')) list = list.filter((r) => r.dietary.includes('vegan'));
  if (q.includes('gluten')) list = list.filter((r) => r.dietary.includes('glutenFree'));
  if (q.includes('halal')) list = list.filter((r) => r.dietary.includes('halal'));
  if (q.includes('keto')) list = list.filter((r) => r.dietary.includes('ketoFriendly'));
  if (q.includes('cheap') || q.includes('budget')) {
    list = list.filter((r) => r.priceRange === '$' || r.priceRange === '$$');
  }
  if (q.includes('romantic') || q.includes('upscale')) {
    list = list.filter((r) => r.priceRange === '$$$' || r.priceRange === '$$$$');
  }
  if (q.includes('open') || q.includes('tonight')) list = list.filter((r) => r.isOpen);
  if (q.includes('spicy')) {
    list = list.filter((r) => ['Indian','Thai','Mexican','Korean'].includes(r.cuisine));
  }

  list.sort((a, b) => b.rating - a.rating || a.distance - b.distance);
  res.json({ query, count: list.length, results: list.slice(0, 5) });
});

// Submit a rating (FR-21, FR-22)
app.post('/api/ratings', (req, res) => {
  const { userId, restaurantId, stars, review } = req.body;
  if (!userId || !restaurantId || !stars) {
    return res.status(400).json({ error: 'userId, restaurantId, and stars required' });
  }
  if (stars < 1 || stars > 5) {
    return res.status(400).json({ error: 'Stars must be between 1 and 5' });
  }
  const key = `${userId}:${restaurantId}`;
  ratings.set(key, { userId, restaurantId, stars, review, timestamp: Date.now() });
  res.json({ success: true, rating: ratings.get(key) });
});

// Get a user's rating for a restaurant
app.get('/api/ratings/:userId/:restaurantId', (req, res) => {
  const key = `${req.params.userId}:${req.params.restaurantId}`;
  const rating = ratings.get(key);
  if (!rating) return res.status(404).json({ error: 'No rating found' });
  res.json(rating);
});

// Toggle favorite
app.post('/api/favorites/toggle', (req, res) => {
  const { userId, restaurantId } = req.body;
  if (!userId || !restaurantId) {
    return res.status(400).json({ error: 'userId and restaurantId required' });
  }
  if (!favorites.has(userId)) favorites.set(userId, new Set());
  const set = favorites.get(userId);
  if (set.has(restaurantId)) {
    set.delete(restaurantId);
    return res.json({ favorited: false, count: set.size });
  }
  set.add(restaurantId);
  res.json({ favorited: true, count: set.size });
});

// Get user favorites
app.get('/api/favorites/:userId', (req, res) => {
  const set = favorites.get(req.params.userId) || new Set();
  const list = RESTAURANTS.filter((r) => set.has(r.id));
  res.json({ count: list.length, favorites: list });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════');
  console.log('  Best Eats API Server');
  console.log('  Team 7 LLC, Group 11');
  console.log('═══════════════════════════════════════════════');
  console.log(`  Listening on http://localhost:${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/api/health`);
  console.log(`  Restaurants:  http://localhost:${PORT}/api/restaurants`);
  console.log('═══════════════════════════════════════════════');
});
