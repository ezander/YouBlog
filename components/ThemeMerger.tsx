import deepmerge from "deepmerge";
import React, { useContext } from "react";
import { ThemeContext, ThemeProvider } from "react-native-elements";

// export function useTheme<T extends FullTheme = FullTheme>(): Partial<T> {
//   // const foo : FullTheme = null
//   const { theme } = useContext(ThemeContext);
//   return theme as Partial<T>;
// }

export function useTheme() {
  // const foo : FullTheme = null
  const { theme } = useContext(ThemeContext);
  return theme;
}

export interface ThemeMergerProps {
  theme: any;
  children: any;
}

export function ThemeMerger({ theme, children }: ThemeMergerProps) {
  const defTheme = useTheme();
  return (
    <ThemeProvider theme={deepmerge(defTheme, theme)}>{children}</ThemeProvider>
  );
}
