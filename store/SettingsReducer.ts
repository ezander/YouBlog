import { produce, Draft } from "immer";
import { appLogger } from "../config/Logging";
import { SettingsActionTypes, SettingsAction, Settings } from "./SettingsActions";
import { BlogTheme } from "../config/Theming";

const initialState : Settings = {
  blogFontScale: BlogTheme.fontScale
};

export type SettingsState = Readonly<typeof initialState>

function settingsProducer(draft: Draft<SettingsState>, action: SettingsAction) {
  switch (action.type) {
    case SettingsActionTypes.SET_BLOG_FONT_SCALE:
      appLogger.info(`Changed blog font scale to "${action.blogFontScale}"`)
      draft.blogFontScale = action.blogFontScale;
      break;
  }
}

export const settingsReducer = produce(settingsProducer, initialState);

export default settingsReducer;
