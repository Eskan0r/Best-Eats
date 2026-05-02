import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, getThemeColors } from '../theme/colors';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

export const AccountSettingsScreen = ({ navigation }) => {
  const {
    user, logout, darkMode,
    notificationsEnabled, setNotificationsEnabled,
    locationEnabled, setLocationEnabled,
  } = useApp();
  const theme = getThemeColors(darkMode);
  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U'
    : 'U';

  const confirmLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Log out of Best Eats?')) {
        logout();
        navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
      }
    } else {
      Alert.alert('Log out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: () => {
          logout();
          navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
        }},
      ]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        subtitle="MY PROFILE"
        title="Account Settings"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.userHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
          <View style={styles.avatarEdit}>
            <Ionicons name="add" size={12} color="#FFF" />
          </View>
        </View>
        <Text style={styles.userName}>
          {user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'Guest'}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>PROFILE</Text>
        <Section theme={theme}>
          <Row label="Full Name" value={user ? `${user.firstName} ${user.lastName}`.trim() : ''} theme={theme} />
          <Divider theme={theme} />
          <Row label="Email Address" value={user?.email || ''} theme={theme} />
          <Divider theme={theme} />
          <Row label="Profile Image" value="" hasArrow theme={theme} />
        </Section>

        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <Section theme={theme}>
          <Row label="Password" value={`Last changed ${user?.passwordLastChanged || ''}`} hasArrow theme={theme} />
          <Divider theme={theme} />
          <ToggleRow
            label="Notifications"
            value={notificationsEnabled}
            onChange={setNotificationsEnabled}
            theme={theme}
          />
          <Divider theme={theme} />
          <ToggleRow
            label="Location"
            sub="Allow app to access your location"
            value={locationEnabled}
            onChange={setLocationEnabled}
            theme={theme}
          />
        </Section>

        <Text style={styles.sectionLabel}>MORE OPTIONS</Text>
        <Section theme={theme}>
          <TouchableOpacity onPress={confirmLogout}>
            <Row label="Log Out" value="" hasArrow theme={theme} />
          </TouchableOpacity>
          <Divider theme={theme} />
          <Row label="Delete Account" value="" danger theme={theme} />
        </Section>
      </ScrollView>
    </View>
  );
};

const Section = ({ children, theme }) => (
  <View style={[styles.section, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
    {children}
  </View>
);

const Row = ({ label, value, hasArrow, danger, theme }) => (
  <View style={styles.row}>
    <Text style={[styles.rowLabel, { color: danger ? COLORS.danger : theme.text }]}>{label}</Text>
    <View style={styles.rowRight}>
      {value ? <Text style={[styles.rowValue, { color: theme.textMuted }]}>{value}</Text> : null}
      {hasArrow && <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />}
    </View>
  </View>
);

const ToggleRow = ({ label, sub, value, onChange, theme }) => (
  <View style={styles.row}>
    <View style={{ flex: 1 }}>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      {sub && <Text style={[styles.rowSub, { color: theme.textMuted }]}>{sub}</Text>}
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ true: COLORS.sage, false: COLORS.warmGray }}
      thumbColor="#FFF"
    />
  </View>
);

const Divider = ({ theme }) => <View style={[styles.divider, { backgroundColor: theme.border }]} />;

const styles = StyleSheet.create({
  container: { flex: 1 },
  userHeader: {
    backgroundColor: COLORS.black,
    alignItems: 'center',
    paddingBottom: 24,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: COLORS.warmGray,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: { color: '#FFF', fontSize: 24, fontWeight: '700' },
  avatarEdit: {
    position: 'absolute', bottom: 0, right: 0,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: COLORS.sage,
    alignItems: 'center', justifyContent: 'center',
  },
  userName: { color: COLORS.cream, fontWeight: '700', marginTop: 10, fontSize: 16 },
  userEmail: { color: COLORS.warmGray, fontSize: 12, marginTop: 2 },
  scrollContent: { padding: 14 },
  sectionLabel: {
    fontSize: 11,
    color: COLORS.warmGray,
    letterSpacing: 1.2,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  rowLabel: { fontSize: 14, fontWeight: '500' },
  rowSub: { fontSize: 11, marginTop: 2 },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: { fontSize: 13 },
  divider: { height: 1, marginHorizontal: 14 },
});
