import { useSelector } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import { ReduxLogger } from "../src/Logging";
import authReducer, { AuthState } from "./AuthReducer";
import blogReducer from "./BlogReducer";
import settingsReducer from "./SettingsReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  blog: blogReducer,
  settings: settingsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

const middleware = [ReduxThunk, ReduxLogger];
export const store = createStore(rootReducer, applyMiddleware(...middleware));

// this is more app specific, doesn't really belong here...
export function useAuthState() {
  return useSelector<RootState, AuthState>((state) => state.auth);
}
export function useIsLoggedIn() {
  const authState = useAuthState();
  const isLoggedIn = !!authState.user;
  return isLoggedIn;
}
