// Best Eats brand colors per Marketing Lead spec (FR-04 / Marketing Lead Q2)
export const COLORS = {
  // Primary brand palette
  cream: '#C8BFC7',      // Light gray-pink, used for "Hilton" wordmark
  sage: '#7A9B76',       // Sage green, used for primary actions and "Best Eats" wordmark
  warmGray: '#8A7E72',   // Warm gray, secondary
  maroon: '#5A2328',     // Dark maroon, primary brand
  black: '#090302',      // Near-black, headers and dark mode

  // Functional
  white: '#FFFFFF',
  offWhite: '#FAF7F4',
  lightCream: '#F2EDE6',
  warning: '#C9A227',
  danger: '#A33B3B',

  // Card backgrounds
  cardBg: '#FFFFFF',
  cardBgDark: '#1A1614',

  // Text
  textDark: '#090302',
  textLight: '#FFFFFF',
  textMuted: '#6B5F55',
  textMutedLight: '#A8A29E',

  // Borders
  border: '#E5DDD5',
  borderDark: '#2D2522',
};

export const getThemeColors = (isDarkMode) => ({
  background: isDarkMode ? COLORS.black : COLORS.offWhite,
  cardBg: isDarkMode ? COLORS.cardBgDark : COLORS.cardBg,
  text: isDarkMode ? COLORS.textLight : COLORS.textDark,
  textMuted: isDarkMode ? COLORS.textMutedLight : COLORS.textMuted,
  border: isDarkMode ? COLORS.borderDark : COLORS.border,
  primary: COLORS.maroon,
  accent: COLORS.sage,
});
