export type ColorThemeType = {
  primary: string;
  text: string;
  textSecondary: string;
  background: string;
  border: string;
  card: string;
  input: string;
  danger: string;
  warning: string;
  success: string;
  gray: string;
  backgroundPinScreen: string;
  shadow: string;
}

export type ColorsType = {
  light: ColorThemeType;
  dark: ColorThemeType;
}

export const Colors = {
  light: {
    primary: "#2563EB",
    text: "#0F172A",
    textSecondary: "#64748B",
    background: "#F8FAFC",
    border: "#E2E8F0",
    card: "#FFFFFF",
    input: "#F1F5F9",
    danger: "#DC2626",
    warning: "#D97706",
    success: "#16A34A",
    gray: "#94A3B8",
    backgroundPinScreen: "#1E293B",
    shadow: "#0a1f40",
  },
  dark: {
    primary: "#3B82F6",
    text: "#E5E7EB",
    textSecondary: "#9CA3AF",
    background: "#0F172A",
    border: "#1F2937",
    card: "#111827",
    input: "#1F2937",
    danger: "#EF4444",
    warning: "#F59E0B",
    success: "#22C55E",
    gray: "#6B7280",
    backgroundPinScreen: "#1E293B",
    shadow: "#0a1f40",
  }
} satisfies ColorsType;
