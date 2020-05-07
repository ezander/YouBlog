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
        return response.data as logInResponse
    }
    catch (error) {
        throw parseError(error)
    }

    // Sample response
    // {
    //   "localId": "ZY1rJK0eYLg...",
    //   "email": "[user@example.com]",
    //   "displayName": "",
    //   "idToken": "[ID_TOKEN]",
    //   "registered": true,
    //   "refreshToken": "[REFRESH_TOKEN]",
    //   "expiresIn": "3600"
    // }

    // EMAIL_NOT_FOUND: There is no user record corresponding to this identifier. The user may have been deleted.
    // INVALID_PASSWORD: The password is invalid or the user does not have a password.
    // USER_DISABLED: The user account has been disabled by an administrator.

}
