export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}

export class AppError extends Error {
}

export class FirebaseError extends AppError {
}

export class HTTPError extends AppError {
}

export function parseError(error : any) {
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
