import { produce } from "immer";
import { appLogger } from "../src/Logging";
import { SettingsActionTypes, SettingsAction, Settings } from "./SettingsActions";
import { BlogTheme } from "../config/Theming";

const initialState : Settings = {
  blogFontScale: BlogTheme.fontScale
};

function settingsProducer(draft: typeof initialState, action: SettingsAction) {
  switch (action.type) {
    case SettingsActionTypes.SET_BLOG_FONT_SCALE:
      appLogger.info(`Changed blog font scale to "${action.blogFontScale}"`)
      draft.blogFontScale = action.blogFontScale;
      break;
  }
}

export const settingsReducer = produce(settingsProducer, initialState);

export default settingsReducer;
