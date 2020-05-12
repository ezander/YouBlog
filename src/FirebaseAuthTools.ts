import axios from "axios";
import { FirebaseConfig, parseError } from "./FirebaseTools";

// https://cloud.google.com/identity-platform/docs/use-rest-api#section-sign-in-email-password

interface LoginData {
  email: string;
  password: string;
}
interface ProfileData {
  username?: string;
  avatar?: string;
}
const authBaseUrl = "https://identitytoolkit.googleapis.com/v1";

export function authUrl(
  endpoint: string,
  firebaseConfig: FirebaseConfig,
  params?: string
): string {
  const query = `?key=${firebaseConfig.apiKey}` + (params ? `&${params}` : "");
  return authBaseUrl + endpoint + query;
}

export async function signUpUser(
  { email, password }: LoginData,
  firebaseConfig: FirebaseConfig
) {
  const url = authUrl("/accounts:signUp", firebaseConfig);
  const body = { email, password, returnSecureToken: true };

  try {
    const response = await axios.post(url, body);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export interface LoginResponseType {
  idToken: string; // An Identity Platform ID token for the authenticated user.
  email: string; // The email for the authenticated user.
  refreshToken: string; // An Identity Platform refresh token for the authenticated user.
  expiresIn: string; // The number of seconds in which the ID token expires.
  localId: string; // The uid of the authenticated user.
  registered: boolean; // Whether the email is for an existing account.
}
export async function loginUser(
  { email, password }: LoginData,
  firebaseConfig: FirebaseConfig
) {
  const url = authUrl("/accounts:signInWithPassword", firebaseConfig);
  const body = { email, password, returnSecureToken: true };

  try {
    const response = await axios.post(url, body);
    return response.data as LoginResponseType;
  } catch (error) {
    throw parseError(error);
  }
}

export interface UserDataResponseType {
  localId: string; //The uid of the current user.
  email: string; //The email of the account.
  emailVerified: boolean; //Whether or not the account's email has been verified.
  displayName?: string; //The display name for the account.
  providerUserInfo: Array<any>; //List of all linked provider objects which contain "providerId" and "federatedId".
  photoUrl?: string; //The photo Url for the account.
  passwordHash: string; //Hash version of password.
  passwordUpdatedAt: number; //The timestamp, in milliseconds, that the account password was last changed.
  validSince: string; //The timestamp, in seconds, which marks a boundary, before which Identity Platform ID tokens are considered revoked.
  disabled?: boolean; //Whether the account is disabled or not.
  lastLoginAt: string; //The timestamp, in milliseconds, that the account last logged in at.
  lastRefreshAt: string; //The timestamp, in milliseconds, that ???
  createdAt: string; //The timestamp, in milliseconds, that the account was created at.
  customAuth?: boolean; //Whether the account is authenticated by the developer.
  tenantId?: string; //The tenant ID of the user. Only returned in multi-tenancy.
}
export async function getUserData(
  idToken: string,
  firebaseConfig: FirebaseConfig
) {
  const url = authUrl("/accounts:lookup", firebaseConfig);
  const body = { idToken };

  try {
    const response = await axios.post(url, body);
    return response.data.users[0] as UserDataResponseType;
  } catch (error) {
    throw parseError(error);
  }
}

interface UpdateProfile {
  displayName?: null | string;
  photoUrl?: null | string;
}
export async function updateUserProfile(
  idToken: string,
  { displayName, photoUrl }: UpdateProfile,
  firebaseConfig: FirebaseConfig
) {
  const url = authUrl("/accounts:update", firebaseConfig);
  const body: any = { idToken };
  const deleteAttribute = [];

  if (displayName) body.displayName = displayName;
  if (displayName === null) deleteAttribute.push("DISPLAY_NAME");

  if (photoUrl) body.photoUrl = photoUrl;
  if (photoUrl === null) deleteAttribute.push("PHOTO_URL");

  if (deleteAttribute.length) body.deleteAttribute = deleteAttribute;

  try {
    const response = await axios.post(url, body);
    return response.data as UserDataResponseType;
  } catch (error) {
    throw parseError(error);
  }
}

