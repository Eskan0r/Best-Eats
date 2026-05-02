import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { Logo } from '../components/Header';
import { useApp } from '../context/AppContext';

// FR-09 / FR-10: login + create account flow
// FR-14: single-factor auth — verify email exists, then password
// NFR-04: Google login redirect within 1-2 seconds (mock)
export const LoginScreen = ({ navigation }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    // NFR-03: lockout after 5 failed attempts for 15 minutes
    if (lockedUntil && Date.now() < lockedUntil) {
      const minsLeft = Math.ceil((lockedUntil - Date.now()) / 60000);
      setError(`Too many attempts. Try again in ${minsLeft} minutes.`);
      return;
    }

    const result = login(email, password);
    if (!result.ok) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockedUntil(Date.now() + 15 * 60 * 1000);
        setError('Too many failed attempts. Locked for 15 minutes.');
      } else {
        setError(`${result.error} (${5 - newAttempts} attempts left)`);
      }
      return;
    }
    setAttempts(0);
    navigation.replace('Main');
  };

  const handleGoogleLogin = () => {
    // Mock NFR-04: redirect within 1-2 seconds
    setTimeout(() => {
      const result = login('demo@gmail.com', 'GoogleAuthOK!1');
      if (result.ok) navigation.replace('Main');
    }, 1200);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.topBand}>
        <Logo light />
      </View>

      <View style={styles.mainArea}>
        {STAR_POSITIONS.map((pos, i) => (
          <Text key={i} style={[styles.star, pos]}>★</Text>
        ))}

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor={COLORS.warmGray}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor={COLORS.warmGray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>LOG IN</Text>
          </TouchableOpacity>

          <Text style={styles.divider}>🍽️</Text>

          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin}>
            <Text style={styles.googleText}>Log in with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => navigation.navigate('CreateAccount')}
          >
            <Text style={styles.createText}>Create Account</Text>
          </TouchableOpacity>

          <Text style={styles.demoNote}>
            Demo: Use any valid email format & password to log in
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const STAR_POSITIONS = [
  { top: 30, left: 30 }, { top: 60, right: 50 }, { top: 200, right: 30 },
  { top: 380, right: 60 }, { top: 540, right: 40 }, { top: 620, left: 30 },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.maroon },
  content: { flexGrow: 1 },
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
    paddingVertical: 32,
    position: 'relative',
  },
  star: { position: 'absolute', color: COLORS.sage, fontSize: 22, opacity: 0.5 },
  formCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 360,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    color: COLORS.black,
    fontSize: 14,
  },
  forgotText: {
    color: COLORS.maroon,
    fontSize: 11,
    textAlign: 'center',
    marginVertical: 4,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 4,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: COLORS.sage,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 12,
  },
  loginText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  divider: { textAlign: 'center', fontSize: 24, marginVertical: 8 },
  googleBtn: {
    backgroundColor: COLORS.warmGray,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  googleText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  createBtn: {
    backgroundColor: COLORS.black,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  createText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  demoNote: {
    color: COLORS.maroon,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
