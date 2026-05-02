import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, getThemeColors } from '../theme/colors';
import { useApp } from '../context/AppContext';

// FR-04: Logo appears on landing and in header of every page
// "Hilton" in #C8BFC7, "Best Eats" in #7A9B76 smaller font size
export const Logo = ({ light = false, compact = false }) => {
  return (
    <View style={[styles.logoContainer, compact && styles.logoContainerCompact]}>
      <Text style={[
        styles.logoHilton,
        compact && styles.logoHiltonCompact,
        { color: light ? COLORS.cream : COLORS.maroon },
      ]}>
        HILTON
      </Text>
      <Text style={[
        styles.logoBestEats,
        compact && styles.logoBestEatsCompact,
        { color: COLORS.sage },
      ]}>
        BEST EATS
      </Text>
    </View>
  );
};

export const Header = ({ title, subtitle, onBack, showLogo = true, dark = true }) => {
  const { darkMode, textSize } = useApp();
  const t = getThemeColors(darkMode);

  return (
    <View style={[styles.header, { backgroundColor: COLORS.black }]}>
      <View style={styles.headerLeft}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color={COLORS.cream} />
          </TouchableOpacity>
        )}
        <View>
          {subtitle && <Text style={[styles.subtitle, { fontSize: 11 * textSize }]}>{subtitle}</Text>}
          {title && <Text style={[styles.title, { fontSize: 22 * textSize }]}>{title}</Text>}
        </View>
      </View>
      {showLogo && <Logo light compact />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'web' ? 18 : 50,
    paddingBottom: 18,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subtitle: {
    color: COLORS.cream,
    letterSpacing: 1.2,
    fontWeight: '600',
    opacity: 0.7,
  },
  title: {
    color: COLORS.cream,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  logoContainer: {
    alignItems: 'flex-end',
  },
  logoContainerCompact: {
    alignItems: 'flex-end',
  },
  logoHilton: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  logoHiltonCompact: {
    fontSize: 14,
    letterSpacing: 1.5,
  },
  logoBestEats: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  logoBestEatsCompact: {
    fontSize: 8,
  },
});
