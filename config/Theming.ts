import { Platform } from "react-native";
import { IconTheme } from "../components/ThemedIcon";

export const Colors = {
  primaryColor: "#4455DD",
  accentColor: "#785634",
};

// Android:
//   Sans: sans-serif, sans-serif-light, sans-serif-thin, sans-serif-condensed, sans-serif-medium
//      (Roboto, normal, notoserif = sans-serif)
//   Serif: serif
//   Mono: monospace
export const FontFaces = {
  monospace: Platform.select({ default: "monospace", ios: "Courier" }),
  serif: Platform.select({ default: "serif", ios: "Times New Roman" }),
  sansSerif: Platform.select({ default: "sans-serif", ios: "Arial" }),
};

export const HeaderTheme: HeaderTheme = {
  iconTheme: "material",
  iconSize: 25,
  fontSize: 20,
  backgroundColor: Platform.select({
    ios: "white",
    default: Colors.primaryColor,
  }),
  iconColor: Platform.select({ ios: Colors.primaryColor, default: "white" }),
  textColor: Platform.select({ ios: Colors.primaryColor, default: "white" }),
};

export interface HeaderTheme {
  iconTheme: IconTheme;
  [others: string]: any;
}

export const BlogFontSizes = {
  small: 10,
  normal: 14,
  large: 18,
  xlarge: 22,
};
export type BlogFontScale = keyof typeof BlogFontSizes;

export const BlogTheme: BlogTheme = {
  fontScale: "large",
  textFontFamily: FontFaces.serif,
  codeFontFamily: FontFaces.monospace,
};
export interface BlogTheme {
  fontScale: BlogFontScale;
  [others: string]: any;
}
