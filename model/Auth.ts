import { loginUser, signUpUser, updateUserProfile } from '../src/FirebaseAuthTools';
import firebaseConfig from '../firebaseConfig.json';

interface User {
    localId: string,
    email: string,
    displayName?: string,
    profilePicture?: string,
    idToken: string,
    expiresIn: number,
    refreshToken?: string,
    registered?: boolean
}

class SDK {
    // Not yet ...    
}

class REST {
    static userFromResponse(response: any): User {
        return {
            localId: response.localId,
            email: response.email,
            displayName: response.displayName,
            profilePicture: response.profilePicture,
            idToken: response.idToken,
            expiresIn: response.expiresIn,
            refreshToken: response.refreshToken,
            registered: response.registered
        }
    }

    static async login(email: string, password: string) : Promise<User> {
        const response = await loginUser({ email, password }, firebaseConfig);
        return REST.userFromResponse(response)
    }

    static async signUp(email: string, password: string) : Promise<User>{
        const response = await signUpUser({ email, password }, firebaseConfig);
        return REST.userFromResponse(response)
    }

    static async updateProfile(user: User, displayName?:string|null, profilePicture?:string|null) : Promise<User> {
        const response = await updateUserProfile(user.idToken, {displayName, photoUrl: profilePicture}, firebaseConfig)
        return REST.userFromResponse(response)
    }
}

const AuthAPI = REST

export const  {login, signUp} = AuthAPI
