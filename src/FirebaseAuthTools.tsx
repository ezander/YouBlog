import axios from 'axios'

interface LoginData {
    email: string,
    password: string
}
interface ProfileData {
    username?: string,
    avatar?: string
}
interface FirebaseConfig {
    apiKey: string,
    authDomain: string,
    databaseURL: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
    measurementId: string
}

const authBaseUrl = 'https://identitytoolkit.googleapis.com/v1'

export function authUrl(endpoint: string, firebaseConfig: FirebaseConfig, params?: string): string {
    const query = `?key=${firebaseConfig.apiKey}` + (params ? `&${params}` : '')
    return authBaseUrl + endpoint + query;
}

export class AppError extends Error {

}

export class FirebaseError extends AppError {
}

export class HTTPError extends AppError {
}

function parseError(error : any) {
    // mayRetry, changeDataPossible, changeDataNecessary, needsCheck, informDevs
    const {response} = error;
    const {status, statusText } = response

    if (status === 400) {
        const firebaseError = response.data.error
        return new FirebaseError(firebaseError.message)
    } else {
        return new HTTPError( `${status} - ${statusText}` )
    }
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
