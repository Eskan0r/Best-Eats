import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, getThemeColors } from '../theme/colors';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

export const ProfileScreen = ({ navigation }) => {
  const { user, favorites, dietaryPrefs, cuisinePrefs, darkMode, textSize } = useApp();
  const theme = getThemeColors(darkMode);

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U'
    : 'U';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header subtitle="MY PROFILE" title="Profile" />

      <View style={styles.userBlock}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
          <View style={styles.avatarEdit}>
            <Ionicons name="add" size={12} color="#FFF" />
          </View>
        </View>
        <Text style={[styles.userName, { color: theme.text, fontSize: 17 * textSize }]}>
          {user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'Guest'}
        </Text>
        <Text style={[styles.userEmail, { color: theme.textMuted }]}>{user?.email}</Text>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Favorites" value={favorites.length} />
        <Stat label="Diet Filters" value={dietaryPrefs.length} />
        <Stat label="Cuisines" value={cuisinePrefs.length} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 14 }}>
        <ProfileLink
          icon="settings-outline"
          iconBg="#E8E4DA"
          title="Account Settings"
          subtitle="Name, email, password, and more"
          onPress={() => navigation.navigate('AccountSettings')}
          theme={theme}
        />
        <ProfileLink
          icon="restaurant-outline"
          iconBg="#F2EDE6"
          title="Dietary & Cuisine Preferences"
          subtitle={`${dietaryPrefs.length} restrictions · ${cuisinePrefs.length} cuisines selected`}
          onPress={() => navigation.navigate('DietaryPreferences')}
          theme={theme}
        />
        <ProfileLink
          icon="heart"
          iconBg="#F8E4E4"
          title="Favorited Restaurants"
          subtitle={`${favorites.length} saved spot${favorites.length === 1 ? '' : 's'}`}
          onPress={() => navigation.navigate('Favorites')}
          theme={theme}
        />
        <ProfileLink
          icon="accessibility-outline"
          iconBg="#E0EAF7"
          title="Accessibility"
          subtitle="Display, text, and vision settings"
          onPress={() => navigation.navigate('Accessibility')}
          theme={theme}
        />
      </ScrollView>
    </View>
  );
};

const Stat = ({ label, value }) => {
  const { darkMode, textSize } = useApp();
  const theme = getThemeColors(darkMode);
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { fontSize: 24 * textSize }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const ProfileLink = ({ icon, iconBg, title, subtitle, onPress, theme }) => {
  const { textSize } = useApp();
  return (
    <TouchableOpacity
      style={[styles.linkCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
      onPress={onPress}
    >
      <View style={[styles.linkIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={COLORS.maroon} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.linkTitle, { color: theme.text, fontSize: 15 * textSize }]}>{title}</Text>
        <Text style={[styles.linkSub, { color: theme.textMuted }]}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  userBlock: {
    backgroundColor: COLORS.black,
    alignItems: 'center',
    paddingBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.warmGray,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '700',
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: COLORS.cream,
    fontWeight: '700',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.maroon,
    paddingVertical: 14,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.cream,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  statLabel: {
    color: COLORS.cream,
    fontSize: 11,
    opacity: 0.85,
    marginTop: 2,
  },
  scroll: { flex: 1 },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTitle: {
    fontWeight: '700',
  },
  linkSub: {
    fontSize: 12,
    marginTop: 2,
  },
});
