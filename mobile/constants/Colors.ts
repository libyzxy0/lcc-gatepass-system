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
}

export type ColorsType = {
  light: ColorThemeType;
  dark: ColorThemeType;
}

export const Colors = {
  light: {
    primary: "#1f58db",
    text: "#000000",
    textSecondary: "#8c8c8c",
    background: "#f7f7f7",
    border: "#e8e8e8",
    card: "#ffffff",
    input: "#f2f2f2",
    danger: "#e30f0f",
    warning: '#c8ac10',
    success: '#15c122',
    gray: '#bababa'
  },
  dark: {
    primary: "#1f58db",
    text: "#000000",
    textSecondary: "#8c8c8c",
    background: "#f7f7f7",
    border: "#e8e8e8",
    card: "#ffffff",
    input: "#f2f2f2",
    danger: "#e30f0f",
    warning: '#c8ac10',
    success: '#15c122',
    gray: '#bababa'
  }
} satisfies ColorsType;