import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, getThemeColors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { DIETARY_TAGS } from '../data/mockData';

// FR-18: Each card shows name, logo, distance, rating, price, dietary indicators
// + favorite button, view details, rate
// Sponsored cards: bigger, with images, "Sponsored Partner, Hilton Verified" label, "Menu" button
export const RestaurantCard = ({ restaurant, onRate, onViewMenu, compact = false }) => {
  const { favorites, toggleFavorite, meetsDietary, getUnmetDietary, ratings, textSize, darkMode } = useApp();
  const theme = getThemeColors(darkMode);
  const isFavorited = favorites.includes(restaurant.id);
  const userRating = ratings[restaurant.id];
  const fullyMeetsDietary = meetsDietary(restaurant);
  const unmetDietary = getUnmetDietary(restaurant);

  return (
    <View style={[
      styles.card,
      { backgroundColor: theme.cardBg, borderColor: theme.border },
      restaurant.isSponsored && styles.sponsoredCard,
    ]}>
      {/* Sponsored ribbon per FR-04 marketing spec */}
      {restaurant.isSponsored && (
        <View style={styles.sponsoredRibbon}>
          <Text style={styles.sponsoredRibbonText}>✦ SPONSORED PARTNER · HILTON VERIFIED</Text>
        </View>
      )}

      {/* Sponsored visual section */}
      {restaurant.isSponsored && (
        <View style={styles.sponsoredImage}>
          <Text style={styles.sponsoredEmoji}>{restaurant.emoji}</Text>
          <TouchableOpacity
            style={styles.heartFloating}
            onPress={() => toggleFavorite(restaurant.id)}
          >
            <Ionicons
              name={isFavorited ? 'heart' : 'heart-outline'}
              size={20}
              color={COLORS.maroon}
            />
          </TouchableOpacity>
          {restaurant.sponsoredTag && (
            <View style={styles.sponsoredTag}>
              <Text style={styles.sponsoredTagText}>+ {restaurant.sponsoredTag}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          {!restaurant.isSponsored && (
            <View style={styles.emojiCircle}>
              <Text style={styles.emojiSmall}>{restaurant.emoji}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: theme.text, fontSize: 17 * textSize }]} numberOfLines={1}>
                {restaurant.name}
              </Text>
              <Text style={[styles.price, { color: theme.textMuted }]}>{restaurant.priceRange}</Text>
            </View>
            <Text style={[styles.subline, { color: theme.textMuted, fontSize: 12 * textSize }]}>
              {restaurant.cuisine} · {restaurant.isOpen ? `Open until ${restaurant.closingTime}` : 'Closed'}
            </Text>
          </View>
          {!restaurant.isSponsored && (
            <TouchableOpacity onPress={() => toggleFavorite(restaurant.id)} style={styles.heartInline}>
              <Ionicons
                name={isFavorited ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorited ? COLORS.maroon : COLORS.warmGray}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.metaRow}>
          <View style={[styles.openBadge, { backgroundColor: restaurant.isOpen ? COLORS.sage : COLORS.warmGray }]}>
            <Text style={styles.openBadgeText}>● {restaurant.isOpen ? 'OPEN' : 'CLOSED'}</Text>
          </View>
          <Text style={[styles.metaText, { color: theme.textMuted }]}>📍 {restaurant.distance} mi</Text>
          <View style={styles.ratingChip}>
            <Text style={styles.ratingChipText}>★ {restaurant.rating}</Text>
          </View>
        </View>

        {/* Reason tag (AI explanation) */}
        {restaurant.reasonTag && (
          <View style={styles.reasonTag}>
            <Text style={styles.reasonTagText}>+ {restaurant.reasonTag}</Text>
          </View>
        )}

        {/* Dietary tags */}
        <View style={styles.tagsRow}>
          {restaurant.dietary.slice(0, 3).map((d) => (
            <View key={d} style={styles.dietaryTag}>
              <Text style={styles.dietaryTagText}>
                {DIETARY_TAGS[d]?.symbol} {DIETARY_TAGS[d]?.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Warning label when restaurant doesn't meet dietary preferences */}
        {!fullyMeetsDietary && unmetDietary.length > 0 && (
          <View style={styles.warningBadge}>
            <Ionicons name="warning-outline" size={13} color={COLORS.danger} />
            <Text style={styles.warningText}>
              Does not meet: {unmetDietary.map((u) => DIETARY_TAGS[u]?.label).join(', ')}
            </Text>
          </View>
        )}

        {/* User's existing rating */}
        {userRating && (
          <View style={styles.userRating}>
            <Text style={styles.userRatingText}>
              Your rating: {'★'.repeat(userRating.stars)}{'☆'.repeat(5 - userRating.stars)}
            </Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => onRate && onRate(restaurant)}
          >
            <Text style={styles.btnPrimaryText}>{userRating ? 'View Rating' : 'Rate'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            onPress={() => onViewMenu && onViewMenu(restaurant)}
          >
            <Text style={styles.btnSecondaryText}>{restaurant.isSponsored ? 'View Menu' : 'View Details'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sponsoredCard: {
    borderColor: COLORS.maroon,
    borderWidth: 2,
  },
  sponsoredRibbon: {
    backgroundColor: COLORS.maroon,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  sponsoredRibbonText: {
    color: COLORS.cream,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  sponsoredImage: {
    height: 110,
    backgroundColor: COLORS.lightCream,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sponsoredEmoji: {
    fontSize: 60,
  },
  heartFloating: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sponsoredTag: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    backgroundColor: COLORS.sage,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sponsoredTagText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  cardBody: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emojiCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.lightCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emojiSmall: {
    fontSize: 22,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: '700',
    flex: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  subline: {
    marginTop: 2,
  },
  heartInline: {
    padding: 4,
    marginLeft: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  openBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  openBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  metaText: {
    fontSize: 12,
  },
  ratingChip: {
    backgroundColor: COLORS.sage,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 'auto',
  },
  ratingChipText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  reasonTag: {
    backgroundColor: COLORS.lightCream,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  reasonTagText: {
    color: COLORS.sage,
    fontSize: 11,
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  dietaryTag: {
    borderColor: COLORS.sage,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  dietaryTagText: {
    color: COLORS.sage,
    fontSize: 10,
    fontWeight: '600',
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F1',
    padding: 6,
    borderRadius: 8,
    marginBottom: 8,
    gap: 4,
  },
  warningText: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  userRating: {
    backgroundColor: '#FFF8DC',
    padding: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  userRatingText: {
    color: COLORS.warning,
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: COLORS.maroon,
  },
  btnPrimaryText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  btnSecondary: {
    backgroundColor: COLORS.sage,
  },
  btnSecondaryText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
