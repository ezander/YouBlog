import { logInUser, signUpUser } from '../src/FirebaseAuthTools'
import firebaseConfig from '../firebaseConfig.json'
import { ReactReduxContext } from 'react-redux'

export enum AuthActionTypes {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    SIGNUP = "SIGNUP",
    AUTHERROR = "AUTHERROR"
}

export function login(username: string, password: string) {
    return asyncLogin.bind(null, username, password)
}

async function asyncLogin(username: string, password: string, dispatch) {
    const email = username
    try {
        const logInResponse = await logInUser({ email, password }, firebaseConfig)
        return dispatch({ type: AuthActionTypes.LOGIN, user: logInResponse })
    }
    catch (error) {
        dispatch({ type: AuthActionTypes.AUTHERROR, error })
    }
}

export function logout() {
    return { type: AuthActionTypes.LOGOUT }
}

export function signUp(username: string, password: string) {
    return asyncSignUp.bind(null, username, password)
}

async function asyncSignUp(username: string, password: string, dispatch) {
    const email = username
    try {
        const signUpResponse = await signUpUser({ email, password }, firebaseConfig)
        dispatch({ type: AuthActionTypes.SIGNUP, user: signUpResponse })
    }
    catch (error) {
        dispatch({ type: AuthActionTypes.AUTHERROR, error })
    }
}
