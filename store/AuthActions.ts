import {
  login,
  logout,
  persistLogin,
  restoreLogin,
  signUp,
  updateProfile,
} from "../model/Auth";

export enum AuthActionTypes {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  SIGNUP = "SIGNUP",
  AUTHERROR = "AUTHERROR",
}

export function doLogin(username: string, password: string) {
  return asyncLogin.bind(null, username, password);
}

async function asyncLogin(username: string, password: string, dispatch: any) {
  try {
    const user = await login(username, password);
    await persistLogin(user);
    return dispatch({ type: AuthActionTypes.LOGIN, user });
  } catch (error) {
    dispatch({ type: AuthActionTypes.AUTHERROR, error });
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
    const user = await signUp(email, password);
    await updateProfile(user, username, photo_url);
    dispatch({ type: AuthActionTypes.SIGNUP, user });
  } catch (error) {
    dispatch({ type: AuthActionTypes.AUTHERROR, error });
  }
}
