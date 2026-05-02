import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, getThemeColors } from '../theme/colors';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

// FR-12 / NFR-06: WCAG 2.1 — dark mode, color blind, scalable text, multi-language
const LANGUAGES = ['English', 'Espanol', 'Mandarin', 'Japanese', 'Hindi', 'Korean', 'Deutsch'];

export const AccessibilityScreen = ({ navigation }) => {
  const {
    darkMode, setDarkMode,
    colorBlindMode, setColorBlindMode,
    textToSpeech, setTextToSpeech,
    textSize, setTextSize,
    language, setLanguage,
  } = useApp();
  const theme = getThemeColors(darkMode);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        subtitle="MY PROFILE"
        title="Accessibility"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.intro, { color: theme.textMuted }]}>
          Customize your experience for comfort and readability.
        </Text>

        <Text style={styles.sectionLabel}>VISUAL</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <ToggleRow
            theme={theme}
            label="Dark Mode"
            sub="Reduces eye strain in low light"
            value={darkMode}
            onChange={setDarkMode}
          />
          <Divider theme={theme} />
          <ToggleRow
            theme={theme}
            label="Color Blind Mode"
            sub="High contrast accessible palette"
            value={colorBlindMode}
            onChange={setColorBlindMode}
          />
          <Divider theme={theme} />
          <ToggleRow
            theme={theme}
            label="Text to Speech"
            sub="Reads screen content aloud"
            value={textToSpeech}
            onChange={setTextToSpeech}
          />
        </View>

        <Text style={styles.sectionLabel}>TEXT SIZE</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border, padding: 16 }]}>
          <View style={styles.sizeRow}>
            <Text style={[styles.sizeAA, { color: theme.text, fontSize: 12 }]}>A</Text>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${((textSize - 0.85) / 0.45) * 100}%` }]} />
              <View style={[styles.sliderThumb, { left: `${((textSize - 0.85) / 0.45) * 100}%` }]} />
            </View>
            <Text style={[styles.sizeAA, { color: theme.text, fontSize: 22 }]}>A</Text>
          </View>
          <View style={styles.sizeBtnRow}>
            {[
              { v: 0.85, label: 'Small' },
              { v: 1.0, label: 'Medium' },
              { v: 1.15, label: 'Large' },
              { v: 1.3, label: 'X-Large' },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.v}
                style={[styles.sizeBtn, textSize === opt.v && styles.sizeBtnActive]}
                onPress={() => setTextSize(opt.v)}
              >
                <Text style={[styles.sizeBtnText, textSize === opt.v && { color: '#FFF' }]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionLabel}>LANGUAGE</Text>
        <View style={styles.langGrid}>
          {LANGUAGES.map((lang) => {
            const selected = language === lang;
            return (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.langCell,
                  { backgroundColor: theme.cardBg, borderColor: theme.border },
                  selected && styles.langCellOn,
                ]}
                onPress={() => setLanguage(lang)}
              >
                <Text style={[styles.langText, { color: theme.text }, selected && { color: COLORS.maroon, fontWeight: '700' }]}>
                  {lang}{lang === 'English' ? ' (Default)' : ''}
                </Text>
                <View style={[styles.radio, selected && styles.radioOn]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveText}>Save Accessibility Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const ToggleRow = ({ label, sub, value, onChange, theme }) => (
  <View style={styles.row}>
    <View style={{ flex: 1 }}>
      <Text style={[styles.rowTitle, { color: theme.text }]}>{label}</Text>
      <Text style={[styles.rowSub, { color: theme.textMuted }]}>{sub}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ true: COLORS.maroon, false: COLORS.warmGray }}
      thumbColor="#FFF"
    />
  </View>
);

const Divider = ({ theme }) => <View style={{ height: 1, backgroundColor: theme.border, marginHorizontal: 14 }} />;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 32 },
  intro: { fontSize: 12, fontStyle: 'italic', marginBottom: 12 },
  sectionLabel: {
    fontSize: 11,
    color: COLORS.warmGray,
    letterSpacing: 1.2,
    fontWeight: '700',
    marginTop: 16,
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
    paddingVertical: 14,
  },
  rowTitle: { fontSize: 14, fontWeight: '700' },
  rowSub: { fontSize: 11, marginTop: 2 },
  sizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sizeAA: { fontWeight: '700' },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.lightCream,
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: 4,
    backgroundColor: COLORS.maroon,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -7,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.maroon,
    marginLeft: -9,
  },
  sizeBtnRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sizeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.lightCream,
    alignItems: 'center',
  },
  sizeBtnActive: {
    backgroundColor: COLORS.maroon,
  },
  sizeBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.maroon,
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langCell: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  langCellOn: {
    borderColor: COLORS.maroon,
    borderWidth: 1.5,
  },
  langText: { fontSize: 13 },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.warmGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: COLORS.maroon },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.maroon,
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
