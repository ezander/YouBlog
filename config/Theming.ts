import chroma from "chroma-js";
import { Platform } from "react-native";
import { IconTheme } from "../components/ThemedIcon";
import * as Font from "expo-font";

// const primaryColor = "#4455DD",
// const accentColor = "#785634",
const primaryColor = "#5b3142";
const accentColor = "#314b5b";
const paperColor = "#e4e1cc";

export const Colors = {
  primaryColor: primaryColor,
  accentColor: accentColor,
  paperColor: paperColor,

  primaryDark: chroma(primaryColor).darken().hex(),
  primaryLight: chroma(primaryColor).brighten().hex(),
  paperLight: chroma(paperColor).brighten(0.2).hex(),
};

// Android:
//   Sans: sans-serif, sans-serif-light, sans-serif-thin, sans-serif-condensed, sans-serif-medium
//      (Roboto, normal, notoserif = sans-serif)
//   Serif: serif
//   Mono: monospace
export const FontFaces = {
  monospace: Platform.select({ default: "monospace", ios: "Courier" }),
  // serif: Platform.select({ default: "serif", ios: "Times New Roman" }),
  serif: "Baskerville",
  // serif: "Pacifico",
  sansSerif: Platform.select({ default: "sans-serif", ios: "Arial" }),
};

export async function loadFonts() {
  try {
    const fontMap = {
      Baskerville: require("../assets/fonts/LibreBaskerville-Regular.otf"),
      Playfair: require("../assets/fonts/PlayfairDisplay-Regular.otf"),
      PlayfairSC: require("../assets/fonts/PlayfairDisplaySC-Regular.otf"),
      Pacifico: require("../assets/fonts/Pacifico.ttf"),
      MyUnderwood: require("../assets/fonts/MyUnderwood.ttf"),
    };
    return await Font.loadAsync(fontMap);
  } catch (e) {
    console.log(e.message);
  }
}

export const HeaderTheme: HeaderTheme = {
  iconTheme: "material",
  iconSize: 25,
  fontSize: 20,
  backgroundColor: Platform.select({
    ios: "white",
    default: Colors.primaryColor,
  }),
  iconColor: Platform.select({
    ios: Colors.primaryColor,
    default: Colors.paperLight,
  }),
  textColor: Platform.select({
    ios: Colors.primaryColor,
    default: Colors.paperLight,
  }),
};

export interface HeaderTheme {
  iconTheme: IconTheme;
  [others: string]: any;
}


export const GeneralTheme = {
  headingStyle: {
    // fontFamily: "Pacifico",
    fontFamily: "MyUnderwood",
    fontSize: 36
  },
  screen: {
    backgroundColor: Colors.paperColor
  },
  listItems: {
    title: {
      fontFamily: "Baskerville",
      fontSize: 20
    },
    subtitle: {
      fontFamily: "Baskerville",
      fontSize: 16
    }
  }
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
  backgroundColor: Colors.paperLight
};
export interface BlogTheme {
  fontScale: BlogFontScale;
  textFontFamily: string,
  codeFontFamily: string,
  backgroundColor: string
}
