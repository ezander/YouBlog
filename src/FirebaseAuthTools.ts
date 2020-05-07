import axios from 'axios'
import { FirebaseConfig, parseError } from './FirebaseTools';

// https://cloud.google.com/identity-platform/docs/use-rest-api#section-sign-in-email-password

interface LoginData {
    email: string,
    password: string
}
interface ProfileData {
    username?: string,
    avatar?: string
}
const authBaseUrl = 'https://identitytoolkit.googleapis.com/v1'

export function authUrl(endpoint: string, firebaseConfig: FirebaseConfig, params?: string): string {
    const query = `?key=${firebaseConfig.apiKey}` + (params ? `&${params}` : '')
    return authBaseUrl + endpoint + query;
}

export async function signUpUser(
    { email, password }: LoginData,
    firebaseConfig: FirebaseConfig) {
    const url = authUrl('/accounts:signUp', firebaseConfig)
    const body = { email, password, returnSecureToken: true }

    try {
        const response = await axios.post(url, body)
        return response.data
    }
    catch (error) {
        throw parseError(error)
    }
}


export interface LogInResponseType {
    idToken: string,      // An Identity Platform ID token for the authenticated user.
    email: string,        // The email for the authenticated user.
    refreshToken: string, // An Identity Platform refresh token for the authenticated user.
    expiresIn: string,    // The number of seconds in which the ID token expires.
    localId: string,      // The uid of the authenticated user.
    registered: boolean,  // Whether the email is for an existing account.
}
export async function logInUser(
    { email, password }: LoginData,
    firebaseConfig: FirebaseConfig) {

    const url = authUrl('/accounts:signInWithPassword', firebaseConfig)
    const body = { email, password, returnSecureToken: true }

    try {
        const response = await axios.post(url, body)
        return response.data as LogInResponseType
    }
    catch (error) {
        throw parseError(error)
    }
    // EMAIL_NOT_FOUND, INVALID_PASSWORD, USER_DISABLED
}

export interface UserDataResponseType {
    localId: string, //The uid of the current user.
    email: string, //The email of the account.
    emailVerified: boolean, //Whether or not the account's email has been verified.
    displayName?: string, //The display name for the account.
    providerUserInfo: Array<any>,  	//List of all linked provider objects which contain "providerId" and "federatedId".
    photoUrl?: string, //The photo Url for the account.
    passwordHash: string, //Hash version of password.
    passwordUpdatedAt: number, //The timestamp, in milliseconds, that the account password was last changed.
    validSince: string, //The timestamp, in seconds, which marks a boundary, before which Identity Platform ID tokens are considered revoked.
    disabled?: boolean, //Whether the account is disabled or not.
    lastLoginAt: string, //The timestamp, in milliseconds, that the account last logged in at.
    lastRefreshAt: string, //The timestamp, in milliseconds, that ???
    createdAt: string, //The timestamp, in milliseconds, that the account was created at.
    customAuth?: boolean, //Whether the account is authenticated by the developer.
    tenantId?: string, //The tenant ID of the user. Only returned in multi-tenancy.
}
export async function getUserData(
    idToken: string,
    firebaseConfig: FirebaseConfig) {

    const url = authUrl('/accounts:lookup', firebaseConfig)
    const body = { idToken }

    try {
        const response = await axios.post(url, body)
        // console.log(response.data)
        return response.data.users[0] as UserDataResponseType
    }
    catch (error) {
        throw parseError(error)
    }
    // EMAIL_NOT_FOUND, INVALID_PASSWORD, USER_DISABLED
}


interface UpdateProfile {
    displayName?: null | string,
    photoUrl?: null | string
}
export async function updateProfile(
    idToken: string,
    {displayName, photoUrl} : UpdateProfile,
    firebaseConfig: FirebaseConfig) {
    
    const url = authUrl('/accounts:update', firebaseConfig)
    const body: any = {idToken}
    const deleteAttribute = []

    if( displayName ) body.displayName = displayName
    if( displayName===null) deleteAttribute.push("DISPLAY_NAME")

    if( photoUrl ) body.photoUrl = photoUrl
    if( photoUrl===null) deleteAttribute.push("PHOTO_URL")

    if( deleteAttribute.length) body.deleteAttribute = deleteAttribute

    try {
        const response = await axios.post(url, body)
        console.log(response.data)
        return response.data as UserDataResponseType
    }
    catch (error) {
        throw parseError(error)
    }
    // EMAIL_NOT_FOUND, INVALID_PASSWORD, USER_DISABLED
}














// API key not valid. Please pass a valid API key. (invalid API key provided)
// CREDENTIAL_MISMATCH: The custom token corresponds to a different GCP project.
// CREDENTIAL_TOO_OLD_LOGIN_AGAIN: The user's credential is no longer valid. The user must sign in again.
// EMAIL_EXISTS: The email address is already in use by another account.
// EMAIL_NOT_FOUND: There is no user record corresponding to this identifier. The user may have been deleted.
// EXPIRED_OOB_CODE: The action code has expired.
// FEDERATED_USER_ID_ALREADY_LINKED: This credential is already associated with a different user account.
// Invalid JSON payload received. Unknown name \"refresh_tokens\": Cannot bind query parameter. Field 'refresh_tokens' could not be found in request message.
// INVALID_CUSTOM_TOKEN: The custom token format is incorrect or the token is invalid for some reason (e.g. expired, invalid signature etc.)
// INVALID_EMAIL: The email address is badly formatted.
// INVALID_GRANT_TYPE: the grant type specified is invalid.
// INVALID_ID_TOKEN: The user's credential is no longer valid. The user must sign in again.
// INVALID_IDP_RESPONSE: The supplied auth credential is malformed or has expired.
// INVALID_OOB_CODE: The action code is invalid. This can happen if the code is malformed, expired, or has already been used.
// INVALID_PASSWORD: The password is invalid or the user does not have a password.
// INVALID_REFRESH_TOKEN: An invalid refresh token is provided.
// MISSING_REFRESH_TOKEN: no refresh token provided.
// OPERATION_NOT_ALLOWED: Anonymous user sign-in is disabled for this project.
// OPERATION_NOT_ALLOWED: Password sign-in is disabled for this project.
// OPERATION_NOT_ALLOWED: The corresponding provider is disabled for this project.
// TOKEN_EXPIRED: The user's credential is no longer valid. The user must sign in again.
// TOO_MANY_ATTEMPTS_TRY_LATER: We have blocked all requests from this device due to unusual activity. Try again later.
// USER_DISABLED: The user account has been disabled by an administrator.
// USER_NOT_FOUND: The user corresponding to the refresh token was not found. It is likely the user was deleted.
// USER_NOT_FOUND: There is no user record corresponding to this identifier. The user may have been deleted.
// WEAK_PASSWORD: The password must be 6 characters long or more.
