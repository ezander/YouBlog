import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "../firebaseConfig.json";

export function getApp() {
  try {
    return firebase.app();
  } catch (error) {
    const app = firebase.initializeApp(firebaseConfig);
    // console.log("Initialised firebase: ", app);
    app.auth().onAuthStateChanged((user) => console.log("AuthState: ", !!user));
    return app;
  }
}

export function getDB() {
  return getApp().firestore();
}

export function getAuth() {
  return getApp().auth();
}
