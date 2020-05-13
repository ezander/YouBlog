import { Draft, produce } from "immer";
import { User } from "../model/Auth";
import { authLogger } from "../src/Logging";
import { AuthAction, AuthActionTypes } from "./AuthActions";

const initialState = {
  error: undefined as undefined | any,
  user: undefined as undefined | User,
};

export type AuthState = Readonly<typeof initialState>;

function authProducer(draft: Draft<AuthState>, action: AuthAction) {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
    case AuthActionTypes.SIGNUP:
      authLogger.info(
        `User ${action.user?.displayName} (${action.user?.email}) logged in or signed up.`
      );
      authLogger.debug(`User data: ${JSON.stringify(action.user)}`);
      draft.error = undefined;
      draft.user = action.user;
      break;
    case AuthActionTypes.LOGOUT:
      authLogger.info(
        `User ${draft.user?.displayName} (${draft.user?.email}) logged out.`
      );
      draft.error = undefined;
      draft.user = undefined;
      break;
  }
}

export const authReducer = produce(authProducer, initialState);

export default authReducer;
