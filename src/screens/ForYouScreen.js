import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, getThemeColors } from '../theme/colors';
import { Header } from '../components/Header';
import { RestaurantCard } from '../components/RestaurantCard';
import { RatingModal } from '../components/RatingModal';
import { useApp } from '../context/AppContext';

// FR-08: For You / Recommendation page
// Excludes restaurants that don't fully meet dietary restrictions (per AI rules)
// Quick-select prompts + AI text input bar
const QUICK_PROMPTS = [
  'Something spicy nearby',
  'Romantic dinner for two',
  'Quick lunch under $15',
  'Vegetarian Italian',
];

export const ForYouScreen = () => {
  const { getRecommendations, handleAiQuery, dietaryPrefs, darkMode, textSize } = useApp();
  const theme = getThemeColors(darkMode);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResults, setAiResults] = useState(null);
  const [ratingTarget, setRatingTarget] = useState(null);

  // Recommendation page excludes restaurants that don't fully meet dietary restrictions
  const recommendations = getRecommendations({ excludeNonMatchingDietary: true });
  const sponsored = recommendations.filter((r) => r.isSponsored).slice(0, 3);
  const regular = recommendations.filter((r) => !r.isSponsored);

  const handleAiSubmit = (query) => {
    if (!query.trim()) return;
    const results = handleAiQuery(query);
    setAiResults({ query, results });
    setAiQuery('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header subtitle="FOR YOU" title="Tailored picks" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.intro}>
          <Text style={[styles.heading, { color: theme.text, fontSize: 22 * textSize }]}>For You</Text>
          <Text style={[styles.subline, { color: theme.textMuted }]}>
            Tailored to your taste · within 15 mi
            {dietaryPrefs.length > 0 && ` · ${dietaryPrefs.length} dietary filter${dietaryPrefs.length > 1 ? 's' : ''}`}
          </Text>
        </View>

        {/* AI query results section */}
        {aiResults && (
          <View style={[styles.aiResultBanner, { backgroundColor: theme.cardBg }]}>
            <View style={styles.aiResultHeader}>
              <Ionicons name="sparkles" size={16} color={COLORS.sage} />
              <Text style={[styles.aiResultTitle, { color: theme.text }]}>
                Results for: "{aiResults.query}"
              </Text>
              <TouchableOpacity onPress={() => setAiResults(null)}>
                <Ionicons name="close" size={18} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            {aiResults.results.length === 0 ? (
              <Text style={[styles.aiNoResults, { color: theme.textMuted }]}>
                No restaurants matched. Try another search.
              </Text>
            ) : (
              aiResults.results.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} onRate={setRatingTarget} />
              ))
            )}
          </View>
        )}

        {!aiResults && (
          <>
            {sponsored.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>+ SPONSORED PARTNERS · Hilton Verified</Text>
                {sponsored.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} onRate={setRatingTarget} />
                ))}
              </>
            )}

            <Text style={[styles.sectionTitle, { color: theme.textMuted, marginTop: 12 }]}>
              ✦ RECOMMENDED FOR YOU · {regular.length} picks
            </Text>
            {regular.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 32 }}>🍽️</Text>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>No matches yet</Text>
                <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>
                  Try adjusting your dietary preferences in Profile.
                </Text>
              </View>
            ) : (
              regular.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} onRate={setRatingTarget} />
              ))
            )}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* AI chatbot input bar (above bottom nav) */}
      <View style={[styles.aiBarContainer, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptsScroll}>
          {QUICK_PROMPTS.map((p) => (
            <TouchableOpacity
              key={p}
              style={styles.quickPrompt}
              onPress={() => handleAiSubmit(p)}
            >
              <Text style={styles.quickPromptText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.aiInputRow}>
          <Ionicons name="sparkles" size={14} color={COLORS.sage} />
          <TextInput
            style={[styles.aiInput, { color: theme.text }]}
            placeholder="Ask for a recommendation..."
            placeholderTextColor={theme.textMuted}
            value={aiQuery}
            onChangeText={setAiQuery}
            onSubmitEditing={() => handleAiSubmit(aiQuery)}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => handleAiSubmit(aiQuery)}
          >
            <Ionicons name="arrow-up" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

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
  scroll: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 24 },
  intro: { marginBottom: 16 },
  heading: {
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 4,
  },
  subline: { fontSize: 12 },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: 10,
  },
  aiResultBanner: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.sage,
  },
  aiResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiResultTitle: {
    flex: 1,
    fontWeight: '700',
    fontSize: 13,
  },
  aiNoResults: {
    fontStyle: 'italic',
    fontSize: 13,
    paddingVertical: 12,
  },
  emptyState: {
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
  aiBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  promptsScroll: {
    marginBottom: 8,
    flexGrow: 0,
  },
  quickPrompt: {
    backgroundColor: COLORS.black,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
  },
  quickPromptText: {
    color: COLORS.cream,
    fontSize: 11,
    fontWeight: '500',
  },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  aiInput: {
    flex: 1,
    color: COLORS.cream,
    fontSize: 13,
    paddingVertical: 0,
  },
  sendBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.warmGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
