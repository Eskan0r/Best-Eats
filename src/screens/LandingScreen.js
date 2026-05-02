import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { COLORS } from '../theme/colors';
import { Logo } from '../components/Header';

// Marketing Lead Q1: landing message
const LANDING_MESSAGE = 'Find the best rated restaurants in town. Satisfy your dietary needs and cravings. And more! Best Eats and Hilton Hotels are here for you!';

export const LandingScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Black header band with fusion logo */}
      <View style={styles.topBand}>
        <Logo light />
      </View>

      {/* Maroon main area with star pattern */}
      <View style={styles.mainArea}>
        {/* Decorative stars */}
        {STAR_POSITIONS.map((pos, i) => (
          <Text key={i} style={[styles.star, pos]}>★</Text>
        ))}

        {/* Plate logo emoji */}
        <View style={styles.plateLogo}>
          <Text style={styles.plateEmoji}>🍽️</Text>
          <Text style={styles.plateLabel}>BEST EATS</Text>
        </View>

        {/* Welcome message card */}
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>{LANDING_MESSAGE}</Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.ctaText}>Get Started Now!</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Team 7 LLC · Group 11 · v1.0</Text>
      </View>
    </ScrollView>
  );
};

const STAR_POSITIONS = [
  { top: 30, left: 30 }, { top: 60, right: 50 }, { top: 120, left: 60 },
  { top: 200, right: 30 }, { top: 280, left: 40 }, { top: 380, right: 60 },
  { top: 460, left: 80 }, { top: 540, right: 40 }, { top: 620, left: 30 },
  { top: 700, right: 50 },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.maroon,
  },
  content: {
    flexGrow: 1,
    minHeight: Platform.OS === 'web' ? 800 : undefined,
  },
  topBand: {
    backgroundColor: COLORS.black,
    padding: 32,
    paddingTop: Platform.OS === 'web' ? 32 : 60,
    alignItems: 'center',
  },
  mainArea: {
    flex: 1,
    backgroundColor: COLORS.maroon,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
    position: 'relative',
  },
  star: {
    position: 'absolute',
    color: COLORS.sage,
    fontSize: 22,
    opacity: 0.5,
  },
  plateLogo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.warmGray,
    marginVertical: 32,
  },
  plateEmoji: {
    fontSize: 70,
  },
  plateLabel: {
    color: COLORS.sage,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 4,
  },
  messageCard: {
    backgroundColor: COLORS.lightCream,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    width: '100%',
    maxWidth: 360,
  },
  messageText: {
    color: COLORS.maroon,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  ctaBtn: {
    backgroundColor: COLORS.sage,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  versionText: {
    color: COLORS.cream,
    opacity: 0.6,
    fontSize: 11,
    marginTop: 24,
  },
});
