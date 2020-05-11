import { createStackNavigator } from "@react-navigation/stack";
import React, { useCallback } from "react";
import LoadingScreen from "../components/LoadingScreen";
import TextScreen from "../components/TextScreen";
import firebaseConfig from "../firebaseConfig.json";
import BlogListScreen from "../screens/BlogListScreen";
import { useAsyncAction } from "../src/AsyncTools";
import { signUpUser } from "../src/FirebaseAuthTools";

const Stack = createStackNavigator();

let counter = 0;
export default function App() {
  console.log(firebaseConfig);

  const email = "elmar.zander5@googlemail.com";
  const password = "29347";
  const signUpUserFunc = useCallback(
    () => signUpUser({ email, password }, firebaseConfig),
    [email, password, firebaseConfig]
  );

  const { hasRun, isWorking, error, result } = useAsyncAction(signUpUserFunc);

  ++counter;
  console.log({ counter, hasRun, isWorking, error, result });

  return (
    <Stack.Navigator>
      {!hasRun || isWorking ? (
        <Stack.Screen name="Start">
          {() => <LoadingScreen text="Loading blog entries..." />}
        </Stack.Screen>
      ) : !!error ? (
        <Stack.Screen name="Start">
          {() => <TextScreen text={`An error occurred: ${error}`} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Blog entries" component={BlogListScreen} />
      )}
    </Stack.Navigator>
  );
}
