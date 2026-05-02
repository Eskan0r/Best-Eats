import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, getThemeColors } from '../theme/colors';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';
import { DIETARY_TAGS, CUISINE_TYPES } from '../data/mockData';

// FR-13 / FR-16: dietary preferences with 8 options + multi-select checklist
export const DietaryPreferencesScreen = ({ navigation }) => {
  const { dietaryPrefs, toggleDietary, cuisinePrefs, toggleCuisine, darkMode } = useApp();
  const theme = getThemeColors(darkMode);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        subtitle="MY PROFILE"
        title="Dietary Preferences"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.intro, { color: theme.textMuted }]}>
          Select all that apply to personalize your recommendations.
        </Text>

        <Text style={styles.sectionLabel}>DIETARY RESTRICTIONS</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          {Object.entries(DIETARY_TAGS).map(([key, tag], idx, arr) => {
            const checked = dietaryPrefs.includes(key);
            return (
              <TouchableOpacity
                key={key}
                style={[styles.row, idx < arr.length - 1 && styles.rowBorder, { borderColor: theme.border }]}
                onPress={() => toggleDietary(key)}
              >
                <View style={[styles.checkbox, checked && styles.checkboxOn]}>
                  {checked && <Ionicons name="checkmark" size={14} color="#FFF" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowTitle, { color: theme.text }]}>
                    {tag.symbol} {tag.label}
                  </Text>
                  <Text style={[styles.rowDesc, { color: theme.textMuted }]}>{tag.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>CUISINE PREFERENCES</Text>
        <View style={styles.cuisineWrap}>
          {CUISINE_TYPES.map((c) => {
            const selected = cuisinePrefs.includes(c);
            return (
              <TouchableOpacity
                key={c}
                style={[
                  styles.cuisineChip,
                  selected && styles.cuisineChipOn,
                  { borderColor: theme.border },
                ]}
                onPress={() => toggleCuisine(c)}
              >
                <Text style={[styles.cuisineText, selected && { color: '#FFF' }, !selected && { color: theme.text }]}>
                  {c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveText}>Save Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 32 },
  intro: { fontSize: 13, marginBottom: 16, fontStyle: 'italic' },
  sectionLabel: {
    fontSize: 11,
    color: COLORS.warmGray,
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.warmGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: COLORS.maroon,
    borderColor: COLORS.maroon,
  },
  rowTitle: {
    fontWeight: '700',
    fontSize: 14,
  },
  rowDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  cuisineWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cuisineChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  cuisineChipOn: {
    backgroundColor: COLORS.sage,
    borderColor: COLORS.sage,
  },
  cuisineText: {
    fontSize: 12,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: COLORS.maroon,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  saveText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
