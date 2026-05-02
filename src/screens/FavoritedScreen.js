import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, getThemeColors } from '../theme/colors';
import { Header } from '../components/Header';
import { RestaurantCard } from '../components/RestaurantCard';
import { RatingModal } from '../components/RatingModal';
import { useApp } from '../context/AppContext';
import { RESTAURANTS } from '../data/mockData';

// Tourist Q1: favorites page with totals, open count, top rated, search bar (FR-11)
export const FavoritedScreen = ({ navigation }) => {
  const { favorites, darkMode, textSize } = useApp();
  const theme = getThemeColors(darkMode);
  const [search, setSearch] = useState('');
  const [ratingTarget, setRatingTarget] = useState(null);

  const favList = useMemo(
    () => RESTAURANTS.filter((r) => favorites.includes(r.id)),
    [favorites]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return favList;
    const q = search.toLowerCase();
    return favList.filter(
      (r) => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
    );
  }, [search, favList]);

  const openCount = favList.filter((r) => r.isOpen).length;
  const topRated = favList.length > 0
    ? favList.reduce((a, b) => (a.rating > b.rating ? a : b))
    : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        subtitle="MY PROFILE"
        title="Favorited Restaurants"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { fontSize: 22 * textSize }]}>{favList.length}</Text>
          <Text style={styles.statLabel}>TOTAL FAVORITES</Text>
        </View>
        <View style={styles.statBoxBordered}>
          <Text style={[styles.statValue, { fontSize: 22 * textSize }]}>{openCount}</Text>
          <Text style={styles.statLabel}>OPEN NOW</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValueSmall, { fontSize: 13 * textSize }]} numberOfLines={2}>
            {topRated?.name || '—'}
          </Text>
          <Text style={styles.statLabel}>TOP RATED</Text>
        </View>
      </View>

      <View style={[styles.searchBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Ionicons name="search" size={16} color={theme.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search your favorites..."
          placeholderTextColor={theme.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 14 }}>
        <Text style={[styles.label, { color: theme.textMuted }]}>
          {filtered.length} RESTAURANT{filtered.length === 1 ? '' : 'S'}
        </Text>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 36 }}>💔</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {favList.length === 0 ? 'No favorites yet' : 'No matches'}
            </Text>
            <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>
              {favList.length === 0
                ? 'Tap the ♡ icon on any restaurant card to save it here.'
                : 'Try a different search term.'}
            </Text>
          </View>
        ) : (
          filtered.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} onRate={setRatingTarget} />
          ))
        )}
      </ScrollView>

      <RatingModal
        visible={!!ratingTarget}
        restaurant={ratingTarget}
        onClose={() => setRatingTarget(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.maroon,
    paddingVertical: 16,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statBoxBordered: {
    flex: 1, alignItems: 'center',
    borderLeftWidth: 1, borderRightWidth: 1, borderColor: COLORS.cream,
  },
  statValue: {
    color: COLORS.cream,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  statValueSmall: {
    color: COLORS.cream,
    fontWeight: '700',
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  statLabel: {
    color: COLORS.cream,
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 4,
    fontWeight: '600',
    opacity: 0.85,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: { flex: 1, paddingVertical: 0 },
  scroll: { flex: 1 },
  label: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: 12,
  },
  empty: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
});
