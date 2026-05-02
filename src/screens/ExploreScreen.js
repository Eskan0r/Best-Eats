import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS, getThemeColors } from '../theme/colors';
import { Header } from '../components/Header';
import { RestaurantCard } from '../components/RestaurantCard';
import { RatingModal } from '../components/RatingModal';
import { useApp } from '../context/AppContext';
import { HILTON_LOCATION } from '../data/mockData';

// FR-17: toggle card list / map view
// FR-19: search by name or cuisine
// FR-24: tap map marker → restaurant card at bottom
export const ExploreScreen = () => {
  const { getRecommendations, darkMode, setUserLocation, locationEnabled, textSize } = useApp();
  const theme = getThemeColors(darkMode);
  const [view, setView] = useState('cards'); // 'cards' | 'map'
  const [search, setSearch] = useState('');
  const [ratingTarget, setRatingTarget] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Using Hilton location');

  // Try to get user location, fall back to Hilton
  useEffect(() => {
    if (!locationEnabled) return;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          setUserLocation({
            name: 'Your Location',
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            address: 'Current location',
          });
          setLocationStatus('Using your location');
        }
      } catch (e) {
        // Web/iOS may fail silently; fallback already in place
        setLocationStatus('Using Hilton location (fallback)');
      }
    })();
  }, [locationEnabled]);

  // Get recommendations (Explore page shows ALL restaurants, with warning labels — Marketing Q5)
  let restaurants = getRecommendations({ excludeNonMatchingDietary: false });

  // FR-19: search filter
  if (search.trim()) {
    const q = search.toLowerCase();
    restaurants = restaurants.filter(
      (r) => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
    );
  }

  const sponsored = restaurants.filter((r) => r.isSponsored).slice(0, 3); // FR-05 max 3
  const regular = restaurants.filter((r) => !r.isSponsored);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header subtitle="EXPLORE" title="Nearby" />

      {/* Search + view toggle */}
      <View style={[styles.toolbar, { backgroundColor: theme.cardBg }]}>
        <View style={[styles.searchBox, { backgroundColor: theme.background }]}>
          <Ionicons name="search" size={16} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.text, fontSize: 13 * textSize }]}
            placeholder="Search restaurants, cuisines..."
            placeholderTextColor={theme.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[styles.toggleBtn, view === 'cards' && styles.toggleBtnActive]}
            onPress={() => setView('cards')}
          >
            <Ionicons name="grid-outline" size={14} color={view === 'cards' ? '#FFF' : theme.text} />
            <Text style={[styles.toggleText, { color: view === 'cards' ? '#FFF' : theme.text }]}>Cards</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, view === 'map' && styles.toggleBtnActive]}
            onPress={() => setView('map')}
          >
            <Ionicons name="map-outline" size={14} color={view === 'map' ? '#FFF' : theme.text} />
            <Text style={[styles.toggleText, { color: view === 'map' ? '#FFF' : theme.text }]}>Map</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.locationLabel, { color: theme.textMuted }]}>📍 {locationStatus}</Text>

      {view === 'cards' ? (
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          {sponsored.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>+ SPONSORED PARTNERS</Text>
              {sponsored.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} onRate={setRatingTarget} />
              ))}
            </>
          )}

          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 12 }]}>
            ALL RESTAURANTS · {regular.length} found
          </Text>
          {regular.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} onRate={setRatingTarget} />
          ))}

          {restaurants.length === 0 && (
            <Text style={[styles.empty, { color: theme.textMuted }]}>No restaurants match your search.</Text>
          )}
        </ScrollView>
      ) : (
        <MapView restaurants={restaurants} selected={selectedMarker} onSelect={setSelectedMarker} onRate={setRatingTarget} />
      )}

      <RatingModal
        visible={!!ratingTarget}
        restaurant={ratingTarget}
        onClose={() => setRatingTarget(null)}
      />
    </View>
  );
};

