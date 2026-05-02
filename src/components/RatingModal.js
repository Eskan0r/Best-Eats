import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TouchableOpacity, TextInput,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { useApp } from '../context/AppContext';

// FR-21: Bottom-sheet rating with star selector + optional review
// FR-22: Confirmation banner upon submit
// FR-23: Existing rating shows "View Rating" with edit/cancel options
export const RatingModal = ({ visible, restaurant, onClose }) => {
  const { ratings, submitRating } = useApp();
  const existing = restaurant ? ratings[restaurant.id] : null;
  const [stars, setStars] = useState(existing?.stars || 0);
  const [review, setReview] = useState(existing?.review || '');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (visible) {
      setStars(existing?.stars || 0);
      setReview(existing?.review || '');
      setConfirmed(false);
    }
  }, [visible, restaurant?.id]);

  if (!restaurant) return null;

  const handleSubmit = () => {
    if (stars === 0) return;
    submitRating(restaurant.id, stars, review);
    setConfirmed(true);
    setTimeout(() => { onClose(); }, 1400);
  };

  const ratingLabel = ['', 'Poor', 'Okay', 'Good', 'Great', 'Excellent'][stars];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {confirmed && (
            <View style={styles.confirmBanner}>
              <Text style={styles.confirmText}>✓ Your rating has been submitted!</Text>
            </View>
          )}

          <View style={styles.restaurantRow}>
            <View style={styles.emojiCircle}>
              <Text style={{ fontSize: 24 }}>{restaurant.emoji}</Text>
            </View>
            <View>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.restaurantSub}>
                {restaurant.distance} mi · {restaurant.cuisine} · {restaurant.isOpen ? `Open until ${restaurant.closingTime}` : 'Closed'}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>YOUR RATING</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setStars(n)}>
                <Text style={[styles.star, n <= stars && styles.starActive]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          {stars > 0 && (
            <Text style={styles.starLabel}>{stars} out of 5 — {ratingLabel}!</Text>
          )}

          <Text style={styles.sectionLabel}>LEAVE A REVIEW (OPTIONAL)</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience..."
            placeholderTextColor={COLORS.warmGray}
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={[styles.submitBtn, stars === 0 && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={stars === 0}
          >
            <Text style={styles.submitText}>{existing ? 'Update Rating' : 'Submit Rating'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.warmGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  confirmBanner: {
    backgroundColor: COLORS.sage,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  confirmText: {
    color: '#FFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  emojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.lightCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  restaurantName: {
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.black,
  },
  restaurantSub: {
    color: COLORS.warmGray,
    fontSize: 12,
  },
  sectionLabel: {
    fontSize: 11,
    color: COLORS.warmGray,
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 4,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  star: {
    fontSize: 44,
    color: COLORS.warmGray,
  },
  starActive: {
    color: COLORS.maroon,
  },
  starLabel: {
    textAlign: 'center',
    color: COLORS.maroon,
    fontWeight: '600',
    marginBottom: 16,
  },
  reviewInput: {
    backgroundColor: COLORS.lightCream,
    borderRadius: 10,
    padding: 12,
    minHeight: 70,
    textAlignVertical: 'top',
    color: COLORS.black,
    marginBottom: 18,
  },
  submitBtn: {
    backgroundColor: COLORS.maroon,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitBtnDisabled: {
    backgroundColor: COLORS.warmGray,
  },
  submitText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  cancelText: {
    color: COLORS.warmGray,
    textAlign: 'center',
    fontSize: 14,
  },
});
