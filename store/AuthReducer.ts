import { produce } from "immer";
import { AuthActionTypes } from "./AuthActions";
import { authLogger } from "../src/Logging";

const initialState = {
  error: undefined,
  user: undefined,
};

// @ts-ignore
function authProducer(draft, action) {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
    case AuthActionTypes.SIGNUP:
      authLogger.info("User " + JSON.stringify(action.user) + " logged in or signed up.")
      draft.error = undefined;
      draft.user = action.user;
      return draft;
    case AuthActionTypes.LOGOUT:
      draft.error = undefined;
      draft.user = undefined;
      return draft;
    // case AuthActionTypes.AUTHERROR:
    //   draft.error = action.error;
    //   draft.user = undefined;
    //   return draft;
  }
  return draft;
}

export const authReducer = produce(authProducer, initialState);

export default authReducer;
