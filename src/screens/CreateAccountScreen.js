import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { Logo } from '../components/Header';
import { useApp } from '../context/AppContext';

// FR-09: 12+ chars, 1+ capital, 1+ lowercase, 1+ number, 1+ special from ! @ % & #
// FR-10: Create button blocked unless all fields filled
export const CreateAccountScreen = ({ navigation }) => {
  const { createAccount } = useApp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  // Live password requirement checks
  const checks = {
    length: password.length >= 12,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@%&#]/.test(password),
  };

  const allFieldsFilled = firstName && lastName && email && password && confirmPassword;

  const handleCreate = () => {
    setError('');
    const result = createAccount({ firstName, lastName, email, password, confirmPassword, agreed });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigation.replace('Main');
  };

  const Check = ({ ok, label }) => (
    <View style={styles.checkRow}>
      <Ionicons
        name={ok ? 'checkmark-circle' : 'ellipse-outline'}
        size={12}
        color={ok ? COLORS.sage : COLORS.maroon}
      />
      <Text style={[styles.checkText, ok && { color: COLORS.sage }]}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.topBand}>
        <Logo light />
      </View>

      <View style={styles.mainArea}>
        <View style={styles.formCard}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={22} color={COLORS.black} />
            </TouchableOpacity>
            <Text style={styles.formTitle}>Create Account</Text>
            <View style={{ width: 22 }} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter First Name"
            placeholderTextColor={COLORS.warmGray}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Last Name"
            placeholderTextColor={COLORS.warmGray}
            value={lastName}
            onChangeText={setLastName}
          />
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

          <View style={styles.requirements}>
            <Check ok={checks.length} label="Must be at least 12 characters" />
            <Check ok={checks.upper} label="Must contain at least one capital letter" />
            <Check ok={checks.lower} label="Must contain at least one lowercase letter" />
            <Check ok={checks.number} label="Must contain at least one number" />
            <Check ok={checks.special} label="Must contain at least one special character (! @ % & #)" />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Reenter Password"
            placeholderTextColor={COLORS.warmGray}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgreed(!agreed)}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
              {agreed && <Ionicons name="checkmark" size={14} color="#FFF" />}
            </View>
            <Text style={styles.checkboxLabel}>
              I agree to the Terms of Service and Privacy Policy
            </Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.createBtn, !allFieldsFilled && styles.createBtnDisabled]}
            onPress={handleCreate}
            disabled={!allFieldsFilled}
          >
            <Text style={styles.createText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

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
  },
  formCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 380,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
    color: COLORS.black,
    fontSize: 14,
  },
  requirements: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  checkText: {
    color: COLORS.maroon,
    fontSize: 11,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.maroon,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: COLORS.sage,
    borderColor: COLORS.sage,
  },
  checkboxLabel: {
    color: COLORS.black,
    fontSize: 12,
    flex: 1,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: '600',
  },
  createBtn: {
    backgroundColor: COLORS.sage,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  createBtnDisabled: {
    backgroundColor: COLORS.warmGray,
  },
  createText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});
