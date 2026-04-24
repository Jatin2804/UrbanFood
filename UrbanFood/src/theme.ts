export const colors = {
  primary: "#FF8C00",
  primaryDark: "#E67E00",

  secondary: "#6BAA3A",
  secondaryLight: "#7FCB4D",

  background: "#F2F2F2",
  surface: "#FFFFFF",

  textPrimary: "#1C2A33",
  textSecondary: "#2B3943",
  textLight: "#6B7A86",

  border: "#E6E6E6",
  divider: "#EEEEEE",

  success: "#4CAF50",
  error: "#F44336",
  warning: "#FFC107",
};

export const theme = {
  colors,

  spacing: (factor: number) => factor * 8,

  borderRadius: {
    small: 6,
    medium: 12,
    large: 18,
  },

  typography: {
    heading: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    subHeading: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    body: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  },
};