// Simplified cross-platform "map view" — positional pins on a styled background
// Real react-native-maps would require Google API keys and doesn't work on web by default
const MapView = ({ restaurants, selected, onSelect, onRate }) => {
  const { darkMode } = useApp();
  const theme = getThemeColors(darkMode);

  // Compute relative pin positions from lat/lng
  // Map area: latitude range and longitude range around Hilton
  const HILTON_LAT = HILTON_LOCATION.latitude;
  const HILTON_LNG = HILTON_LOCATION.longitude;
  const LAT_RANGE = 0.04; // roughly 2.5 miles
  const LNG_RANGE = 0.05;

  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapBackground}>
        {/* Grid lines for map feel */}
        {[...Array(5)].map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLine, styles.gridVertical, { left: `${(i + 1) * 16.66}%` }]} />
        ))}
        {[...Array(5)].map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLine, styles.gridHorizontal, { top: `${(i + 1) * 16.66}%` }]} />
        ))}

        {/* Hilton marker (center) */}
        <View style={[styles.hiltonMarker, { left: '46%', top: '46%' }]}>
          <View style={styles.hiltonPin}>
            <Text style={styles.hiltonPinText}>H</Text>
          </View>
          <Text style={styles.hiltonLabel}>HILTON</Text>
        </View>

        {/* Restaurant markers */}
        {restaurants.slice(0, 12).map((r) => {
          const xPercent = 50 + ((r.longitude - HILTON_LNG) / LNG_RANGE) * 50;
          const yPercent = 50 - ((r.latitude - HILTON_LAT) / LAT_RANGE) * 50;
          const x = Math.max(5, Math.min(85, xPercent));
          const y = Math.max(5, Math.min(85, yPercent));
          const isSelected = selected?.id === r.id;
          return (
            <TouchableOpacity
              key={r.id}
              style={[styles.pinContainer, { left: `${x}%`, top: `${y}%` }]}
              onPress={() => onSelect(r)}
            >
              <View style={[styles.pin, isSelected && styles.pinSelected]}>
                <Text style={styles.pinText}>{r.name.split(' ')[0]}</Text>
              </View>
              <View style={styles.pinTip} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bottom sheet with selected restaurant */}
      {selected && (
        <View style={[styles.bottomSheet, { backgroundColor: theme.cardBg }]}>
          <RestaurantCard restaurant={selected} onRate={onRate} compact />
        </View>
      )}
      {!selected && (
        <View style={[styles.bottomSheetHint, { backgroundColor: theme.cardBg }]}>
          <Text style={{ color: theme.textMuted, fontSize: 12 }}>Tap a marker to see restaurant details</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightCream,
    borderRadius: 20,
    padding: 2,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    gap: 4,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.maroon,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  locationLabel: {
    fontSize: 11,
    paddingHorizontal: 16,
    paddingVertical: 6,
    fontWeight: '500',
  },
  scrollArea: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: 10,
    color: COLORS.warmGray,
  },
  empty: { textAlign: 'center', marginTop: 32, fontSize: 13 },

  // Map view styles
  mapContainer: { flex: 1, position: 'relative' },
  mapBackground: {
    flex: 1,
    backgroundColor: '#E8E4DA',
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#D4CDBE',
  },
  gridVertical: {
    width: 1,
    height: '100%',
  },
  gridHorizontal: {
    height: 1,
    width: '100%',
  },
  hiltonMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  hiltonPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.cream,
  },
  hiltonPinText: {
    color: COLORS.cream,
    fontWeight: '900',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  hiltonLabel: {
    color: COLORS.black,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
  },
  pinContainer: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  pin: {
    backgroundColor: COLORS.maroon,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  pinSelected: {
    backgroundColor: COLORS.sage,
    transform: [{ scale: 1.15 }],
  },
  pinText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  pinTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.maroon,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 380,
  },
  bottomSheetHint: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    alignItems: 'center',
  },
});
