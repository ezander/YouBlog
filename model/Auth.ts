import * as firebase from "firebase";
import "firebase/auth";
import {
  loginUser,
  signUpUser,
  updateUserProfile,
} from "../src/FirebaseAuthTools";
import firebaseConfig from "../firebaseConfig.json";

import { AsyncStorage } from "react-native";

export interface User {
  localId: string;
  email: string;
  displayName?: string;
  profilePicture?: string;
  idToken: string;
  expiresIn: number;
  refreshToken?: string;
  registered?: boolean;
}

class SDK {
  static getAuth() {
    try {
      firebase.app();
    } catch (error) {
      firebase.initializeApp(firebaseConfig);
    }
    return firebase.auth();
  }

  static async userFromResponse(fbUser: firebase.User): User {
    return {
      localId: fbUser.uid,
      email: fbUser.email!,
      displayName: fbUser.displayName!,
      profilePicture: fbUser.photoURL!,
      idToken: fbUser.getIdToken(),
      expiresIn: undefined,
      refreshToken: fbUser.refreshToken,
      registered: undefined,
    };
  }

  static async login(email: string, password: string): Promise<User> {
    // firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error)
    const auth = SDK.getAuth();
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );

    if (!userCredential.user)
      throw Error("Firebase did not return a user structure");
    const user = SDK.userFromResponse(userCredential.user);
    
    return user;
  }

  static async logout() {
    const auth = SDK.getAuth();
    await auth.signOut()
    if( auth.currentUser ) {
        console.error("User not logged  out. what the fuck?")
    }
  }

  static async signUp(email: string, password: string): Promise<User> {
    throw Error("Not implemented");
    // const response = await signUpUser({ email, password }, firebaseConfig);
    // return REST.userFromResponse(response)
  }

  static async updateProfile(
    user: User,
    displayName?: string | null,
    profilePicture?: string | null
  ): Promise<User> {
    throw Error("Not implemented");
    // const response = await updateUserProfile(user.idToken, {displayName, photoUrl: profilePicture}, firebaseConfig)
    // return REST.userFromResponse(response)
  }

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
      registered: response.registered,
    };
  }

  static async login(email: string, password: string): Promise<User> {
    const response = await loginUser({ email, password }, firebaseConfig);
    return REST.userFromResponse(response);
  }

  static async signUp(email: string, password: string): Promise<User> {
    const response = await signUpUser({ email, password }, firebaseConfig);
    return REST.userFromResponse(response);
  }

  static async updateProfile(
    user: User,
    displayName?: string | null,
    profilePicture?: string | null
  ): Promise<User> {
    const response = await updateUserProfile(
      user.idToken,
      { displayName, photoUrl: profilePicture },
      firebaseConfig
    );
    return REST.userFromResponse(response);
  }

  static async logout() {
    // a noop for REST      
  }
}

const AuthAPI = SDK;

export const { login, signUp, updateProfile, logout } = AuthAPI;
