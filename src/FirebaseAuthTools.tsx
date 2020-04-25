import axios from 'axios'
import { FirebaseConfig, parseError } from './FirebaseTools';

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
