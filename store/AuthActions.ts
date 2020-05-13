import {
  login,
  logout,
  persistLogin,
  restoreLogin,
  signUp,
  updateProfile,
  User,
} from "../model/Auth";
import { authLogger } from "../src/Logging";

export enum AuthActionTypes {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  SIGNUP = "SIGNUP",
}

export type AuthAction =
  | { type: AuthActionTypes.LOGIN; user: User }
  | { type: AuthActionTypes.LOGOUT }
  | { type: AuthActionTypes.SIGNUP; user: User };

export function doLogin(username: string, password: string) {
  return asyncLogin.bind(null, username, password);
}

async function asyncLogin(username: string, password: string, dispatch: any) {
  try {
    const user = await login(username, password);
    await persistLogin(user);
    return dispatch({ type: AuthActionTypes.LOGIN, user });
  } catch (error) {
    authLogger.info("Login failed", error.message);
    throw error;
  }
}

export function doRestoreLogin() {
  return asyncRestoreLogin;
}

async function asyncRestoreLogin(dispatch: any) {
  const user = await restoreLogin();
  return user && dispatch({ type: AuthActionTypes.LOGIN, user });
}

export function doLogout() {
  return asyncLogout;
}

async function asyncLogout(dispatch: any) {
  await logout();
  dispatch({ type: AuthActionTypes.LOGOUT });
}

export function doSignUp(
  email: string,
  password: string,
  username?: string,
  photo_url?: string
) {
  return asyncSignUp.bind(null, email, password, username, photo_url);
}

async function asyncSignUp(
  email: string,
  password: string,
  username: undefined | string,
  photo_url: undefined | string,
  dispatch: any
) {
  try {
    const _user = await signUp(email, password);
    const user = await updateProfile(_user, username, photo_url);
    dispatch({ type: AuthActionTypes.SIGNUP, user });
  } catch (error) {
    authLogger.info("Signup failed", error.message);
    throw error;
  }
}
