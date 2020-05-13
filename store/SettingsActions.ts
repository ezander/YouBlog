import { BlogFontScale } from "../config/Theming";

export enum SettingsActionTypes {
  SET_BLOG_FONT_SCALE = "SET_BLOG_FONT_SCALE",
}

export interface Settings {
  blogFontScale: BlogFontScale
}

export type SettingsAction =
  | { type: SettingsActionTypes.SET_BLOG_FONT_SCALE; blogFontScale: BlogFontScale }

export function doSetFontScale(blogFontScale: BlogFontScale) {
  return { type: SettingsActionTypes.SET_BLOG_FONT_SCALE, blogFontScale};
}
