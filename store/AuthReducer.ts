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
      authLogger.info(`User ${action.user?.displayName} (${action.user?.email}) logged in or signed up.`)
      authLogger.debug(`User data: ${JSON.stringify(action.user)}`)
      draft.error = undefined;
      draft.user = action.user;
      return draft;
    case AuthActionTypes.LOGOUT:
      authLogger.info(`User ${draft.user?.displayName} (${draft.user?.email}) logged out.`)
      draft.error = undefined;
      draft.user = undefined;
      return draft;
  }
  return draft;
}

export const authReducer = produce(authProducer, initialState);

export default authReducer;
