import * as firebase from "firebase";
import { AsyncStorage } from "react-native";
import firebaseConfig from "../firebaseConfig.json";
import {
  loginUser,
  signUpUser,
  updateUserProfile,
} from "../src/FirebaseAuthTools";
import * as FirebaseSDK from "./FirebaseSDK";

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
  static auth = FirebaseSDK.getAuth();

  static async userFromResponse(fbUser: firebase.User): Promise<User> {
    return {
      localId: fbUser.uid,
      email: fbUser.email!,
      displayName: fbUser.displayName!,
      profilePicture: fbUser.photoURL!,
      idToken: await fbUser.getIdToken(),
      expiresIn: -1,
      refreshToken: fbUser.refreshToken,
      registered: undefined,
    };
  }

  static async login(email: string, password: string): Promise<User> {
    // firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error)
    const userCredential = await SDK.auth.signInWithEmailAndPassword(
      email,
      password
    );

    if (!userCredential.user)
      throw Error("Firebase did not return a user structure");
    const user = SDK.userFromResponse(userCredential.user);

    return user;
  }

  static async logout() {
    await SDK.auth.signOut();
    if (SDK.auth.currentUser) {
      console.error("User not logged  out. what the fuck?");
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

  static async persistLogin(user: User) {
    // automatic with SDK, only tell the SDK to do so
    await SDK.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  }

  static async restoreLogin() {
    await SDK.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const fbUser = SDK.auth.currentUser;
    console.log(
      "Checked for current user: ",
      fbUser && [fbUser.displayName, fbUser.uid, await fbUser.getIdToken()]
    );
    return fbUser && SDK.userFromResponse(fbUser);
  }
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

  static async persistLogin(user: User) {
    return await AsyncStorage.setItem("LoginData", JSON.stringify(user));
  }

  static async restoreLogin() {
    const loginData = await AsyncStorage.getItem("LoginData");
    return loginData && JSON.parse(loginData);
  }
}

const AuthAPI = REST;

export const {
  login,
  signUp,
  updateProfile,
  logout,
  persistLogin,
  restoreLogin,
} = AuthAPI;
