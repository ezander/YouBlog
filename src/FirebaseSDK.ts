import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "../firebaseConfig.json";
import { authLogger } from "../config/Logging";

export function getApp() {
  try {
    return firebase.app();
  } catch (error) {
    const app = firebase.initializeApp(firebaseConfig);
    app.auth().onAuthStateChanged((user) => authLogger.debug("AuthState changed (SDK): loggedIn=", !!user));
    return app;
  }
}

export function getDB() {
  return getApp().firestore();
}

export function getAuth() {
  return getApp().auth();
}
