import { Platform } from "react-native"

export const Colors = {
    primaryColor: "#4455DD",
    accentColor: "#785634",
}

// Android:
//   Sans: sans-serif, sans-serif-light, sans-serif-thin, sans-serif-condensed, sans-serif-medium
//      (Roboto, normal, notoserif = sans-serif)
//   Serif: serif
//   Mono: monospace
export const FontFaces = {
    monospace: Platform.select({ default: "monospace", ios: "Courier" }),
    serif: Platform.select({ default: "serif", ios: "Times New Roman" }),
    sansSerif: Platform.select({ default: "sans-serif", ios: "Arial" }),
}


export const HeaderTheme = {
    backgroundColor: Platform.select({ios: "white", default: Colors.primaryColor })
}


export const BlogFontSizes = {
    small: 10, 
    normal: 14, 
    large: 18, 
    xlarge: 22
}
export type BlogFontScale = keyof typeof BlogFontSizes

export const BlogTheme = {
    fontScale: "large" as BlogFontScale,
    textFontFamily: FontFaces.serif,
    codeFontFamily: FontFaces.monospace
}
