import {login, signUp} from '../model/Auth'

export enum AuthActionTypes {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    SIGNUP = "SIGNUP",
    AUTHERROR = "AUTHERROR"
}


export function doLogin(username: string, password: string) {
    return asyncLogin.bind(null, username, password);
}

async function asyncLogin(username: string, password: string, dispatch: any) {
    try {
        const user = await login(username, password);
        return dispatch({ type: AuthActionTypes.LOGIN, user });
    }
    catch (error) {
        dispatch({ type: AuthActionTypes.AUTHERROR, error });
    }
}

export function doLogout() {
    return { type: AuthActionTypes.LOGOUT };
}

export function doSignUp(username: string, password: string) {
    return asyncSignUp.bind(null, username, password);
}

async function asyncSignUp(username: string, password: string, dispatch: any) {
    try {
        const user = await signUp(username, password);
        dispatch({ type: AuthActionTypes.SIGNUP, user });
    }
    catch (error) {
        dispatch({ type: AuthActionTypes.AUTHERROR, error });
    }
}
